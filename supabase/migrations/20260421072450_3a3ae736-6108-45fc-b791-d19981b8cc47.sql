-- Helper function for updated_at (not strictly needed but kept minimal)

-- TABLE 1: sales
CREATE TABLE public.sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  sale_date date,
  sale_time time,
  customer_name text,
  customer_phone text,
  customer_area text,
  transaction_type text DEFAULT 'Refill',
  cylinder_size text DEFAULT '6kg',
  brand_given text,
  brand_received text,
  quantity integer DEFAULT 1,
  unit_price numeric DEFAULT 0,
  total_amount numeric DEFAULT 0,
  amount_paid numeric DEFAULT 0,
  balance_owed numeric DEFAULT 0,
  payment_status text DEFAULT 'Pending',
  payment_method text DEFAULT 'Cash',
  mpesa_ref text,
  receipt_sent boolean DEFAULT false,
  served_by text,
  notes text
);
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- TABLE 2: customers
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  customer_name text,
  customer_phone text UNIQUE,
  customer_area text,
  total_purchases integer DEFAULT 0,
  total_spent numeric DEFAULT 0,
  outstanding_balance numeric DEFAULT 0,
  is_frequent boolean DEFAULT false,
  loyalty_offer_sent boolean DEFAULT false,
  last_purchase_date date,
  preferred_brand text,
  notes text
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- TABLE 3: accessories_sales
CREATE TABLE public.accessories_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  sale_date date,
  customer_name text,
  customer_phone text,
  item_name text,
  quantity integer DEFAULT 1,
  unit_price numeric DEFAULT 0,
  total_amount numeric DEFAULT 0,
  amount_paid numeric DEFAULT 0,
  balance_owed numeric DEFAULT 0,
  payment_method text DEFAULT 'Cash',
  mpesa_ref text,
  payment_status text DEFAULT 'Pending',
  notes text
);
ALTER TABLE public.accessories_sales ENABLE ROW LEVEL SECURITY;

-- TABLE 4: balance_payments
CREATE TABLE public.balance_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  sale_id uuid,
  customer_phone text,
  amount_paid numeric DEFAULT 0,
  payment_method text DEFAULT 'Cash',
  mpesa_ref text,
  remaining_balance numeric DEFAULT 0,
  received_by text,
  notes text
);
ALTER TABLE public.balance_payments ENABLE ROW LEVEL SECURITY;

-- TABLE 5: website_media
CREATE TABLE public.website_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  section text,
  file_url text,
  file_name text,
  alt_text text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 1,
  uploaded_by text
);
ALTER TABLE public.website_media ENABLE ROW LEVEL SECURITY;

-- TABLE 6: stock_log
CREATE TABLE public.stock_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  log_date date,
  brand text,
  cylinder_size text DEFAULT '6kg',
  quantity_in integer DEFAULT 0,
  quantity_out integer DEFAULT 0,
  current_stock integer DEFAULT 0,
  movement_type text DEFAULT 'Sale',
  notes text,
  logged_by text
);
ALTER TABLE public.stock_log ENABLE ROW LEVEL SECURITY;

-- App role enum + user_roles table for secure role checks
CREATE TYPE public.app_role AS ENUM ('admin', 'staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- TABLE 7: admin_users (id links to auth.users)
CREATE TABLE public.admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  full_name text,
  email text UNIQUE,
  role text DEFAULT 'Staff',
  is_active boolean DEFAULT true,
  last_login timestamp with time zone
);
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES: only admins can access these business tables
-- sales
CREATE POLICY "Admins manage sales" ON public.sales FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- customers
CREATE POLICY "Admins manage customers" ON public.customers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- accessories_sales
CREATE POLICY "Admins manage accessories_sales" ON public.accessories_sales FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- balance_payments
CREATE POLICY "Admins manage balance_payments" ON public.balance_payments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- website_media: public can read active media, admins manage
CREATE POLICY "Public can view active media" ON public.website_media FOR SELECT
  USING (is_active = true);
CREATE POLICY "Admins manage website_media" ON public.website_media FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- stock_log
CREATE POLICY "Admins manage stock_log" ON public.stock_log FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- admin_users
CREATE POLICY "Users can view own admin record" ON public.admin_users FOR SELECT TO authenticated
  USING (auth.uid() = id);
CREATE POLICY "Admins view all admin_users" ON public.admin_users FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage admin_users" ON public.admin_users FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- user_roles policies
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert 15 sample sales rows (dummy data for testing)
INSERT INTO public.sales
  (sale_date, sale_time, customer_name, customer_phone, customer_area, transaction_type, cylinder_size, brand_given, brand_received, quantity, unit_price, total_amount, amount_paid, balance_owed, payment_status, payment_method, mpesa_ref, receipt_sent, served_by, notes)
VALUES
  (CURRENT_DATE - 1,  '09:15', 'James Mwangi',     '0712345671', 'Karatina Town',  'Refill',       '6kg',  'K-Gas',     'K-Gas',     1, 1100, 1100, 1100,    0, 'Paid',    'M-Pesa', 'QFT12AB001', true,  'Wamuthondio', 'Quick refill'),
  (CURRENT_DATE - 2,  '10:40', 'Grace Wanjiru',    '0712345672', 'Ihwagi',         'Exchange',     '6kg',  'Total Gas', 'K-Gas',     1, 1150, 1150, 1000,  150, 'Partial', 'Cash',   NULL,         false, 'Wamuthondio', 'Owes balance'),
  (CURRENT_DATE - 3,  '14:05', 'Peter Kamau',      '0712345673', 'Kagochi',        'Refill',       '13kg', 'Supa Gas',  'Supa Gas',  1, 2400, 2400, 2400,    0, 'Paid',    'M-Pesa', 'QFT12AB002', true,  'Wamuthondio', NULL),
  (CURRENT_DATE - 4,  '11:20', 'Mary Njeri',       '0712345674', 'Kiamariga',      'New Cylinder', '6kg',  NULL,        'Sea Gas',   1, 3500, 3500, 3500,    0, 'Paid',    'Cash',   NULL,         true,  'Wamuthondio', 'Brand new set'),
  (CURRENT_DATE - 5,  '08:50', 'John Maina',       '0712345675', 'Karatina Town',  'Refill',       '6kg',  'Wanjiko',   'Wanjiko',   1, 1050, 1050,  500,  550, 'Partial', 'M-Pesa', 'QFT12AB003', false, 'Wamuthondio', 'Will pay balance Friday'),
  (CURRENT_DATE - 7,  '15:30', 'Lucy Wambui',      '0712345676', 'Ngangarithi',    'Refill',       '13kg', 'Kerry Gas', 'Kerry Gas', 1, 2350, 2350, 2350,    0, 'Paid',    'Cash',   NULL,         true,  'Wamuthondio', NULL),
  (CURRENT_DATE - 9,  '12:10', 'Samuel Karanja',   '0712345677', 'Kibirigwi',      'Exchange',     '6kg',  'Pro-Gas',   'Total Gas', 1, 1150, 1150, 1150,    0, 'Paid',    'M-Pesa', 'QFT12AB004', true,  'Wamuthondio', NULL),
  (CURRENT_DATE - 11, '17:45', 'Anne Wairimu',     '0712345678', 'Karatina Town',  'Refill',       '6kg',  'K-Gas',     'K-Gas',     2, 1100, 2200, 1500,  700, 'Partial', 'Cash',   NULL,         false, 'Wamuthondio', 'Two cylinders'),
  (CURRENT_DATE - 13, '09:55', 'David Githinji',   '0712345679', 'Kagumo',         'Refill',       '13kg', 'Total Gas', 'Total Gas', 1, 2450, 2450, 2450,    0, 'Paid',    'M-Pesa', 'QFT12AB005', true,  'Wamuthondio', NULL),
  (CURRENT_DATE - 15, '13:25', 'Esther Muthoni',   '0712345680', 'Mathira',        'New Cylinder', '13kg', NULL,        'K-Gas',     1, 6500, 6500, 6500,    0, 'Paid',    'M-Pesa', 'QFT12AB006', true,  'Wamuthondio', 'New big cylinder'),
  (CURRENT_DATE - 18, '10:15', 'Joseph Mbugua',    '0712345681', 'Karatina Town',  'Refill',       '6kg',  'Sea Gas',   'Sea Gas',   1, 1080, 1080,  600,  480, 'Partial', 'Cash',   NULL,         false, 'Wamuthondio', 'Balance pending'),
  (CURRENT_DATE - 21, '16:00', 'Catherine Nyokabi','0712345682', 'Ihwagi',         'Refill',       '6kg',  'Wanjiko',   'Wanjiko',   1, 1050, 1050, 1050,    0, 'Paid',    'M-Pesa', 'QFT12AB007', true,  'Wamuthondio', NULL),
  (CURRENT_DATE - 24, '11:35', 'Patrick Ndegwa',   '0712345683', 'Kagochi',        'Exchange',     '13kg', 'Pro-Gas',   'Supa Gas',  1, 2400, 2400, 2400,    0, 'Paid',    'Cash',   NULL,         true,  'Wamuthondio', NULL),
  (CURRENT_DATE - 27, '14:50', 'Susan Wangari',    '0712345684', 'Kiamariga',      'Refill',       '6kg',  'Kerry Gas', 'Kerry Gas', 1, 1100, 1100, 1100,    0, 'Paid',    'M-Pesa', 'QFT12AB008', true,  'Wamuthondio', NULL),
  (CURRENT_DATE - 29, '08:30', 'Michael Kariuki',  '0712345685', 'Karatina Town',  'Refill',       '13kg', 'K-Gas',     'K-Gas',     1, 2400, 2400,    0, 2400, 'Pending', 'Cash',   NULL,         false, 'Wamuthondio', 'Regular customer, will pay');