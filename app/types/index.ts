/**
 * Central type exports for the Xiaohongshu Writing Copilot frontend
 */

// State types
export type {
  AppState,
  Materials,
  ChatState,
  Message,
  DraftState,
  DraftGeneration,
  SuggestionState,
  Suggestions,
  AutoSuggestion,
  SuggestionAction,
  UIState,
} from "./state";

export {
  defaultAppState,
  defaultMaterials,
  defaultChatState,
  defaultDraftState,
  defaultSuggestionState,
  defaultUIState,
} from "./state";

// Action types
export type {
  StateActions,
  StateAction,
  StateReducer,
  MaterialActions,
  ChatActions,
  SuggestionActions,
  DraftActions,
  UIActions,
  StateComputed,
} from "./actions";