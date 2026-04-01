interface TagProps {
  label: string;
  className?: string;
}

export function Tag({ label, className = '' }: TagProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium
        bg-tag-bg text-accent border border-tag-border
        ${className}
      `}
    >
      {label}
    </span>
  );
}
