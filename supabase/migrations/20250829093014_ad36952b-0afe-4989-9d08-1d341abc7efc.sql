-- Add increment function for download count
CREATE OR REPLACE FUNCTION public.increment_download_count(resource_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.downloadable_resources 
  SET download_count = download_count + 1 
  WHERE id = resource_id;
END;
$$;