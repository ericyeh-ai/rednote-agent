import { PanelHeader } from "./shared/PanelHeader";
import { CopyIcon } from "./icons";

export function DraftPanel({
  draft,
  onDraftChange,
}: {
  draft: string;
  onDraftChange: (v: string) => void;
}) {
  const isEmpty = !draft.trim();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between mb-4">
        <PanelHeader icon="📄" title="草稿" subtitle="可直接編輯" />
        {!isEmpty && (
          <button
            onClick={() => navigator.clipboard.writeText(draft)}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-700"
          >
            <CopyIcon />
            複製
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-zinc-400">
          <span className="text-4xl">📝</span>
          <p className="text-sm">Momo 的草稿會出現在這裡</p>
          <p className="text-xs text-zinc-300">跟 Momo 說「生成草稿」就可以開始</p>
        </div>
      ) : (
        <textarea
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          className="flex-1 resize-none text-sm leading-8 text-zinc-700 outline-none placeholder:text-zinc-300 overflow-y-auto"
          placeholder="草稿內容⋯"
        />
      )}

      {!isEmpty && (
        <div className="mt-3 border-t border-zinc-100 pt-3">
          <p className="text-xs text-zinc-400">{draft.length} 字元</p>
        </div>
      )}
    </div>
  );
}