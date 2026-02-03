import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { photosApi } from '@/entities/photo/api/photosApi';
import { SharedViewCard } from '@/widgets/shared-view-card';
import type { PhotoStatusByIdResponse } from '@/entities/photo/api/types';

export const ViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [viewed, setViewed] = useState(false);
  const [viewInfo, setViewInfo] = useState<PhotoStatusByIdResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [photoUrlWithToken, setPhotoUrlWithToken] = useState<string | null>(
    null
  );
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('Invalid photo ID');
      setLoading(false);
      return;
    }

    photosApi
      .getStatusById(id)
      .then((info) => {
        setViewInfo(info);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to check photo status');
        setLoading(false);
      });
  }, [id]);

  const handleView = async (passphrase: string) => {
    if (!id) {
      navigate('/');
      return;
    }

    setError(null);

    if (!viewInfo?.isWithPassword) {
      setViewed(true);
      return;
    }

    try {
      setUnlocking(true);
      const info = await photosApi.unlockPhoto(id, passphrase);

      setPhotoUrlWithToken(info.photoUrl);
      setViewed(true);
    } catch (e: unknown) {
      console.error(e);
      setViewed(false);
    } finally {
      setUnlocking(false);
    }
  };

  const photoSrc = viewInfo?.isWithPassword
    ? photosApi.getPhotoUrl(photoUrlWithToken || '')
    : id
      ? photosApi.getPhotoUrl(id)
      : null;

  if (loading) {
    return (
      <div className="text-white h-full flex items-center justify-center max-sm:p-4 max-sm:items-start">
        <div className="max-w-md text-center bg-white text-black p-9 rounded-[28px]">
          <h1 className="text-2xl font-bold mb-2">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error || !viewInfo?.exists) {
    return (
      <div className="text-white h-full flex items-center justify-center max-sm:p-4 max-sm:items-start">
        <div className="max-w-md text-center bg-white text-black p-9 rounded-[28px]">
          <h1 className="text-2xl font-bold mb-2">Photo Not Found</h1>
          <p className="text-slate-400 mb-6">
            This photo doesn't exist or has already been viewed.
          </p>
          <Button onClick={() => navigate('/')}>Upload a Photo</Button>
        </div>
      </div>
    );
  }

  if (!viewed) {
    return (
      <div className="flex items-center justify-center h-full max-sm:p-4 max-sm:items-start">
        <SharedViewCard
          onView={handleView}
          isWithPassword={viewInfo.isWithPassword}
        />
        {unlocking && <div className="text-slate-400 mt-4">Unlocking...</div>}
      </div>
    );
  }

  if (!photoSrc) {
    return (
      <div className="text-white flex items-center justify-center">
        <p className="text-slate-400">Preparing photo...</p>
      </div>
    );
  }

  return (
    <div className="text-white h-full flex items-center justify-center max-sm:p-4 max-sm:items-start">
      <div className="max-w-xl w-full">
        <div className="p-9 bg-white rounded-[28px]">
          <div className="rounded-lg p-4 flex items-center justify-center">
            <img
              src={photoSrc}
              alt="One-time photo"
              className="max-w-full h-auto rounded-lg max-h-[70vh]"
              onError={() => setError('Photo already viewed or expired')}
            />
          </div>

          <div className="mt-6 text-center">
            <Button onClick={() => navigate('/')}>Upload Another Photo</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
