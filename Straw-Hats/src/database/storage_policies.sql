-- Create the bucket (public so image URLs work without auth)
INSERT INTO storage.buckets (id, name, public)
VALUES ('animal-photos', 'animal-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view uploaded photos
CREATE POLICY "Public read animal photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'animal-photos');

-- Only service role (backend) can upload
CREATE POLICY "Service role upload animal photos"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'animal-photos' AND auth.role() = 'service_role');

-- Only service role can delete
CREATE POLICY "Service role delete animal photos"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'animal-photos' AND auth.role() = 'service_role');
