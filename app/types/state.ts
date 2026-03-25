/**
 * Frontend Product State Design for Xiaohongshu Writing Copilot
 *
 * This file defines the complete frontend state model for the app,
 * organized by functional domain:
 * - Materials (user input data)
 * - Chat (conversation history)
 * - Suggestions (AI-generated suggestions)
 * - Draft (edited content)
 * - UI State (application state)
 */

import { DraftRevision } from "../utils/draftRevisionTracking";

// ─── Materials State ──────────────────────────────────────────────────────────
/** User-provided restaurant context and notes */
export interface Materials {
  restaurant: string;
  location: string;
  dishes: string;
  notes: string;
}

/** Empty/default materials state */
export const defaultMaterials: Materials = {
  restaurant: "",
  location: "",
  dishes: "",
  notes: "",
};

// ─── Chat State ───────────────────────────────────────────────────────────────
/** Single message in the chat history */
export interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
  timestamp: number;
}

/** Chat conversation state */
export interface ChatState {
  messages: Message[];
  messageIdCounter: number;
}

export const defaultChatState: ChatState = {
  messages: [],
  messageIdCounter: 0,
};

// ─── AI Suggestions State ─────────────────────────────────────────────────────
/** Different types of AI suggestions */
export interface Suggestions {
  titles?: string[];
  hashtags?: string[];
  draftContent?: string;
  toneVariation?: string;
}

/** Auto-suggestions that appear as user edits draft */
export interface AutoSuggestion {
  id: string;
  type: "tone" | "completeness" | "engagement" | "consistency";
  title: string;
  message: string;
  suggestedAction: string;
  confidence: number; // 0-100
  autoApplyFix?: string;
}

/** Tracks the state of AI suggestions and generation */
export interface SuggestionState {
  suggestions: Suggestions;
  autoSuggestions: AutoSuggestion[]; // New: suggestions that appear while editing
  isLoading: boolean;
  lastAction?: SuggestionAction;
  error?: string;
  generatedAt?: number;
}

/** Types of actions that trigger suggestions */
export type SuggestionAction = 
  | "generateDraft"
  | "generateTitles"
  | "generateHashtags"
  | "adjustTone";

export const defaultSuggestionState: SuggestionState = {
  suggestions: {},
  autoSuggestions: [],
  isLoading: false,
  lastAction: undefined,
  error: undefined,
  generatedAt: undefined,
};

// ─── Draft State ──────────────────────────────────────────────────────────────
/** History entry for draft changes */
export interface DraftGeneration {
  id: string;
  content: string;
  generatedAt: number;
  source: "ai" | "user";
  action?: SuggestionAction;
}

/** Current draft editing state */
export interface DraftState {
  content: string;
  previousContent: string; // Track previous for change detection
  isModified: boolean;
  generationHistory: DraftGeneration[];
  revisions: DraftRevision[]; // Track all user edits for AI suggestions
  characterCount: number;
  lastEditTime?: number; // Track when user last edited
}

export const defaultDraftState: DraftState = {
  content: "",
  previousContent: "",
  isModified: false,
  generationHistory: [],
  revisions: [],
  characterCount: 0,
  lastEditTime: undefined,
};

// ─── UI State ─────────────────────────────────────────────────────────────────
/** Application-level UI state */
export interface UIState {
  activePanel?: "materials" | "chat" | "draft";
  isLoading: boolean;
  error?: string;
  copiedToClipboard: boolean;
}

export const defaultUIState: UIState = {
  activePanel: undefined,
  isLoading: false,
  error: undefined,
  copiedToClipboard: false,
};

// ─── Complete App State ───────────────────────────────────────────────────────
/** The complete frontend application state */
export interface AppState {
  materials: Materials;
  chat: ChatState;
  suggestions: SuggestionState;
  draft: DraftState;
  ui: UIState;
}

export const defaultAppState: AppState = {
  materials: defaultMaterials,
  chat: defaultChatState,
  suggestions: defaultSuggestionState,
  draft: defaultDraftState,
  ui: defaultUIState,
};
