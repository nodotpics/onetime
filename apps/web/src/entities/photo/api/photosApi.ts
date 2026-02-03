import type {
  UploadPhotoResponse,
  PhotoStatusByReceiptResponse,
  PhotoStatusByIdResponse,
  PhotoWithPasswordResponse,
} from './types';
import { apiClient } from '@/shared/api/client';

export const photosApi = {
  uploadPhoto: async (
    file: File,
    ttl?: number,
    passphrase?: string
  ): Promise<UploadPhotoResponse> => {
    const formData = new FormData();
    formData.append('photo', file);

    if (ttl != null) formData.append('ttl', String(ttl));
    if (passphrase?.trim()) formData.append('passphrase', passphrase.trim());

    const response = await apiClient.post<UploadPhotoResponse>(
      `/photos/upload`,
      formData
    );

    return response.data;
  },

  burnPhoto: async (id: string) => {
    const response = await apiClient.delete(`/photos/${id}`);
    return response.data;
  },

  getPhotoUrl: (id: string): string => {
    return `${apiClient.defaults.baseURL}/photos/${id}`;
  },

  getStatusByReceipt: async (
    receiptId: string
  ): Promise<PhotoStatusByReceiptResponse> => {
    const response = await apiClient.get<PhotoStatusByReceiptResponse>(
      `/photos/receipt/${receiptId}/status`
    );
    return response.data;
  },

  getStatusById: async (id: string): Promise<PhotoStatusByIdResponse> => {
    const response = await apiClient.get<PhotoStatusByIdResponse>(
      `/photos/${id}/status`
    );
    return response.data;
  },
  unlockPhoto: async (
    photoId: string,
    passphrase: string
  ): Promise<PhotoWithPasswordResponse> => {
    const response = await apiClient.post(`/photos/${photoId}/unlock`, {
      passphrase: passphrase,
    });
    return response.data;
  },
};
