/**
 * Frontend State Actions & Operations
 *
 * This file defines the user actions available in the app,
 * organized by domain. These are the operations that modify state.
 *
 * Implementation: These can be implemented with React hooks,
 * Redux reducers, Zustand store, Jotai atoms, etc.
 */

import { 
  AppState, 
  Materials, 
  Message, 
  Suggestions, 
  SuggestionAction,
  DraftGeneration 
} from "./state";

// ─── Material Actions ─────────────────────────────────────────────────────────

export interface MaterialActions {
  /** Update a single material field */
  updateMaterial(field: keyof Materials, value: string): void;
  
  /** Clear/reset all materials */
  clearMaterials(): void;
  
  /** Load materials from a saved state */
  loadMaterials(materials: Partial<Materials>): void;
}

// ─── Chat Actions ─────────────────────────────────────────────────────────────

export interface ChatActions {
  /** Send a user message to the chat */
  sendMessage(text: string): void;
  
  /** Add an AI response message */
  addAiMessage(text: string): void;
  
  /** Send a quick suggestion (e.g., "生成草稿", "想標題") */
  sendQuickSuggestion(suggestion: string): void;
  
  /** Clear all messages */
  clearMessages(): void;
  
  /** Delete a specific message by id */
  deleteMessage(id: number): void;
}

// ─── Suggestion Actions ──────────────────────────────────────────────────────

export interface SuggestionActions {
  /** Request AI to generate draft (frontend only - no API call yet) */
  requestGenerateDraft(): void;
  
  /** Request AI to generate title suggestions */
  requestGenerateTitles(): void;
  
  /** Request AI to generate hashtags */
  requestGenerateHashtags(): void;
  
  /** Request AI to adjust tone/style */
  requestAdjustTone(tone: string): void;
  
  /** Update suggestions with mock data for testing */
  updateSuggestions(suggestions: Suggestions): void;
  
  /** Set loading state */
  setSuggestionLoading(isLoading: boolean): void;
  
  /** Set error state */
  setSuggestionError(error?: string): void;
  
  /** Clear current suggestions */
  clearSuggestions(): void;
  
  /** Apply a suggestion to the draft */
  applySuggestion(type: "title" | "hashtag" | "draft" | "tone", value: string): void;
}

// ─── Draft Actions ────────────────────────────────────────────────────────────

export interface DraftActions {
  /** Update draft content */
  updateDraft(content: string): void;
  
  /** Replace entire draft content (e.g., from AI suggestion) */
  replaceDraft(content: string, action?: SuggestionAction): void;
  
  /** Append content to draft */
  appendDraft(content: string): void;
  
  /** Clear draft content */
  clearDraft(): void;
  
  /** Copy draft to clipboard (local only) */
  copyDraftToClipboard(): Promise<void>;
  
  /** Undo last draft change */
  undoDraft(): void;
  
  /** Check if draft has unsaved changes */
  hasPendingChanges(): boolean;
}

// ─── UI Actions ───────────────────────────────────────────────────────────────

export interface UIActions {
  /** Set active panel */
  setActivePanel(panel: "materials" | "chat" | "draft"): void;
  
  /** Set global loading state */
  setLoading(isLoading: boolean): void;
  
  /** Set global error message */
  setError(error?: string): void;
  
  /** Reset error */
  clearError(): void;
  
  /** Show copy-to-clipboard confirmation */
  showCopySuccess(): void;
  
  /** Dismiss copy confirmation */
  dismissCopySuccess(): void;
}

// ─── Combined Actions ─────────────────────────────────────────────────────────

export interface StateActions 
  extends MaterialActions, 
          ChatActions, 
          SuggestionActions, 
          DraftActions, 
          UIActions {}

// ─── Computed Properties ──────────────────────────────────────────────────────

/**
 * Derived/computed values from state
 * These are read-only properties derived from the state
 */
export interface StateComputed {
  /** Get the current draft character count */
  getDraftLength(): number;
  
  /** Check if draft is empty */
  isDraftEmpty(): boolean;
  
  /** Check if materials are complete enough */
  isMaterialsComplete(): boolean;
  
  /** Get last user message */
  getLastUserMessage(): Message | undefined;
  
  /** Get last AI message */
  getLastAiMessage(): Message | undefined;
  
  /** Check if suggestions are available */
  hasSuggestions(): boolean;
  
  /** Get the suggestion action that's currently loading */
  getCurrentSuggestionAction(): SuggestionAction | undefined;
  
  /** Check if any operation is in progress */
  isAnyOperationInProgress(): boolean;
}

// ─── State Update Pattern ──────────────────────────────────────────────────────

/**
 * Helper type for reducer-style state updates
 * Useful for implementing with Redux, Zustand, Jotai, etc.
 */
export type StateReducer = (
  state: AppState,
  action: StateAction
) => AppState;

export type StateAction = 
  | { type: "UPDATE_MATERIAL"; field: keyof Materials; value: string }
  | { type: "CLEAR_MATERIALS" }
  | { type: "SEND_MESSAGE"; text: string; role: "user" | "ai" }
  | { type: "UPDATE_DRAFT"; content: string }
  | { type: "REPLACE_DRAFT"; content: string; action?: SuggestionAction }
  | { type: "SET_SUGGESTIONS"; suggestions: Suggestions; action: SuggestionAction }
  | { type: "SET_SUGGESTION_LOADING"; isLoading: boolean }
  | { type: "SET_SUGGESTION_ERROR"; error?: string }
  | { type: "CLEAR_SUGGESTIONS" }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_ERROR"; error?: string }
  | { type: "SET_ACTIVE_PANEL"; panel?: "materials" | "chat" | "draft" };
