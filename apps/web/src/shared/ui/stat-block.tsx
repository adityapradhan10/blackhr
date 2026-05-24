type StatBlockProps = {
  label: string;
  value: string;
};

export function StatBlock({ label, value }: StatBlockProps) {
  return (
    <div className="stat-block">
      <p className="stat-block-label">{label}</p>
      <p className="stat-block-value">{value}</p>
    </div>
  );
}
