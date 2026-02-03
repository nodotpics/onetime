import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { photosApi } from '@/entities/photo/api/photosApi';
import type { PhotoStatusByReceiptResponse } from '@/entities/photo/api/types';
import { UploadResult } from '@/widgets/upload-result';

export const PreviewPage = () => {
  const { id } = useParams();
  const [previewInfo, setPreviewInfo] =
    useState<PhotoStatusByReceiptResponse | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    photosApi
      .getStatusByReceipt(id)
      .then((info) => {
        setPreviewInfo(info);
      })
      .catch(() => {});
  }, [id]);

  const onClickBurnSecret = async () => {
    if (!previewInfo?.id) return;
    try {
      await photosApi.burnPhoto(previewInfo.id);
      setPreviewInfo((prev) => (prev ? { ...prev, isExpired: true } : prev));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-full max-sm:p-4 max-sm:items-start">
      <UploadResult
        onBurn={onClickBurnSecret}
        link={`${window.location.origin}/view/${previewInfo?.id}`}
        status={
          previewInfo?.isExpired
            ? 'expired'
            : previewInfo?.isConsumed
              ? 'viewed'
              : 'not_viewed'
        }
      />
    </div>
  );
};
