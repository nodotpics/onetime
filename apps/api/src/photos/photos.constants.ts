export const PhotoTTL = {
  MIN: 60,
  MAX: 86400,
  DEFAULT: 3600,
  PRESETS: {
    FIVE_MINUTES: 300,
    FIFTEEN_MINUTES: 900,
    THIRTY_MINUTES: 1800,
    ONE_HOUR: 3600,
    THREE_HOURS: 10800,
    SIX_HOURS: 21600,
    TWELVE_HOURS: 43200,
    TWENTY_FOUR_HOURS: 86400,
  },
} as const;

export const PhotoUploadLimits = {
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ] as const,
};
