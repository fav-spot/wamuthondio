-- Update brand colors to exact verified colors
UPDATE public.brands SET brand_colour = '#125B29' WHERE brand_name = 'K-Gas';
UPDATE public.brands SET brand_colour = '#FFC000' WHERE brand_name = 'Total Gas';
UPDATE public.brands SET brand_colour = '#E91E63' WHERE brand_name = 'Pro-Gas';
UPDATE public.brands SET brand_colour = '#FFD700' WHERE brand_name = 'Afri-Gas';
UPDATE public.brands SET brand_colour = '#03A9F4' WHERE brand_name = 'Sea Gas';
UPDATE public.brands SET brand_colour = '#FFD700' WHERE brand_name = 'Taifa Gas';
UPDATE public.brands SET brand_colour = '#FFD700' WHERE brand_name = 'Hashi Gas';
UPDATE public.brands SET brand_colour = '#03A9F4' WHERE brand_name = 'Oilybia';

-- Optional: update fallback colours for remaining brands if they were hardcoded wrong previously
-- Let's leave Moto Gas (#E24B4A Red) and others as is unless we explicitly know they are wrong.
