import * as React from 'react';
import { Button } from '@/shared/ui/button';
import { EncryptKeyIcon } from '@/shared/icons/encrypt_key_icon';
import { CopyIcon } from '@/shared/icons/copy_icon';
import { CheckIcon } from '@/shared/icons/check_icon';
import { STATUS_UI } from '@/widgets/upload-result/ui/upload-result.status-ui';
import { clsx } from 'clsx';

type Status = 'not_viewed' | 'viewed' | 'expired';

type EncryptedResultCardProps = {
  link: string;
  status?: Status;
  deleteAfterText?: string;
  onBurn: () => void;
  loading: boolean;
};

export const UploadResult = ({
  link,
  status = 'not_viewed',
  deleteAfterText = 'Will be deleted after 1 view',
  onBurn,
  loading,
}: EncryptedResultCardProps) => {
  const [copied, setCopied] = React.useState(false);

  const {
    label: statusLabel,
    className: statusClass,
    title: fileTitle,
  } = STATUS_UI[status];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="w-full max-w-2xl rounded-[28px] bg-white p-8 max-sm:p-4">
      <div
        className={`relative overflow-hidden rounded-3xl border-2 border-dashed p-8 ${status === 'expired' ? 'bg-[#FFE7E7] border-[#FF1C1C]' : 'bg-[#DEFFED] border-[#06BF5C]'}`}
      >
        <div className="relative flex flex-col items-center justify-center gap-3">
          <div
            className={`grid h-12 w-12 place-items-center rounded-full  ${status === 'expired' ? 'bg-[#FF1C1C]' : 'bg-[#06BF5C]'}`}
          >
            <CheckIcon className="h-6 w-6 text-white" />
          </div>

          <h2 className="text-center text-lg font-medium text-[#111]">
            {fileTitle}
          </h2>
        </div>
      </div>

      {status === 'not_viewed' && (
        <div className={'mt-9'}>
          <div className={'flex items-center justify-between'}>
            <h4 className="text-lg font-medium text-[#0C1421] max-sm:text-base">
              Encrypted Link
            </h4>
            <span className={`text-lg text-[#7D7D7D] max-sm:text-sm`}>
              {deleteAfterText}
            </span>
          </div>
          <div
            className={clsx(
              'mt-0.75 flex items-center gap-3 rounded-2xl transition-colors border bg-white px-4 py-3',
              copied ? 'border-[#06BF5C]' : 'border-[#D7DAE3]'
            )}
          >
            <div className="shrink-0 pt-1">
              <EncryptKeyIcon />
            </div>

            <span
              onClick={handleCopy}
              className="min-w-0 flex-1 break-all underline underline-offset-2 max-sm:text-sm cursor-pointer"
            >
              {link}
            </span>

            <Button
              type="button"
              onClick={handleCopy}
              className="h-11 w-11 p-3! rounded-xl border border-[#D7DAE3] bg-white transition hover:bg-[#F6F7FA]"
              aria-label="Copy link"
              title={copied ? 'Copied!' : 'Copy'}
              size="sm"
              variant="outline"
            >
              {copied ? (
                <CheckIcon className="h-5 w-5  text-emerald-600" />
              ) : (
                <CopyIcon />
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-8 max-sm:mt-6 flex items-center justify-between">
        <h4 className="text-lg font-medium text-[#0C1421] max-sm:text-base">
          Current status
        </h4>
        <span className={`text-lg max-sm:text-sm ${statusClass}`}>
          {statusLabel}
        </span>
      </div>

      {status === 'not_viewed' && (
        <Button
          className={'mt-9 max-sm:mt-3 font-semibold'}
          onClick={onBurn}
          loading={loading}
          variant="danger"
          fullWidth={true}
        >
          Burn this secret
        </Button>
      )}
    </div>
  );
};
