-- Create public storage bucket for website media
INSERT INTO storage.buckets (id, name, public)
VALUES ('website-media', 'website-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public can view website-media"
ON storage.objects FOR SELECT
USING (bucket_id = 'website-media');

CREATE POLICY "Admins can upload website-media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'website-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update website-media"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'website-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete website-media"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'website-media' AND public.has_role(auth.uid(), 'admin'));

-- Trigger: when a new auth user is created, create a matching admin_users row
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_users (id, email, full_name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'Staff',
    true
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_user();