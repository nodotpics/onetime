import { Button } from '@/shared/ui/button';
import { formatBytes } from '@/shared/lib/formatBytes';

type FileCardProps = {
  title?: string;
  fileName: string;
  sizeBytes: number;
  onRemove?: () => void;
  action?: React.ReactNode;
};

export const FileCard = ({
  title = 'Uploaded File:',
  fileName,
  sizeBytes,
  onRemove,
  action,
}: FileCardProps) => {
  return (
    <div className="text-left">
      <h1 className={'text-lg font-medium'}>{title}</h1>
      <div className="w-full rounded-2xl bg-white py-2.5 px-4 text-left mt-0.75">
        <div className="flex items-center justify-between w-full gap-3">
          <div className="min-w-0">
            <p className="text-[#111] font-medium truncate">{fileName}</p>
            <p className="text-[#6b6b6b] text-sm">{formatBytes(sizeBytes)}</p>
          </div>

          {action ??
            (onRemove && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="shrink-0"
                onClick={onRemove}
              >
                Remove
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
};
