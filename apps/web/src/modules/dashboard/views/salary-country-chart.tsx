import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getChartColor } from '../../../shared/constants/chart-palette';
import { ChartEmptyState, ChartTooltip } from '../../../shared/ui/chart-primitives';
import { LoadingMessage } from '../../../shared/ui/loading-message';
import { PanelCard } from '../../../shared/ui/panel-card';
import { formatCurrency } from '../../../shared/utils/formatters';

type SalaryCountryChartProps = {
  data: Array<{ averageSalary: number; country: string }>;
  isEmpty: boolean;
  isError: boolean;
  isLoading: boolean;
};

const currencyFormatter = (value: number) => formatCurrency(value);

export function SalaryCountryChart({ data, isEmpty, isError, isLoading }: SalaryCountryChartProps) {
  return (
    <PanelCard data-testid="salary-country-chart">
      <div className="mb-2">
        <h2 className="panel-card-title">Salary Distribution by Country</h2>
        <p className="panel-card-subtitle mt-1">Average salary across operating countries</p>
      </div>

      {isLoading ? (
        <LoadingMessage className="mt-6">Loading country chart...</LoadingMessage>
      ) : null}

      {isError ? (
        <p className="mt-6 text-sm text-red-600" role="alert">
          Unable to load country salary chart.
        </p>
      ) : null}

      {!isLoading && !isError && isEmpty ? (
        <ChartEmptyState>No salary distribution data available.</ChartEmptyState>
      ) : null}

      {!isLoading && !isError && !isEmpty ? (
        <div className="mt-6 h-80">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart barCategoryGap="20%" data={data} margin={{ bottom: 8, left: 4, right: 8, top: 8 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="country"
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={currencyFormatter}
                tickLine={false}
                width={72}
              />
              <Tooltip
                content={(props) => <ChartTooltip {...props} valueFormatter={currencyFormatter} />}
                cursor={{ fill: '#f1f5f9', opacity: 0.8 }}
              />
              <Bar dataKey="averageSalary" name="Average salary" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell fill={getChartColor(index)} key={entry.country} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </PanelCard>
  );
}
