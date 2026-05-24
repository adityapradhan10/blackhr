import { Card } from '@tremor/react';
import type { ComponentProps, ReactNode } from 'react';

type PanelCardProps = ComponentProps<typeof Card> & {
  children: ReactNode;
};

export function PanelCard({ children, className, ...props }: PanelCardProps) {
  return (
    <Card
      className={`border border-slate-200/80 bg-white shadow-sm ring-0 ${className ?? ''}`}
      {...props}
    >
      {children}
    </Card>
  );
}
