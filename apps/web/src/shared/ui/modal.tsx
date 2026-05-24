import type { ReactNode } from 'react';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

type ModalWidth = 'lg' | 'md';

type ModalProps = {
  children: ReactNode;
  description?: string;
  title: string;
  width?: ModalWidth;
};

const WIDTH_CLASS: Record<ModalWidth, string> = {
  lg: 'max-w-3xl',
  md: 'max-w-md',
};

export function Modal({ children, description, title, width = 'md' }: ModalProps) {
  useLockBodyScroll(true);

  return (
    <div
      aria-labelledby="modal-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center overscroll-none p-4"
      role="dialog"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-slate-950/40" />

      <div
        className={`relative z-10 flex max-h-[calc(100vh-2rem)] w-full ${WIDTH_CLASS[width]} flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xl`}
      >
        <div className="shrink-0 border-b border-slate-100 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900" id="modal-title">
            {title}
          </h2>
          {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
