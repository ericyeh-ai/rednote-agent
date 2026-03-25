import { AutoSuggestion } from "../../types";

interface SuggestionBubbleProps {
  suggestion: AutoSuggestion;
  onApply: (action: string) => void;
  onIgnore: (id: string) => void;
}

export function SuggestionBubble({
  suggestion,
  onApply,
  onIgnore,
}: SuggestionBubbleProps) {
  const typeColors: Record<string, string> = {
    tone: "border-blue-200 bg-blue-50",
    completeness: "border-amber-200 bg-amber-50",
    engagement: "border-purple-200 bg-purple-50",
    consistency: "border-green-200 bg-green-50",
  };

  const typeEmoji: Record<string, string> = {
    tone: "🎨",
    completeness: "📝",
    engagement: "✨",
    consistency: "🔄",
  };

  return (
    <div
      className={`rounded-2xl border p-4 ${typeColors[suggestion.type]} transition hover:shadow-sm`}
    >
      <div className="flex items-start gap-3 mb-2">
        <span className="text-lg">{typeEmoji[suggestion.type]}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-zinc-800">
            {suggestion.title}
          </h3>
          <p className="text-sm text-zinc-600 leading-relaxed mt-1">
            {suggestion.message}
          </p>
        </div>
        <span className="text-xs font-medium text-zinc-400 whitespace-nowrap">
          {suggestion.confidence}%
        </span>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onApply(suggestion.suggestedAction)}
          className="flex-1 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-rose-600 active:scale-95"
        >
          應用
        </button>
        <button
          onClick={() => onIgnore(suggestion.id)}
          className="flex-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 active:scale-95"
        >
          忽略
        </button>
      </div>
    </div>
  );
}