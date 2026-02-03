import * as React from 'react';
import { Button } from '@/shared/ui/button';
import { ShieldIcon } from '@/shared/icons/shield_icon';
import { Input } from '@/shared/ui/input';

type SharedViewCardProps = {
  title?: string;
  subtitle?: string;
  onView: (passphrase: string) => void;
  buttonText?: string;
  isWithPassword: boolean;
};

export const SharedViewCard = ({
  title = 'Someone shared a file with you',
  subtitle = 'The file will be deleted after viewing',
  onView,
  buttonText = 'View file',
  isWithPassword,
}: SharedViewCardProps) => {
  const [passphrase, setPassphrase] = React.useState<string>('');
  return (
    <div className="w-full max-w-2xl rounded-[36px] bg-[#FAFAFA] p-9 max-sm:p-4">
      <div className="relative overflow-hidden rounded-[28px] border-2 border-dashed border-[#D8DAEB] bg-white px-10 py-12">
        <div className="flex flex-col items-center justify-center text-center">
          <ShieldIcon />
          <h2 className="mt-4 text-lg font-medium text-[#0C1421]">{title}</h2>
          <p className="mt-2 text-sm text-[#7D7D7D]">{subtitle}</p>
        </div>
      </div>
      {isWithPassword && (
        <div className={'mt-9'}>
          <Input
            id="passphrase"
            name="passphrase"
            type="text"
            label="Enter passphrase to unlock"
            placeholder="Enter passphrase"
            autoComplete="new-password"
            value={passphrase}
            className={'w-full'}
            onChange={(e) => setPassphrase(e.target.value)}
          />
        </div>
      )}

      <div className="mt-10">
        <Button
          type="button"
          onClick={() => onView(passphrase)}
          fullWidth
          variant="success"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
