# Frontend State Design - Quick Reference

A clean, extensible state model for the Xiaohongshu Writing Copilot app (frontend only, no backend).

## 📊 State Structure

```
AppState
├── materials: Materials
│   └── { restaurant, location, dishes, notes }
├── chat: ChatState
│   └── { messages: Message[], messageIdCounter }
├── suggestions: SuggestionState
│   ├── suggestions: Suggestions
│   │   └── { titles?, hashtags?, draftContent?, toneVariation? }
│   ├── isLoading: boolean
│   ├── lastAction?: SuggestionAction
│   ├── error?: string
│   └── generatedAt?: number
├── draft: DraftState
│   ├── content: string
│   ├── isModified: boolean
│   ├── generationHistory: DraftGeneration[]
│   └── characterCount: number
└── ui: UIState
    ├── activePanel?: "materials" | "chat" | "draft"
    ├── isLoading: boolean
    ├── error?: string
    └── copiedToClipboard: boolean
```

## 🎮 User Actions by Domain

| Domain | Actions |
|--------|---------|
| **Materials** | `updateMaterial()`, `clearMaterials()`, `loadMaterials()` |
| **Chat** | `sendMessage()`, `addAiMessage()`, `clearMessages()`, `deleteMessage()` |
| **Suggestions** | `requestGenerateDraft()`, `requestGenerateTitles()`, `requestGenerateHashtags()`, `requestAdjustTone()`, `applySuggestion()` |
| **Draft** | `updateDraft()`, `replaceDraft()`, `appendDraft()`, `clearDraft()`, `undoDraft()`, `copyDraftToClipboard()` |
| **UI** | `setActivePanel()`, `setLoading()`, `setError()`, `clearError()`, `showCopySuccess()` |

## 📝 AI Suggestion Flow

```
User Input
    ↓
[setSuggestionLoading(true)]  ← Show spinner
    ↓
[Frontend generates suggestions]  ← Call mock AI
    ↓
[updateSuggestions({...})]  ← Update state with results
    ↓
[setSuggestionLoading(false)]  ← Hide spinner
    ↓
Display in Chat Panel  ← Show options to user
    ↓
User clicks "Apply"
    ↓
[replaceDraft(content)]  ← Update draft + history
```

## 💾 Draft History Tracking

Each AI generation or user edit creates a record:

```typescript
DraftGeneration {
  id: "draft_1"              // Unique identifier
  content: "..."             // Snapshot of content
  generatedAt: 1234567890    // Timestamp
  source: "ai" | "user"      // Who created it
  action?: SuggestionAction  // What triggered it (if AI)
}
```

## 🔄 Data Flow Example

### Scenario: User generates title suggestions

```typescript
// 1. User clicks "想標題" button
actions.sendMessage("想標題")  // Add to chat

// 2. Set loading state
actions.setSuggestionLoading(true)

// 3. Frontend mock generates suggestions (100ms delay)
setTimeout(() => {
  actions.updateSuggestions({
    titles: [
      "鼎泰豐讓我吃一次就上癮",
      "在信義區發現的寶藏小店",
      "不誇張！今年最驚艷的一餐"
    ]
  }, "generateTitles")
  
  actions.setSuggestionLoading(false)
}, 100)

// 4. User sees suggestions in chat panel
// 5. User clicks on a title
// 6. Apply to draft (optional)
actions.replaceDraft(`「鼎泰豐讓我吃一次就上癮...」`, "generateTitles")
```

## 📁 File Structure

```
app/
├── types/
│   ├── index.ts           ← Central exports
│   ├── state.ts           ← State type definitions
│   └── actions.ts         ← Action type definitions
├── hooks/
│   └── useAppState.ts     ← React hook implementation (example)
├── components/            ← UI components (already refactored)
└── utils/
    └── ai.ts              ← Mock AI functions
```

## 🚀 Implementation Pattern

### Option 1: React Hooks (Simple)
```typescript
const { state, actions, computed } = useAppState();
```

### Option 2: Zustand (Recommended)
```typescript
const store = create<AppState>((set) => ({
  materials: defaultMaterials,
  updateMaterial: (field, value) => 
    set(state => ({
      materials: { ...state.materials, [field]: value }
    }))
}))
```

### Option 3: Redux/Redux Toolkit
```typescript
type StateAction = 
  | { type: "UPDATE_MATERIAL"; ... }
  | { type: "SEND_MESSAGE"; ... }
  // ...
```

### Option 4: Jotai (Atoms)
```typescript
const materialsAtom = atom(defaultMaterials)
const draftAtom = atom(defaultDraftState)
```

## ✅ Type Safety

All state and actions are **fully typed**:
- ✅ Catch state shape errors at compile time
- ✅ Autocomplete for all actions
- ✅ Type-safe reducers
- ✅ Computed property type validation

## 🎯 Computed Properties

Quick-access read-only properties:
```typescript
computed.getDraftLength()           // → number
computed.isDraftEmpty()             // → boolean
computed.isMaterialsComplete()      // → boolean
computed.getLastUserMessage()       // → Message | undefined
computed.getLastAiMessage()         // → Message | undefined
computed.hasSuggestions()           // → boolean
computed.getCurrentSuggestionAction() // → SuggestionAction | undefined
computed.isAnyOperationInProgress() // → boolean
```

## 📋 Design Principles

1. **Frontend-First**: No backend assumptions
2. **Simple**: Easy to understand and extend
3. **Type-Safe**: Full TypeScript support
4. **Testable**: Clear state structure
5. **Scalable**: Easy to add new features
6. **Unidirectional**: Actions → State → UI

## 🔮 Future Extensibility

To add new features:

1. Add types to `state.ts`
   ```typescript
   interface NewFeature {
     // ...
   }
   ```

2. Add actions to `actions.ts`
   ```typescript
   interface NewFeatureActions {
     doSomething(): void;
   }
   ```

3. Extend `AppState` and `StateActions`

4. Implement in your state management solution

## 📚 Related Files

- **`FRONTEND_STATE_DESIGN.md`** - Detailed design documentation
- **`app/types/state.ts`** - State type definitions
- **`app/types/actions.ts`** - Action type definitions
- **`app/hooks/useAppState.ts`** - React hook example implementation

## 💡 Next Steps

1. Choose state management (hooks/Zustand/Redux/Jotai)
2. Implement state management with these types
3. Wire components to state
4. Test all user flows
5. Add real backend integration later (just replace mock AI)
