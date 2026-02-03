type Status = 'not_viewed' | 'viewed' | 'expired';

export const STATUS_UI: Record<
  Status,
  { label: string; className: string; title: string }
> = {
  not_viewed: {
    label: 'Not viewed yet',
    className: 'text-[#FF8C00]',
    title: 'File successfully encrypted!',
  },
  viewed: {
    label: 'Viewed',
    className: 'text-emerald-600',
    title: 'File has been viewed',
  },
  expired: {
    label: 'Expired',
    className: 'text-rose-500',
    title: 'File is expired',
  },
};
