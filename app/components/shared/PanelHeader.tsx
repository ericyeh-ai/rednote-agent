export function PanelHeader({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <div>
        <h2 className="text-sm font-semibold text-zinc-800">{title}</h2>
        <p className="text-xs text-zinc-400">{subtitle}</p>
      </div>
    </div>
  );
}