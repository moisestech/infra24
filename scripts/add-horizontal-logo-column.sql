-- Add horizontal_logo_url column to organizations table
-- This allows organizations to have both square and horizontal logo variants

-- Add the new column
ALTER TABLE public.organizations 
ADD COLUMN horizontal_logo_url text;

-- Add a comment to document the column
COMMENT ON COLUMN public.organizations.horizontal_logo_url IS 'URL for horizontal/wide version of organization logo';

-- Update Bakehouse with the horizontal logo URL (white version)
UPDATE public.organizations 
SET horizontal_logo_url = 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757706285/bakehouse-logo-horizontal-transparent-white_r3u1yy.png'
WHERE slug = 'bakehouse';

-- Verify the update
SELECT 
  name,
  slug,
  logo_url,
  horizontal_logo_url
FROM public.organizations 
WHERE slug = 'bakehouse';
