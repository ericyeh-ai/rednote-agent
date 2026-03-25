/**
 * Example State Management Implementation with React Hooks
 *
 * This file shows how to implement the state design using React hooks.
 * This is an example - you can use Zustand, Redux, Jotai, etc. instead.
 *
 * NOT PRODUCTION CODE - Just illustrative pattern
 */

"use client";

import { useCallback, useState, useRef } from "react";
import {
  AppState,
  Message,
  Suggestions,
  SuggestionAction,
  DraftGeneration,
  defaultAppState,
  Materials,
} from "../types";

/**
 * Main hook for managing app state
 *
 * Usage:
 * ```typescript
 * const { state, actions } = useAppState();
 * actions.updateMaterial("restaurant", "鼎泰豐");
 * ```
 */
export function useAppState() {
  const [state, setState] = useState<AppState>(defaultAppState);
  const messageIdCounterRef = useRef(0);
  const draftIdCounterRef = useRef(0);

  // ─── Material Actions ───────────────────────────────────────────────────────

  const updateMaterial = useCallback(
    (field: keyof Materials, value: string) => {
      setState((prev) => ({
        ...prev,
        materials: { ...prev.materials, [field]: value },
      }));
    },
    []
  );

  const clearMaterials = useCallback(() => {
    setState((prev) => ({
      ...prev,
      materials: defaultAppState.materials,
    }));
  }, []);

  // ─── Chat Actions ───────────────────────────────────────────────────────────

  const sendMessage = useCallback((text: string) => {
    const userMsg: Message = {
      id: ++messageIdCounterRef.current,
      role: "user",
      text,
      timestamp: Date.now(),
    };
    setState((prev) => ({
      ...prev,
      chat: {
        messageIdCounter: messageIdCounterRef.current,
        messages: [...prev.chat.messages, userMsg],
      },
    }));
  }, []);

  const addAiMessage = useCallback((text: string) => {
    const aiMsg: Message = {
      id: ++messageIdCounterRef.current,
      role: "ai",
      text,
      timestamp: Date.now(),
    };
    setState((prev) => ({
      ...prev,
      chat: {
        messageIdCounter: messageIdCounterRef.current,
        messages: [...prev.chat.messages, aiMsg],
      },
    }));
  }, []);

  const clearMessages = useCallback(() => {
    messageIdCounterRef.current = 0;
    setState((prev) => ({
      ...prev,
      chat: defaultAppState.chat,
    }));
  }, []);

  // ─── Suggestion Actions ────────────────────────────────────────────────────

  const updateSuggestions = useCallback(
    (suggestions: Suggestions, action: SuggestionAction) => {
      setState((prev) => ({
        ...prev,
        suggestions: {
          ...prev.suggestions,
          suggestions,
          isLoading: false,
          lastAction: action,
          generatedAt: Date.now(),
        },
      }));
    },
    []
  );

  const setSuggestionLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({
      ...prev,
      suggestions: { ...prev.suggestions, isLoading },
    }));
  }, []);

  const setSuggestionError = useCallback((error?: string) => {
    setState((prev) => ({
      ...prev,
      suggestions: { ...prev.suggestions, error },
    }));
  }, []);

  const clearSuggestions = useCallback(() => {
    setState((prev) => ({
      ...prev,
      suggestions: defaultAppState.suggestions,
    }));
  }, []);

  // ─── Draft Actions ─────────────────────────────────────────────────────────

  const updateDraft = useCallback((content: string) => {
    setState((prev) => ({
      ...prev,
      draft: {
        ...prev.draft,
        content,
        isModified: true,
        characterCount: content.length,
        lastEditTime: Date.now(),
      },
    }));
  }, []);

  const replaceDraft = useCallback(
    (content: string, action?: SuggestionAction) => {
      const generation: DraftGeneration = {
        id: `draft_${++draftIdCounterRef.current}`,
        content,
        generatedAt: Date.now(),
        source: action ? "ai" : "user",
        action,
      };

      setState((prev) => ({
        ...prev,
        draft: {
          ...prev.draft,
          content,
          previousContent: prev.draft.content,
          isModified: false,
          generationHistory: [...prev.draft.generationHistory, generation],
          characterCount: content.length,
          lastEditTime: Date.now(),
        },
      }));
    },
    []
  );

  const clearDraft = useCallback(() => {
    setState((prev) => ({
      ...prev,
      draft: defaultAppState.draft,
    }));
  }, []);

  const copyDraftToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(state.draft.content);
      setState((prev) => ({
        ...prev,
        ui: { ...prev.ui, copiedToClipboard: true },
      }));
      // Auto-dismiss after 2s
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          ui: { ...prev.ui, copiedToClipboard: false },
        }));
      }, 2000);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        ui: { ...prev.ui, error: "複製失敗" },
      }));
    }
  }, [state.draft.content]);

  // ─── UI Actions ────────────────────────────────────────────────────────────

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({
      ...prev,
      ui: { ...prev.ui, isLoading },
    }));
  }, []);

  const setError = useCallback((error?: string) => {
    setState((prev) => ({
      ...prev,
      ui: { ...prev.ui, error },
    }));
  }, []);

  const setActivePanel = useCallback(
    (panel?: "materials" | "chat" | "draft") => {
      setState((prev) => ({
        ...prev,
        ui: { ...prev.ui, activePanel: panel },
      }));
    },
    []
  );

  // ─── Computed Properties ───────────────────────────────────────────────────

  const computed = {
    getDraftLength: () => state.draft.content.length,
    isDraftEmpty: () => !state.draft.content.trim(),
    isMaterialsComplete: () =>
      state.materials.restaurant.trim().length > 0 &&
      state.materials.dishes.trim().length > 0,
    getLastUserMessage: () =>
      [...state.chat.messages].reverse().find((m) => m.role === "user"),
    getLastAiMessage: () =>
      [...state.chat.messages].reverse().find((m) => m.role === "ai"),
    hasSuggestions: () => Object.keys(state.suggestions.suggestions).length > 0,
    getCurrentSuggestionAction: () => state.suggestions.lastAction,
    isAnyOperationInProgress: () =>
      state.ui.isLoading || state.suggestions.isLoading,
  };

  return {
    state,
    actions: {
      // Materials
      updateMaterial,
      clearMaterials,
      // Chat
      sendMessage,
      addAiMessage,
      clearMessages,
      // Suggestions
      updateSuggestions,
      setSuggestionLoading,
      setSuggestionError,
      clearSuggestions,
      // Draft
      updateDraft,
      replaceDraft,
      clearDraft,
      copyDraftToClipboard,
      // UI
      setLoading,
      setError,
      setActivePanel,
    },
    computed,
  };
}

/**
 * Example usage in a component:
 *
 * ```typescript
 * export function MyComponent() {
 *   const { state, actions, computed } = useAppState();
 *
 *   return (
 *     <>
 *       <input
 *         value={state.materials.restaurant}
 *         onChange={(e) =>
 *           actions.updateMaterial("restaurant", e.target.value)
 *         }
 *       />
 *       <p>字数: {computed.getDraftLength()}</p>
 *     </>
 *   );
 * }
 * ```
 */
