ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS video_url TEXT;
-- Convert image_urls from TEXT[] to JSONB
ALTER TABLE public.videos ALTER COLUMN image_urls TYPE JSONB USING to_jsonb(image_urls);
