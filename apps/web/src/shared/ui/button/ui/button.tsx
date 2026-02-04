import { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { Spinner } from '@/shared/icons/spinner_icon';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'danger'
  | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-black text-white enabled:hover:bg-gray-800',
  secondary: 'bg-gray-200 text-gray-900 enabled:hover:bg-gray-300',
  outline:
    'bg-white text-[#0C1421] border border-[#D5D3E0] enabled:hover:bg-gray-50',
  danger:
    'bg-[#FFE7E7] text-[#FF1C1C] enabled:hover:bg-rose-200/70 active:scale-[0.99]',
  success: 'bg-[#06BF5C] text-white',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-7 px-4 text-sm',
  md: 'h-12 px-4 text-sm',
  lg: 'h-14 px-6 text-base',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  disabled,
  loading,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        'rounded-full cursor-pointer font-medium transition disabled:opacity-50 disabled:cursor-not-allowed',
        'inline-flex items-center justify-center gap-2',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {loading && <Spinner className="h-4 w-4" />}
      <span className={clsx(loading && 'opacity-80')}>{children}</span>
    </button>
  );
};
