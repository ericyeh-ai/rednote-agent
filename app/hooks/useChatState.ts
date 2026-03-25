import { useCallback, useEffect } from "react";
import { Materials, Message } from "../types";
import { mockAiReply, getNextId } from "../utils/ai";
import { useLocalStorage } from "./useLocalStorage";

export function useChatState() {
  const [messages, setMessages] = useLocalStorage<Message[]>(
    "rednote_messages",
    []
  );

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

  // Send a message and get AI response
  const handleSend = useCallback(
    (text: string, materials: Materials): { userMsg: Message; aiMsg: Message } => {
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

      return { userMsg, aiMsg };
    },
    []
  );

  // Add a confirmation message to chat
  const addMessage = useCallback((role: "user" | "ai", text: string): Message => {
    const msg: Message = {
      id: getNextId(),
      role,
      text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  }, []);

  // Extract draft content from AI response if present
  const extractDraftFromResponse = useCallback((aiText: string): string | null => {
    const draftMatch = aiText.match(/「([\s\S]+?)」/);
    return draftMatch ? draftMatch[1] : null;
  }, []);

  return {
    messages,
    setMessages,
    handleSend,
    addMessage,
    extractDraftFromResponse,
  };
}
