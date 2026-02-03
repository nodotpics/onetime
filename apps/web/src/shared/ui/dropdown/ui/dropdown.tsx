import { useState, useRef, useEffect } from 'react';

export type DropdownOption<T = string> = {
  label: string;
  value: T;
};

type DropdownProps<T = string> = {
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  placeholder?: string;
  className?: string;
};

export const Dropdown = <T = string,>({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  className = '',
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`space-y-2 text-left ${className}`}>
      {label && (
        <label className="text-lg max-sm:text-base font-medium text-[#0C1421] mb-1.5">
          {label}
        </label>
      )}

      <div ref={dropdownRef} className="relative mt-0.75">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full rounded-2xl border bg-white px-4 py-2.5 text-left text-[#0C1421] border-[#E5E7EB] focus:border-[#0088FF] focus:ring-4 focus:ring-[#0088FF]/20 outline-none transition flex items-center justify-between"
        >
          <span className={selectedOption ? '' : 'text-[#9CA3AF]'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-[#E5E7EB] text-black rounded-2xl shadow-lg max-h-48 overflow-auto">
            {options.map((option) => (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-gray-100 transition ${
                  option.value === value ? 'bg-gray-50 font-medium' : ''
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
