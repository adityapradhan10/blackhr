import type { DepartmentDistributionBucket } from '@blackhr/shared-types';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { getChartColor } from '../../../shared/constants/chart-palette';
import { ChartEmptyState, ChartLegend, ChartTooltip } from '../../../shared/ui/chart-primitives';
import { PanelCard } from '../../../shared/ui/panel-card';

type SalaryDistributionChartProps = {
  data: DepartmentDistributionBucket[];
  isEmpty: boolean;
  isLoading: boolean;
};

const countFormatter = (value: number) => value.toLocaleString('en-US');

export function SalaryDistributionChart({ data, isEmpty, isLoading }: SalaryDistributionChartProps) {
  const totalEmployees = data.reduce((sum, bucket) => sum + bucket.count, 0);
  const legendItems = data.map((bucket, index) => ({
    color: getChartColor(index),
    label: bucket.label,
  }));

  return (
    <PanelCard data-testid="department-distribution-chart">
      <div className="mb-2">
        <h2 className="panel-card-title">Employees by Department</h2>
        <p className="panel-card-subtitle mt-1">Headcount distribution across departments</p>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-slate-500" role="status">
          Loading department chart...
        </p>
      ) : null}

      {!isLoading && isEmpty ? (
        <ChartEmptyState>No department data available.</ChartEmptyState>
      ) : null}

      {!isLoading && !isEmpty ? (
        <>
          <div className="relative mt-6 h-80">
            <ResponsiveContainer height="100%" width="100%">
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={data}
                  dataKey="count"
                  innerRadius="58%"
                  nameKey="label"
                  outerRadius="82%"
                  paddingAngle={2}
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {data.map((bucket, index) => (
                    <Cell fill={getChartColor(index)} key={bucket.label} />
                  ))}
                </Pie>
                <Tooltip content={(props) => <ChartTooltip {...props} valueFormatter={countFormatter} />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">Total</p>
              <p className="text-2xl font-semibold text-slate-900 tabular-nums">
                {countFormatter(totalEmployees)}
              </p>
            </div>
          </div>

          <ChartLegend items={legendItems} />
        </>
      ) : null}
    </PanelCard>
  );
}
