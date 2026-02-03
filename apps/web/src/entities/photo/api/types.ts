export interface UploadPhotoResponse {
  success: boolean;
  receiptId: string;
  expiresAt: string;
}

export interface PhotoStatusByReceiptResponse {
  success: boolean;
  receiptId: string;
  exists: boolean;
  isExpired: boolean;
  isConsumed: boolean;
  id: string | null;
  createdAt: string | null;
  expiresAt: string | null;
  ttlSeconds: number;
}

export interface PhotoStatusByIdResponse {
  success: boolean;
  id: string;
  exists: boolean;
  isExpired: boolean;
  isConsumed: boolean;
  createdAt: string | null;
  expiresAt: string | null;
  ttlSeconds: number;
  isWithPassword: boolean;
}

export interface PhotoWithPasswordResponse {
  photoUrl: string;
  success: boolean;
  token: string;
  tokenExpiresIn: number;
}
