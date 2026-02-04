export const Spinner = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg
    className={`animate-spin ${className}`}
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="2"
      className="opacity-20"
      fill="none"
    />

    <path
      d="M12 3a9 9 0 0 1 9 9"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="opacity-90"
    />
  </svg>
);
