type LoadingMessageProps = {
  'aria-label'?: string;
  children: string;
  className?: string;
};

export function LoadingMessage({ 'aria-label': ariaLabel, children, className }: LoadingMessageProps) {
  return (
    <p aria-label={ariaLabel} className={`text-sm text-slate-500${className ? ` ${className}` : ''}`} role="status">
      {children}
    </p>
  );
}
