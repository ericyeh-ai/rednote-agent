"use client";

import { MaterialsPanel } from "./components/MaterialsPanel";
import { ChatPanel } from "./components/ChatPanel";
import { DraftPanel } from "./components/DraftPanel";
import { useMaterialsState } from "./hooks/useMaterialsState";
import { useChatState } from "./hooks/useChatState";
import { useDraftState } from "./hooks/useDraftState";

// ─── Root ────────────────────────────────────────────────────────────────────

export default function Home() {
  // State management hooks
  const { materials, handleMaterialChange } = useMaterialsState();
  const { messages, handleSend: sendMessage, addMessage, extractDraftFromResponse } =
    useChatState();
  const {
    draft,
    setDraft,
    setPreviousDraft,
    autoSuggestions,
    handleDraftChange,
    handleApplySuggestion: applySuggestion,
    handleIgnoreSuggestion,
  } = useDraftState();

  // Handle chat message sending
  function handleSend(text: string) {
    const { userMsg, aiMsg } = sendMessage(text, materials);
    
    // If AI response looks like a draft, push it to the editor
    const extractedDraft = extractDraftFromResponse(aiMsg.text);
    if (extractedDraft) {
      setDraft(extractedDraft);
      setPreviousDraft(extractedDraft);
    }

    // Clear auto-suggestions when user sends message
    // (already handled by sendMessage)
  }

  // Handle suggestion application
  function handleApplySuggestion(action: string) {
    const updatedDraft = applySuggestion(action);
    
    // Add confirmation message to chat
    addMessage(
      "ai",
      `✅ 已為你應用「${action}」建議。草稿已更新！`
    );
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-50 font-sans overflow-hidden">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6 py-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🍜</span>
          <span className="text-sm font-bold text-zinc-900">小紅書美食助手</span>
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-medium text-rose-600">
            Beta
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          AI 就緒
        </div>
      </header>

      {/* Three-column layout */}
      <main className="grid flex-1 grid-cols-[280px_1fr_320px] divide-x divide-zinc-200 overflow-hidden">
        {/* Left: Materials */}
        <aside className="flex flex-col overflow-hidden bg-white p-5">
          <MaterialsPanel materials={materials} onChange={handleMaterialChange} />
        </aside>

        {/* Middle: Chat */}
        <section className="flex flex-col overflow-hidden bg-white p-5">
          <ChatPanel
            messages={messages}
            autoSuggestions={autoSuggestions}
            onSend={handleSend}
            onApplySuggestion={handleApplySuggestion}
            onIgnoreSuggestion={handleIgnoreSuggestion}
          />
        </section>

        {/* Right: Draft Editor */}
        <aside className="flex flex-col overflow-hidden bg-white p-5">
          <DraftPanel draft={draft} onDraftChange={handleDraftChange} />
        </aside>
      </main>
    </div>
  );
}
