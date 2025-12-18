-- Create storage bucket for PDF documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('pdf-documents', 'pdf-documents', false);

-- Create RLS policies for PDF documents bucket
CREATE POLICY "Users can upload their own PDFs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pdf-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own PDFs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'pdf-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own PDFs"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'pdf-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);