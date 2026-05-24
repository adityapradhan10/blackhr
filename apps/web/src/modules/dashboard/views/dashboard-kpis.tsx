import { Grid } from '@tremor/react';
import type { DashboardDisplay } from '../types';
import { PanelCard } from '../../../shared/ui/panel-card';

type DashboardKpisProps = {
  display: DashboardDisplay;
  isLoading: boolean;
};

const KPI_ITEMS = [
  { color: 'indigo' as const, key: 'totalEmployees', title: 'Total Employees' },
  { color: 'sky' as const, key: 'highestPayingCountry', title: 'Highest Paying Country' },
  { color: 'violet' as const, key: 'highestPayingRole', title: 'Highest Paying Role' },
  { color: 'emerald' as const, key: 'medianSalary', title: 'Median Salary' },
] as const;

function KpiCard({
  decorationColor,
  isLoading,
  title,
  value,
}: {
  decorationColor: 'emerald' | 'indigo' | 'sky' | 'violet';
  isLoading: boolean;
  title: string;
  value: string;
}) {
  return (
    <PanelCard decoration="top" decorationColor={decorationColor}>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      {isLoading ? (
        <p className="mt-3 text-sm text-slate-400" role="status">
          Loading...
        </p>
      ) : (
        <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">{value}</p>
      )}
    </PanelCard>
  );
}

export function DashboardKpis({ display, isLoading }: DashboardKpisProps) {
  return (
    <Grid className="mb-8 gap-6" numItemsMd={2} numItemsLg={4}>
      {KPI_ITEMS.map((item) => (
        <KpiCard
          decorationColor={item.color}
          isLoading={isLoading}
          key={item.key}
          title={item.title}
          value={display[item.key]}
        />
      ))}
    </Grid>
  );
}
