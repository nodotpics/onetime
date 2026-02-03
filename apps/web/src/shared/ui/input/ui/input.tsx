import { InputHTMLAttributes, ReactNode } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  rightButton?: ReactNode;
};

export const Input = ({
  label,
  error,
  rightButton,
  className = '',
  ...props
}: InputProps) => {
  return (
    <div className={`text-left space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={props.id}
          className="text-lg max-sm:text-base font-medium text-[#0C1421]"
        >
          {label}
        </label>
      )}

      <div className="relative mt-0.75">
        <input
          {...props}
          className={`w-full rounded-2xl border bg-white px-4 py-2.5 text-[#0C1421] placeholder:text-[#9CA3AF] border-[#E5E7EB] focus:border-[#0088FF] focus:ring-4 focus:ring-[#0088FF]/20 outline-none transition ${error ? 'border-red-500' : ''} ${className}`}
        />
        {rightButton && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightButton}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
