export function NoteField({
  icon,
  label,
  placeholder,
  value,
  onChange,
  multiline,
}: {
  icon: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const baseClass =
    "w-full bg-transparent text-sm text-zinc-700 placeholder:text-zinc-300 outline-none resize-none leading-relaxed";

  return (
    <div className="group rounded-xl border border-transparent p-3 transition hover:border-zinc-100 hover:bg-zinc-50">
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="text-base">{icon}</span>
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">{label}</span>
      </div>
      {multiline ? (
        <textarea
          rows={4}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
        />
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
        />
      )}
    </div>
  );
}