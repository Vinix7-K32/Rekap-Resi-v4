-- Create the private avatar bucket and constrain Storage API access by user folder.
-- Object names must start with the authenticated user's UUID, for example:
-- <auth.uid()>/avatar.png. Only avatar.jpg, avatar.png, and avatar.webp are allowed.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  false,
  2097152,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Users can read their own avatars" ON storage.objects;
CREATE POLICY "Users can read their own avatars"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = (select auth.uid()::text)
    AND array_length(storage.foldername(name), 1) = 1
    AND storage.filename(name) IN ('avatar.jpg', 'avatar.png', 'avatar.webp')
  );

DROP POLICY IF EXISTS "Users can insert their own avatars" ON storage.objects;
CREATE POLICY "Users can insert their own avatars"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = (select auth.uid()::text)
    AND array_length(storage.foldername(name), 1) = 1
    AND storage.filename(name) IN ('avatar.jpg', 'avatar.png', 'avatar.webp')
  );

DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
CREATE POLICY "Users can update their own avatars"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = (select auth.uid()::text)
    AND array_length(storage.foldername(name), 1) = 1
    AND storage.filename(name) IN ('avatar.jpg', 'avatar.png', 'avatar.webp')
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = (select auth.uid()::text)
    AND array_length(storage.foldername(name), 1) = 1
    AND storage.filename(name) IN ('avatar.jpg', 'avatar.png', 'avatar.webp')
  );

DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
CREATE POLICY "Users can delete their own avatars"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = (select auth.uid()::text)
    AND array_length(storage.foldername(name), 1) = 1
    AND storage.filename(name) IN ('avatar.jpg', 'avatar.png', 'avatar.webp')
  );
