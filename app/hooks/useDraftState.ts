import { useState, useRef, useEffect, useCallback } from "react";
import { AutoSuggestion } from "../types";
import { DraftRevision } from "../utils/draftRevisionTracking";
import { getMockAISuggestions, applyMockAutoFix } from "../utils/mockAiSuggestions";
import { createRevision } from "../utils/draftRevisionTracking";
import { useLocalStorage } from "./useLocalStorage";

export function useDraftState() {
  const [draft, setDraft] = useLocalStorage<string>("momopi_draft", "");
  const [previousDraft, setPreviousDraft] = useLocalStorage<string>(
    "momopi_previousDraft",
    ""
  );
  const [revisions, setRevisions] = useLocalStorage<DraftRevision[]>(
    "momopi_revisions",
    []
  );
  const [autoSuggestions, setAutoSuggestions] = useState<AutoSuggestion[]>([]);
  const suggestionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-generate suggestions when draft changes
  const handleDraftChange = useCallback(
    (newDraft: string) => {
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
    },
    [previousDraft]
  );

  // Handle applying a suggestion with auto-fix
  const handleApplySuggestion = useCallback(
    (action: string): string => {
      const updatedDraft = applyMockAutoFix(draft, action);

      // Track revision when suggestion is applied
      if (draft !== updatedDraft) {
        const revision = createRevision(draft, updatedDraft);
        setRevisions((prev) => [...prev, revision]);
      }

      setDraft(updatedDraft);
      setPreviousDraft(updatedDraft);
      setAutoSuggestions([]);

      return updatedDraft;
    },
    [draft]
  );

  // Ignore a suggestion
  const handleIgnoreSuggestion = useCallback((id: string) => {
    setAutoSuggestions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, []);

  return {
    draft,
    setDraft,
    previousDraft,
    setPreviousDraft,
    revisions,
    setRevisions,
    autoSuggestions,
    setAutoSuggestions,
    handleDraftChange,
    handleApplySuggestion,
    handleIgnoreSuggestion,
  };
}
