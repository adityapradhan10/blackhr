type ChartTooltipEntry = {
  color?: string;
  name?: unknown;
  value?: unknown;
};

type ChartTooltipProps = {
  active?: boolean;
  label?: unknown;
  payload?: ReadonlyArray<ChartTooltipEntry>;
  valueFormatter?: (value: number) => string;
};

export function ChartTooltip({ active, label, payload, valueFormatter }: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const labelText = label === undefined ? undefined : String(label);

  return (
    <div className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 shadow-md">
      {labelText ? <p className="mb-1 text-xs font-medium text-slate-500">{labelText}</p> : null}
      <ul className="space-y-1">
        {payload.map((entry) => (
          <li className="flex items-center gap-2 text-sm text-slate-900" key={`${String(entry.name)}-${String(entry.value)}`}>
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color ?? '#6366f1' }}
            />
            <span className="font-medium">{String(entry.name ?? '')}</span>
            <span className="tabular-nums">
              {valueFormatter ? valueFormatter(Number(entry.value ?? 0)) : String(entry.value ?? '')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type ChartLegendProps = {
  items: Array<{ color: string; label: string }>;
};

export function ChartLegend({ items }: ChartLegendProps) {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
      {items.map((item) => (
        <li className="flex items-center gap-2 text-sm text-slate-600" key={item.label}>
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export function ChartEmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-80 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50">
      <p className="text-sm text-slate-500">{children}</p>
    </div>
  );
}
