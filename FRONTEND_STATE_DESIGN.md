# Frontend Product State Design

## Overview

This document outlines the frontend state model for the Xiaohongshu Writing Copilot app. It defines:
1. Data structures (what information the app tracks)
2. State organization (how data is grouped)
3. User actions (what operations modify state)
4. Computed properties (derived values from state)

**Key Principle**: This is frontend product logic only—no backend integration or API calls yet.

---

## 1. Main App States

### Materials Panel State
```typescript
Materials {
  restaurant: string     // 餐廳名稱
  location: string       // 地點
  dishes: string        // 推薦菜色 (comma-separated)
  notes: string         // 原始筆記/備註
}
```
**Purpose**: Store user-provided restaurant context and notes
**Updates**: When user types in the left panel
**Usage**: Provides context to AI suggestions

### Chat State
```typescript
ChatState {
  messages: Message[]    // Conversation history
  messageIdCounter: number
}

Message {
  id: number
  role: "user" | "ai"
  text: string
  timestamp: number
}
```
**Purpose**: Track conversation between user and AI
**Updates**: When user sends message or AI responds
**Usage**: Display chat history, generate context for next AI response

### Suggestion State
```typescript
SuggestionState {
  suggestions: Suggestions
  isLoading: boolean
  lastAction?: SuggestionAction  // "generateDraft" | "generateTitles" | ...
  error?: string
  generatedAt?: number
}

Suggestions {
  titles?: string[]       // Title suggestions
  hashtags?: string[]     // Hashtag suggestions
  draftContent?: string   // Full draft text
  toneVariation?: string  // Alternative tone version
}
```
**Purpose**: Track AI-generated suggestions
**Updates**: When user clicks suggestion buttons or interacts
**Usage**: Show suggestions in chat panel, apply to draft

### Draft State
```typescript
DraftState {
  content: string
  isModified: boolean
  generationHistory: DraftGeneration[]
  characterCount: number
}

DraftGeneration {
  id: string
  content: string
  generatedAt: number
  source: "ai" | "user"    // Where this version came from
  action?: SuggestionAction  // What generated it
}
```
**Purpose**: Track editable draft content and its history
**Updates**: When user edits, applies suggestions, or AI generates
**Usage**: Display and edit draft in right panel

### UI State
```typescript
UIState {
  activePanel?: "materials" | "chat" | "draft"
  isLoading: boolean
  error?: string
  copiedToClipboard: boolean
}
```
**Purpose**: Track application-level UI state
**Updates**: User interactions, loading states
**Usage**: Control panel visibility, show loading indicators, display errors

---

## 2. User Actions

### Materials Actions
- `updateMaterial(field, value)` - Update restaurant/location/dishes/notes
- `clearMaterials()` - Reset all materials
- `loadMaterials(partial)` - Batch load materials

### Chat Actions
- `sendMessage(text)` - User sends a message
- `addAiMessage(text)` - Add AI response (mock for now)
- `sendQuickSuggestion(text)` - Click quick action button
- `clearMessages()` - Clear conversation
- `deleteMessage(id)` - Remove a specific message

### Suggestion Actions
- `requestGenerateDraft()` - User clicks "生成草稿"
- `requestGenerateTitles()` - User clicks "想標題"
- `requestGenerateHashtags()` - User clicks "推薦標籤"
- `requestAdjustTone(tone)` - User requests tone adjustment
- `updateSuggestions(data)` - Frontend mock updates suggestions
- `setSuggestionLoading(bool)` - Toggle loading state
- `setSuggestionError(error)` - Set error message
- `clearSuggestions()` - Clear current suggestions
- `applySuggestion(type, value)` - Apply suggestion to draft

### Draft Actions
- `updateDraft(content)` - Edit draft text
- `replaceDraft(content, action)` - Replace entire content + history
- `appendDraft(content)` - Add to end of draft
- `clearDraft()` - Clear draft
- `copyDraftToClipboard()` - Copy to system clipboard
- `undoDraft()` - Revert to previous version
- `hasPendingChanges()` - Check for unsaved changes

### UI Actions
- `setActivePanel(panel)` - Switch visible panel
- `setLoading(bool)` - Global loading state
- `setError(msg)` - Show error
- `clearError()` - Dismiss error
- `showCopySuccess()` - Show "copied" confirmation
- `dismissCopySuccess()` - Hide confirmation

---

## 3. AI Suggestion States

### Suggestion Lifecycle
```
User clicks "生成草稿"
    ↓
setSuggestionLoading(true)
    ↓
[Frontend mock generates suggestions]
    ↓
updateSuggestions({draftContent: "..."})
    ↓
setSuggestionLoading(false)
    ↓
Display in chat + draft panel
```

### Suggestion Types
| Action | Input | Output | Location |
|--------|-------|--------|----------|
| Generate Draft | materials, notes | Full post text | Draft panel |
| Generate Titles | materials | 3-5 title options | Suggestions in chat |
| Generate Hashtags | materials | Relevant hashtags | Suggestions in chat |
| Adjust Tone | draft, tone | Rewritten draft | Draft panel |

### Error Handling
```typescript
SuggestionState {
  isLoading: boolean      // Show spinner
  error?: string          // Show error message
  lastAction?: string     // Know what failed
  suggestions: Suggestions // Keep previous suggestions
}
```

---

## 4. Draft Editing States

### Modification Tracking
```typescript
DraftState {
  content: string         // Current text
  isModified: boolean     // Has user changed it?
  generationHistory: [],  // Track all versions
  characterCount: number  // Real-time count
}

DraftGeneration {
  id: string              // Unique version ID
  content: string         // Content at that version
  generatedAt: number     // When created
  source: "ai" | "user"   // Who created it
  action?: SuggestionAction // What triggered it
}
```

### Draft History
- Each AI generation creates a new history entry
- User edits update current content and mark `isModified = true`
- History allows undo/version comparison
- Character count updates in real-time

### Draft States Example
```
Initial:     content: "", isModified: false
After AI:    content: "去了...", isModified: false, history: [v1]
User edits:  content: "去了...修改", isModified: true, history: [v1]
Apply tone:  content: "週末跑去...", isModified: false, history: [v1, v2]
```

---

## 5. TypeScript Type Design

### File Organization
```
app/types/
├── index.ts          // Re-exports
├── state.ts          // State definitions (what we have)
└── actions.ts        // Action definitions (what we have)

app/utils/
├── state.ts          // Mock state management (future)
└── hooks.ts          // Custom hooks (future)
```

### Type Hierarchy
```
AppState (root)
  ├── Materials
  ├── ChatState
  │   └── Message[]
  ├── SuggestionState
  │   └── Suggestions
  ├── DraftState
  │   └── DraftGeneration[]
  └── UIState
```

### Action Union Type
```typescript
type StateAction = 
  | UpdateMaterialAction
  | SendMessageAction
  | UpdateDraftAction
  | SetSuggestionsAction
  // ... more
```

---

## 6. Implementation Roadmap

### Phase 1: Frontend State (Current)
- ✅ Define types
- ⬜ Implement with React hooks or state management
- ⬜ Mock AI responses
- ⬜ Wire up UI components

### Phase 2: Mock AI Integration
- ⬜ Implement mock AI functions
- ⬜ Simulate loading states
- ⬜ Test suggestion flows

### Phase 3: Backend Integration (Future)
- ⬜ Replace mocks with API calls
- ⬜ Add real AI endpoints
- ⬜ Handle real error cases

---

## 7. Design Principles

1. **Frontend-First**: All logic is frontend; no backend assumptions
2. **Testable**: Clear action definitions make testing easy
3. **Extensible**: New action types don't break existing code
4. **Simple**: Don't over-engineer before backend exists
5. **Traceable**: Actions and state have clear ownership
6. **Type-Safe**: Full TypeScript for catching errors early

---

## 8. Example State Flow

### Scenario: User generates draft
```javascript
// Initial state
state = {
  materials: { restaurant: "鼎泰豐", ... },
  chat: { messages: [] },
  suggestions: { suggestions: {}, isLoading: false },
  draft: { content: "", isModified: false, ... },
  ui: { ...}
}

// User clicks "生成草稿"
dispatch({ type: "SET_SUGGESTION_LOADING", isLoading: true })
// → suggestions.isLoading = true (show spinner)

// Frontend mock generates draft
setTimeout(() => {
  dispatch({
    type: "SET_SUGGESTIONS",
    suggestions: { draftContent: "去了鼎泰豐..." },
    action: "generateDraft"
  })
  // → suggestions.suggestions.draftContent = "去了鼎泰豐..."
  // → suggestions.lastAction = "generateDraft"
  
  dispatch({ type: "SET_SUGGESTION_LOADING", isLoading: false })
  // → suggestions.isLoading = false (hide spinner)
}, 500)

// User sees draft content and can apply it
dispatch({
  type: "REPLACE_DRAFT",
  content: "去了鼎泰豐...",
  action: "generateDraft"
})
// → draft.content = "去了鼎泰豐..."
// → draft.isModified = false
// → draft.generationHistory.push({...})
```

---

## Next Steps

1. **Implement State Management**: Choose React hooks, Zustand, Redux, or Jotai
2. **Create Mock AI**: Implement `mockAiReply()` function
3. **Wire Components**: Connect UI to state actions
4. **Test Flows**: Verify all user interactions work
5. **Plan Backend**: Define API contract when ready
