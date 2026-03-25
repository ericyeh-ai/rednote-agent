"use client";

import { useState, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Materials {
  restaurant: string;
  location: string;
  dishes: string;
  notes: string;
}

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
}

// ─── Mock AI response ────────────────────────────────────────────────────────

let msgId = 0;

function mockAiReply(userText: string, materials: Materials): string {
  const name = materials.restaurant || "這家餐廳";
  const loc = materials.location || "台北";
  const dish = materials.dishes?.split(/[,，、]/)[0] || "招牌菜";

  if (userText.includes("標題")) {
    return `好的！這裡有三個標題候選：\n\n1. 🔥 ${name} 讓我吃一次就上癮\n2. 在${loc}發現的寶藏小店，${dish}必點！\n3. 不誇張！${name}是我今年吃過最驚艷的一餐\n\n你喜歡哪個風格？我可以繼續調整。`;
  }
  if (userText.includes("標籤") || userText.includes("tag")) {
    return `推薦這些標籤 👇\n\n#${name} #${loc}美食 #台灣美食 #${dish} #小紅書美食 #餐廳推薦 #必吃清單\n\n可以再根據你的受眾加幾個垂直領域的標籤，例如 #約會餐廳 或 #親子友善。`;
  }
  if (userText.includes("生成") || userText.includes("草稿") || userText.includes("寫")) {
    return `這是根據你的素材生成的草稿：\n\n「去了 ${name}（${loc}），真的被驚艷到了！\n\n${materials.notes || "環境舒適，服務超好，完全不像一般餐廳。"}\n\n${dish} 是必點項目，每一口都有驚喜。整體體驗非常值得，強烈推薦給大家！🍽️」\n\n這是初稿，你想調整語氣還是加更多細節？`;
  }
  if (userText.includes("輕鬆") || userText.includes("casual")) {
    return `好，我把語氣調成更輕鬆日常的版本！\n\n「週末跑去試了 ${name}，整個人被療癒到 😭\n\n${dish} 一上桌就秒殺，完全停不下來。環境也很舒服，坐著聊天聊了快三小時都不想走。\n\n${loc}的朋友快去！下次我還要再去 🙌」\n\n這樣感覺比較像在跟朋友說話對吧？`;
  }

  return `收到！你說的「${userText.slice(0, 20)}」我記下來了。\n\n根據你目前填的素材，我可以幫你：\n• 生成完整貼文草稿\n• 想標題（可以給我喜歡的風格）\n• 推薦標籤\n• 調整語氣（輕鬆 / 推薦 / 種草）\n\n要從哪個開始？`;
}

// ─── Left Panel: Materials ────────────────────────────────────────────────────

function MaterialsPanel({
  materials,
  onChange,
}: {
  materials: Materials;
  onChange: (field: keyof Materials, value: string) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <PanelHeader icon="📋" title="素材" subtitle="隨手記下餐廳資訊" />

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto pt-1 pr-1">
        <NoteField
          icon="🍽️"
          label="餐廳名稱"
          placeholder="e.g. 鼎泰豐 信義店"
          value={materials.restaurant}
          onChange={(v) => onChange("restaurant", v)}
        />
        <NoteField
          icon="📍"
          label="地點"
          placeholder="e.g. 台北市信義區"
          value={materials.location}
          onChange={(v) => onChange("location", v)}
        />
        <NoteField
          icon="🥢"
          label="推薦菜色"
          placeholder="e.g. 小籠包、蝦仁炒飯"
          value={materials.dishes}
          onChange={(v) => onChange("dishes", v)}
        />
        <NoteField
          icon="✏️"
          label="原始筆記"
          placeholder="隨意記下感受、細節、亮點⋯"
          value={materials.notes}
          onChange={(v) => onChange("notes", v)}
          multiline
        />

        <div className="rounded-xl border border-dashed border-zinc-200 p-3 text-center text-xs text-zinc-400 hover:border-zinc-300 cursor-pointer transition select-none">
          + 新增欄位
        </div>
      </div>
    </div>
  );
}

function NoteField({
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

// ─── Middle Panel: Chat ───────────────────────────────────────────────────────

function ChatPanel({
  messages,
  onSend,
}: {
  messages: Message[];
  onSend: (text: string) => void;
}) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-full flex-col">
      <PanelHeader icon="💬" title="AI 助手" subtitle="告訴我你想要什麼" />

      {/* Message list */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.length === 0 && <ChatEmpty />}
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["✍️ 生成草稿", "💡 想標題", "🏷️ 推薦標籤", "🎨 輕鬆語氣"].map((s) => (
          <button
            key={s}
            onClick={() => onSend(s)}
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
          placeholder="輸入指令，或描述你想要的效果⋯"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
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

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${
          isUser ? "bg-rose-100 text-rose-600" : "bg-zinc-100 text-zinc-600"
        }`}
      >
        {isUser ? "你" : "AI"}
      </div>
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-rose-500 text-white rounded-tr-sm"
            : "bg-zinc-100 text-zinc-700 rounded-tl-sm"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}

function ChatEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-zinc-400">
      <span className="text-4xl">✨</span>
      <p className="text-sm font-medium text-zinc-500">開始跟 AI 對話</p>
      <p className="text-xs leading-relaxed max-w-[200px]">
        先在左側填入素材，再告訴我你想要什麼風格的貼文
      </p>
    </div>
  );
}

// ─── Right Panel: Draft Editor ────────────────────────────────────────────────

function DraftPanel({
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
          <p className="text-sm">草稿會在這裡出現</p>
          <p className="text-xs text-zinc-300">跟 AI 說「生成草稿」就可以開始</p>
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

// ─── Shared primitives ────────────────────────────────────────────────────────

function PanelHeader({
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

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22l-4-9-9-4 20-7z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────

const defaultMaterials: Materials = {
  restaurant: "",
  location: "",
  dishes: "",
  notes: "",
};

export default function Home() {
  const [materials, setMaterials] = useState<Materials>(defaultMaterials);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");

  function handleMaterialChange(field: keyof Materials, value: string) {
    setMaterials((prev) => ({ ...prev, [field]: value }));
  }

  function handleSend(text: string) {
    const userMsg: Message = { id: ++msgId, role: "user", text };
    const aiText = mockAiReply(text, materials);
    const aiMsg: Message = { id: ++msgId, role: "ai", text: aiText };

    setMessages((prev) => [...prev, userMsg, aiMsg]);

    // If AI response looks like a draft, push it to the editor
    if (
      text.includes("生成") ||
      text.includes("草稿") ||
      text.includes("寫")
    ) {
      const draftMatch = aiText.match(/「([\s\S]+?)」/);
      if (draftMatch) setDraft(draftMatch[1]);
    }
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
          <ChatPanel messages={messages} onSend={handleSend} />
        </section>

        {/* Right: Draft Editor */}
        <aside className="flex flex-col overflow-hidden bg-white p-5">
          <DraftPanel draft={draft} onDraftChange={setDraft} />
        </aside>
      </main>
    </div>
  );
}
