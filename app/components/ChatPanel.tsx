"use client";

import { useState, useRef, useEffect } from "react";
import { Message, AutoSuggestion } from "../types";
import { PanelHeader } from "./shared/PanelHeader";
import { ChatBubble } from "./shared/ChatBubble";
import { SuggestionBubble } from "./shared/SuggestionBubble";
import { SendIcon } from "./icons";

function ChatEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-zinc-400">
      <span className="text-4xl">🐾</span>
      <p className="text-sm font-medium text-zinc-500">讓 Momo 幫你寫一下小紅書</p>
      <p className="text-xs leading-relaxed max-w-[200px]">
        先在左邊填餐廳資訊，Momo 會問你幾個問題，然後幫你起稿
      </p>
    </div>
  );
}

export function ChatPanel({
  messages,
  autoSuggestions,
  onSend,
  onApplySuggestion,
  onIgnoreSuggestion,
}: {
  messages: Message[];
  autoSuggestions: AutoSuggestion[];
  onSend: (text: string) => void;
  onApplySuggestion: (action: string) => void;
  onIgnoreSuggestion: (id: string) => void;
}) {
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clear input when messages are added
  useEffect(() => {
    setInput("");
  }, [messages.length]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    onSend(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    // Only send on Enter if NOT composing (for Chinese/Japanese input support)
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleCompositionStart() {
    setIsComposing(true);
  }

  function handleCompositionEnd() {
    setIsComposing(false);
  }

  return (
    <div className="flex h-full flex-col">
      <PanelHeader icon="🐾" title="Momo" subtitle="你的美食 AI 分身" />

      {/* Message list */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.length === 0 && autoSuggestions.length === 0 && <ChatEmpty />}
        
        {/* Chat messages */}
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {/* Auto-suggestions from draft editing */}
        {autoSuggestions.map((suggestion) => (
          <SuggestionBubble
            key={suggestion.id}
            suggestion={suggestion}
            onApply={onApplySuggestion}
            onIgnore={onIgnoreSuggestion}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["✍️ 生成草稿", "💡 想標題", "🏷️ 推薦標籤", "🎨 輕鬆一點"].map((s) => (
          <button
            key={s}
            onClick={() => {
              setInput("");
              onSend(s);
            }}
            className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-500 transition hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="mt-3 flex items-end gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-100 transition">
        <textarea
          rows={1}
          placeholder="跟 Momo 說說這餐如何，或是直接說「生成草稿」⋯"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          className="flex-1 resize-none bg-transparent text-sm text-zinc-700 placeholder:text-zinc-400 outline-none leading-relaxed"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white transition hover:bg-rose-600 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}