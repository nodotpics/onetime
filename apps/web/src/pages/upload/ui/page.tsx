import { useState } from 'react';
import { UploadMenu } from '@/widgets/upload-menu';
import { Navigate } from 'react-router-dom';
import { UploadPhotoResponse } from '@/entities/photo/api/types';
import { photosApi } from '@/entities/photo/api/photosApi';

export const UploadPage = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadPhotoResponse | null>(null);

  const handleUpload = async (file: File, passphrase: string, ttl: number) => {
    setUploading(true);
    setError(null);

    try {
      const response = await photosApi.uploadPhoto(file, ttl, passphrase);
      setResult(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  if (result) {
    return <Navigate to={`/preview/${result.receiptId}`} />;
  }

  return (
    <div className="min-h-full flex items-center max-sm:items-start justify-center max-sm:p-4">
      <div className="w-full max-w-2xl">
        <UploadMenu onUpload={handleUpload} />
        {uploading && (
          <div className="mt-4 text-center text-gray-600">Uploading...</div>
        )}
        {error && <div className="mt-4 text-center text-red-600">{error}</div>}
      </div>
    </div>
  );
};
