-- 1. Update has_role function to use admin_users
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.has_role(uuid, text);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = _user_id AND LOWER(role) = LOWER(_role) AND is_active = true
  )
$$;

-- 2. Update RLS policies to allow Staff to do their jobs

-- sales table
DROP POLICY IF EXISTS "Admins manage sales" ON public.sales;
CREATE POLICY "Admins manage sales" ON public.sales FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'Owner')) WITH CHECK (public.has_role(auth.uid(), 'Owner'));

CREATE POLICY "Staff insert and view sales" ON public.sales FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'Staff') OR public.has_role(auth.uid(), 'Owner'));

CREATE POLICY "Staff view sales" ON public.sales FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'Staff') OR public.has_role(auth.uid(), 'Owner'));

-- customers table
DROP POLICY IF EXISTS "Admins manage customers" ON public.customers;
CREATE POLICY "Admins manage customers" ON public.customers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'Owner')) WITH CHECK (public.has_role(auth.uid(), 'Owner'));

CREATE POLICY "Staff manage customers" ON public.customers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'Staff') OR public.has_role(auth.uid(), 'Owner'))
  WITH CHECK (public.has_role(auth.uid(), 'Staff') OR public.has_role(auth.uid(), 'Owner'));

-- accessories_sales
DROP POLICY IF EXISTS "Admins manage accessories_sales" ON public.accessories_sales;
CREATE POLICY "Admins manage accessories_sales" ON public.accessories_sales FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'Owner')) WITH CHECK (public.has_role(auth.uid(), 'Owner'));

CREATE POLICY "Staff manage accessories_sales" ON public.accessories_sales FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'Staff') OR public.has_role(auth.uid(), 'Owner'))
  WITH CHECK (public.has_role(auth.uid(), 'Staff') OR public.has_role(auth.uid(), 'Owner'));

-- balance_payments
DROP POLICY IF EXISTS "Admins manage balance_payments" ON public.balance_payments;
CREATE POLICY "Admins manage balance_payments" ON public.balance_payments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'Owner')) WITH CHECK (public.has_role(auth.uid(), 'Owner'));

CREATE POLICY "Staff manage balance_payments" ON public.balance_payments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'Staff') OR public.has_role(auth.uid(), 'Owner'))
  WITH CHECK (public.has_role(auth.uid(), 'Staff') OR public.has_role(auth.uid(), 'Owner'));

-- stock_log
DROP POLICY IF EXISTS "Admins manage stock_log" ON public.stock_log;
CREATE POLICY "Admins manage stock_log" ON public.stock_log FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'Owner')) WITH CHECK (public.has_role(auth.uid(), 'Owner'));

CREATE POLICY "Staff view stock_log" ON public.stock_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'Staff') OR public.has_role(auth.uid(), 'Owner'));

-- brands
DROP POLICY IF EXISTS "Admins manage brands" ON public.brands;
CREATE POLICY "Admins manage brands" ON public.brands FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'Owner')) WITH CHECK (public.has_role(auth.uid(), 'Owner'));

CREATE POLICY "Staff view brands" ON public.brands FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'Staff') OR public.has_role(auth.uid(), 'Owner'));

-- 3. Triggers for Relational Integrity

-- A. Customer Upsert Trigger on Sales
CREATE OR REPLACE FUNCTION public.handle_sale_customer_upsert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_customer_id uuid;
BEGIN
  -- Check if customer exists by phone
  SELECT id INTO v_customer_id FROM public.customers WHERE customer_phone = NEW.customer_phone;

  IF v_customer_id IS NULL THEN
    -- Insert new customer
    INSERT INTO public.customers (
      customer_name, customer_phone, customer_area, total_purchases, total_spent, outstanding_balance, last_purchase_date
    ) VALUES (
      NEW.customer_name, NEW.customer_phone, NEW.customer_area, 1, NEW.amount_paid, NEW.balance_owed, NEW.sale_date
    );
  ELSE
    -- Update existing customer
    UPDATE public.customers
    SET
      total_purchases = total_purchases + 1,
      total_spent = total_spent + NEW.amount_paid,
      outstanding_balance = outstanding_balance + NEW.balance_owed,
      last_purchase_date = NEW.sale_date,
      customer_name = NEW.customer_name, -- update name/area in case they changed
      customer_area = NEW.customer_area
    WHERE id = v_customer_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_sale_insert_customer_upsert ON public.sales;
CREATE TRIGGER on_sale_insert_customer_upsert
  AFTER INSERT ON public.sales
  FOR EACH ROW EXECUTE FUNCTION public.handle_sale_customer_upsert();

-- B. Customer Upsert Trigger on Accessories Sales
CREATE OR REPLACE FUNCTION public.handle_accessory_sale_customer_upsert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_customer_id uuid;
BEGIN
  SELECT id INTO v_customer_id FROM public.customers WHERE customer_phone = NEW.customer_phone;

  IF v_customer_id IS NULL THEN
    INSERT INTO public.customers (
      customer_name, customer_phone, total_purchases, total_spent, outstanding_balance, last_purchase_date
    ) VALUES (
      NEW.customer_name, NEW.customer_phone, 1, NEW.amount_paid, NEW.balance_owed, NEW.sale_date
    );
  ELSE
    UPDATE public.customers
    SET
      total_purchases = total_purchases + 1,
      total_spent = total_spent + NEW.amount_paid,
      outstanding_balance = outstanding_balance + NEW.balance_owed,
      last_purchase_date = NEW.sale_date,
      customer_name = NEW.customer_name
    WHERE id = v_customer_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_accessory_sale_insert_customer_upsert ON public.accessories_sales;
CREATE TRIGGER on_accessory_sale_insert_customer_upsert
  AFTER INSERT ON public.accessories_sales
  FOR EACH ROW EXECUTE FUNCTION public.handle_accessory_sale_customer_upsert();

-- C. Stock Deduction Trigger on Sales
CREATE OR REPLACE FUNCTION public.handle_sale_stock_deduction()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_stock integer;
BEGIN
  -- Only deduct stock for Refill or New Cylinder where brand_given is present
  IF NEW.transaction_type IN ('Refill', 'New Cylinder', 'Exchange') AND NEW.brand_given IS NOT NULL THEN
    
    SELECT current_stock INTO v_current_stock 
    FROM public.stock_log 
    WHERE brand = NEW.brand_given AND cylinder_size = NEW.cylinder_size
    ORDER BY created_at DESC LIMIT 1;
    
    IF v_current_stock IS NULL THEN
      v_current_stock := 0;
    END IF;

    INSERT INTO public.stock_log (
      log_date, brand, cylinder_size, quantity_out, current_stock, movement_type, notes, logged_by
    ) VALUES (
      NEW.sale_date, NEW.brand_given, NEW.cylinder_size, NEW.quantity, v_current_stock - NEW.quantity, 'Sale Auto-Deduction', 'Sale ID: ' || NEW.id, NEW.served_by
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_sale_insert_stock_deduction ON public.sales;
CREATE TRIGGER on_sale_insert_stock_deduction
  AFTER INSERT ON public.sales
  FOR EACH ROW EXECUTE FUNCTION public.handle_sale_stock_deduction();
