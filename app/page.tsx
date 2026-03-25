"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Materials, Message, AutoSuggestion } from "./types";
import { mockAiReply, getNextId } from "./utils/ai";
import { getMockAISuggestions, applyMockAutoFix } from "./utils/mockAiSuggestions";
import { createRevision, DraftRevision } from "./utils/draftRevisionTracking";
import { MaterialsPanel } from "./components/MaterialsPanel";
import { ChatPanel } from "./components/ChatPanel";
import { DraftPanel } from "./components/DraftPanel";
import { useLocalStorage } from "./hooks/useLocalStorage";

// ─── Root ────────────────────────────────────────────────────────────────────

const defaultMaterials: Materials = {
  restaurant: "",
  location: "",
  dishes: "",
  notes: "",
};

export default function Home() {
  const [materials, setMaterials] = useLocalStorage<Materials>(
    "rednote_materials",
    defaultMaterials
  );
  const [messages, setMessages] = useLocalStorage<Message[]>(
    "rednote_messages",
    []
  );
  const [draft, setDraft] = useLocalStorage<string>("rednote_draft", "");
  const [previousDraft, setPreviousDraft] = useLocalStorage<string>(
    "rednote_previousDraft",
    ""
  );
  const [revisions, setRevisions] = useLocalStorage<DraftRevision[]>(
    "rednote_revisions",
    []
  );
  const [autoSuggestions, setAutoSuggestions] = useState<AutoSuggestion[]>([]);
  const suggestionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-generate suggestions when draft changes
  const handleDraftChange = useCallback((newDraft: string) => {
    setDraft(newDraft);

    // Track revision if content changed from previous draft
    if (previousDraft !== newDraft && previousDraft.trim() !== "") {
      const revision = createRevision(previousDraft, newDraft);
      setRevisions((prev) => [...prev, revision]);
    }

    // Clear pending suggestion timeout
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }

    // Generate suggestions after a short delay (debounce)
    suggestionTimeoutRef.current = setTimeout(() => {
      const suggestions = getMockAISuggestions(previousDraft, newDraft);
      if (suggestions.length > 0) {
        setAutoSuggestions(suggestions);
      }
      setPreviousDraft(newDraft);
    }, 800);
  }, [previousDraft]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, []);

  // Clean up duplicate message IDs on mount
  useEffect(() => {
    if (messages.length > 0) {
      const ids = new Set<number>();
      let hasDuplicates = false;
      
      for (const msg of messages) {
        if (ids.has(msg.id)) {
          hasDuplicates = true;
          break;
        }
        ids.add(msg.id);
      }
      
      // If duplicates found, clear all messages to start fresh
      if (hasDuplicates) {
        console.warn("Duplicate message IDs detected, clearing chat history");
        setMessages([]);
      }
    }
  }, []); // Run only once on mount

  function handleMaterialChange(field: keyof Materials, value: string) {
    setMaterials((prev) => ({ ...prev, [field]: value }));
  }

  function handleSend(text: string) {
    const userMsg: Message = {
      id: getNextId(),
      role: "user",
      text,
      timestamp: Date.now(),
    };
    const aiText = mockAiReply(text, materials);
    const aiMsg: Message = {
      id: getNextId(),
      role: "ai",
      text: aiText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setAutoSuggestions([]); // Clear auto-suggestions when user sends message

    // If AI response looks like a draft, push it to the editor
    if (
      text.includes("生成") ||
      text.includes("草稿") ||
      text.includes("寫")
    ) {
      const draftMatch = aiText.match(/「([\s\S]+?)」/);
      if (draftMatch) {
        setDraft(draftMatch[1]);
        setPreviousDraft(draftMatch[1]);
      }
    }
  }

  function handleApplySuggestion(action: string) {
    const updatedDraft = applyMockAutoFix(draft, action);
    
    // Track revision when suggestion is applied
    if (draft !== updatedDraft) {
      const revision = createRevision(draft, updatedDraft);
      setRevisions((prev) => [...prev, revision]);
    }
    
    setDraft(updatedDraft);
    setPreviousDraft(updatedDraft);
    setAutoSuggestions([]);

    // Add confirmation message to chat
    const confirmMsg: Message = {
      id: getNextId(),
      role: "ai",
      text: `✅ 已為你應用「${action}」建議。草稿已更新！`,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, confirmMsg]);
  }

  function handleIgnoreSuggestion(id: string) {
    setAutoSuggestions((prev) => prev.filter((s) => s.id !== id));
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
