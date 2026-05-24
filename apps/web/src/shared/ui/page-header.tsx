import type { ReactNode } from 'react';

type PageHeaderProps = {
  actions?: ReactNode;
  description?: string;
  title: string;
};

export function PageHeader({ actions, description, title }: PageHeaderProps) {
  return (
    <header className={`mb-8 ${actions ? 'flex items-start justify-between gap-4' : ''}`}>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>
      {actions}
    </header>
  );
}
