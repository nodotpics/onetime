import { ButtonHTMLAttributes } from 'react';

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
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-black text-white hover:bg-gray-800',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  outline: 'bg-white text-[#0C1421] border border-[#D5D3E0] hover:bg-gray-50',
  danger:
    'bg-[#FFE7E7] text-[#FF1C1C] hover:bg-rose-200/70 active:scale-[0.99]',
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
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`rounded-full font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};
