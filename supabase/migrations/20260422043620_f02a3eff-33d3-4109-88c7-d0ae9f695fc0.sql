
-- BRANDS TABLE
CREATE TABLE public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  brand_name text UNIQUE NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  is_brand_locked boolean NOT NULL DEFAULT false,
  brand_colour text NOT NULL DEFAULT '#E85D04',
  display_order integer NOT NULL DEFAULT 1,
  added_by text
);

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active brands"
  ON public.brands FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins manage brands"
  ON public.brands FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed brands
INSERT INTO public.brands (brand_name, brand_colour, is_brand_locked, display_order, is_active) VALUES
  ('K-Gas',     '#E24B4A', true,  1,  true),
  ('Total Gas', '#185FA5', true,  2,  true),
  ('Pro-Gas',   '#3B6D11', true,  3,  true),
  ('Afri-Gas',  '#BA7517', true,  4,  true),
  ('Wanjiko',   '#E85D04', false, 5,  true),
  ('Kerry Gas', '#E85D04', false, 6,  true),
  ('Sea Gas',   '#185FA5', false, 7,  true),
  ('Taifa Gas', '#0F1F3D', false, 8,  true),
  ('Gasky',     '#E85D04', false, 9,  true),
  ('Ker Gas',   '#3B6D11', false, 10, true),
  ('Jamii Gas', '#E85D04', false, 11, true),
  ('Hashi Gas', '#E85D04', false, 12, true),
  ('Moto Gas',  '#E24B4A', false, 13, true),
  ('Oilybia',   '#185FA5', false, 14, true),
  ('Mid Gas',   '#0F1F3D', false, 15, true),
  ('Lake Gas',  '#3B6D11', false, 16, true),
  ('Supa Gas',  '#E85D04', false, 17, true);

-- INQUIRIES TABLE
CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text,
  phone text,
  message text,
  inquiry_type text NOT NULL DEFAULT 'General'
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit inquiries"
  ON public.inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins view inquiries"
  ON public.inquiries FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage inquiries"
  ON public.inquiries FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
