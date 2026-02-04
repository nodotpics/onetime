import React, { useCallback, useRef, useState } from 'react';
import { FileIcon } from '@/shared/icons/file_icon';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Dropdown, DropdownOption } from '@/shared/ui/dropdown';
import { formatFileLabel } from '@/shared/lib/formatFileLabel';
import { FileCard } from '@/shared/ui/file-card';
import { formatBytes } from '@/shared/lib/formatBytes';
import { useLoadingButton } from '@/features/hooks/useLoadingButton';

const TTL_OPTIONS: DropdownOption<number>[] = [
  { label: '5 minutes', value: 300 },
  { label: '15 minutes', value: 900 },
  { label: '30 minutes', value: 1800 },
  { label: '1 hour', value: 3600 },
  { label: '3 hours', value: 10800 },
  { label: '6 hours', value: 21600 },
  { label: '12 hours', value: 43200 },
  { label: '24 hours', value: 86400 },
];

type DropZoneProps = {
  onFileSelected?: (file: File) => void;
  accept?: string;
  maxSizeBytes?: number;
};

const DropZone: React.FC<DropZoneProps> = ({
  onFileSelected,
  accept,
  maxSizeBytes,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOver, setIsOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndSet = useCallback(
    (next: File | null) => {
      setError(null);

      if (!next) return;

      if (maxSizeBytes && next.size > maxSizeBytes) {
        setError(
          `File is too large. Max size is ${formatBytes(maxSizeBytes)}.`
        );
        return;
      }

      onFileSelected?.(next);
    },
    [maxSizeBytes, onFileSelected]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsOver(false);

      const dropped = e.dataTransfer.files?.[0] ?? null;
      validateAndSet(dropped);
    },
    [validateAndSet]
  );

  const onBrowse = () => inputRef.current?.click();

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => validateAndSet(e.target.files?.[0] ?? null)}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={onBrowse}
        onKeyDown={(e) =>
          e.key === 'Enter' || e.key === ' ' ? onBrowse() : null
        }
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOver(false);
        }}
        onDrop={onDrop}
        className={[
          'rounded-[28px] p-10 cursor-pointer select-none transition flex flex-col items-center',
          'bg-white border-[#D8DAEB] border-2 border-dashed',
          isOver && 'border-[#0088FF] bg-[#EAF4FF]',
        ].join(' ')}
      >
        <FileIcon />
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-[#353535] text-lg font-medium">
            Drag and drop your files
          </h2>
          <p className="text-[#6b6b6b]">JPEG, PNG formats, up to 5MB</p>
          <Button size="md" className="mt-2 w-36">
            Select file
          </Button>

          {error && (
            <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const UploadMenu: React.FC<{
  onFileSelected?: (file: File) => void;
  onUpload?: (file: File, passphrase: string, ttl: number) => void;
}> = ({ onFileSelected, onUpload }) => {
  const { loading, wrap } = useLoadingButton();
  const [passphrase, setPassphrase] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [ttl, setTtl] = React.useState<number>(3600);

  const handleFileSelected = (file: File | null) => {
    if (file === null) {
      return setSelectedFile(null);
    }
    setSelectedFile(file);
    onFileSelected?.(file);
  };

  const handleUpload = wrap(async () => {
    if (!selectedFile) return;
    await onUpload?.(selectedFile, passphrase, ttl);
  });

  const generatePassphrase = () => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassphrase(result);
  };

  return (
    <div className="flex flex-col gap-9 p-9 max-sm:p-4 bg-white text-center rounded-[28px] w-full max-w-2xl">
      <div>
        <DropZone
          onFileSelected={handleFileSelected}
          accept="image/*,.pdf"
          maxSizeBytes={100 * 1024 * 1024}
        />
      </div>

      <div
        className={'flex items-center max-sm:flex-col justify-between gap-5'}
      >
        <Input
          id="passphrase"
          name="passphrase"
          type="text"
          label="Passphrase"
          placeholder="Enter passphrase"
          autoComplete="new-password"
          value={passphrase}
          className={'w-full'}
          onChange={(e) => setPassphrase(e.target.value)}
          rightButton={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generatePassphrase}
            >
              Generate
            </Button>
          }
        />
        <Dropdown
          className={'w-full'}
          label="Expiration Time"
          options={TTL_OPTIONS}
          value={ttl}
          onChange={setTtl}
          placeholder="Select expiration time"
        />
      </div>
      {selectedFile && (
        <FileCard
          fileName={formatFileLabel(selectedFile)}
          sizeBytes={selectedFile.size}
          onRemove={() => handleFileSelected(null)}
        />
      )}
      <Button
        onClick={() => {
          handleUpload();
        }}
        disabled={!selectedFile}
        loading={loading}
        fullWidth
      >
        Create Link
      </Button>
    </div>
  );
};
