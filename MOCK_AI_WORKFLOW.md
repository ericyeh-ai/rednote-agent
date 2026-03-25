# Mock AI Suggestion Workflow - Implementation Guide

## Overview

This document describes the **auto-suggestion workflow** implemented in the Xiaohongshu Writing Copilot. The system simulates an intelligent AI assistant that provides contextual suggestions as users edit their draft in real-time.

**Key Feature**: Users can experience the full workflow without any backend API or real AI integration.

---

## 🎯 User Experience Flow

### Scenario: User edits draft

```
1. User types in draft panel
                ↓
2. Draft changes detected (debounced 800ms)
                ↓
3. Mock AI analyzes changes
                ↓
4. Suggestions appear in chat panel
                ↓
5. User clicks "應用" (Apply) or "忽略" (Ignore)
                ↓
6. If applied:
   - Auto-fix applied to draft
   - Chat shows confirmation
   - Suggestions cleared
```

### Example: Tone Detection

```
User types: "週末跑去試了鼎泰豐，整個人被療癒到😭"
            ↓
[Draft becomes more casual with emojis]
            ↓
Suggestion appears:
"偵測到語氣變化"
"我注意到你的語氣變得更輕鬆了。要我調整整篇貼文保持一致嗎？"
            ↓
User clicks "應用"
            ↓
Entire draft rewrites with casual tone
Chat shows: "✅ 已為你應用「adjustTone」建議。草稿已更新！"
```

---

## 🛠 Implementation Components

### 1. Mock AI Suggestion Engine (`app/utils/mockAiSuggestions.ts`)

**Purpose**: Rule-based system that analyzes draft changes and generates suggestions.

**Key Functions**:

```typescript
// Main function: Generate suggestions based on draft changes
getMockAISuggestions(previousDraft: string, currentDraft: string): MockAISuggestion[]

// Auto-fix implementations: Apply suggestion to draft
applyMockAutoFix(draft: string, action: string): string

// Contextual suggestions: Show when draft hasn't changed much
getContextualSuggestion(draft: string): MockAISuggestion | null
```

**Suggestion Rules**:

| Rule | Trigger | Suggestion | Confidence |
|------|---------|-----------|-----------|
| **Tone Shift** | Emotional words added/removed | "調整語氣保持一致" | 75% |
| **Missing Recommendations** | Removed "必吃", "推薦", etc. | "加強推薦力度" | 70% |
| **Content Expanded** | Added 50+ characters | "內容變更提示" | 60% |
| **Emoji Removed** | Lost emojis | "加回表情符號" | 65% |
| **Content Too Short** | Less than 50 characters | "內容太短，展開敘述" | 85% |
| **Empty Draft** | No content | "準備好開始寫貼文了嗎？" | 100% |

### 2. State Types (`app/types/state.ts`)

```typescript
interface AutoSuggestion {
  id: string
  type: "tone" | "completeness" | "engagement" | "consistency"
  title: string                    // 偵測到語氣變化
  message: string                  // Detailed explanation
  suggestedAction: string          // adjustTone, strengthenRecommendation, etc.
  confidence: number               // 0-100
  autoApplyFix?: string           // Optional text to apply
}

interface DraftState {
  content: string
  previousContent: string          // NEW: Track for change detection
  isModified: boolean
  generationHistory: DraftGeneration[]
  characterCount: number
  lastEditTime?: number            // NEW: Track when user last edited
}

interface SuggestionState {
  suggestions: Suggestions
  autoSuggestions: AutoSuggestion[] // NEW: Real-time suggestions
  isLoading: boolean
  lastAction?: SuggestionAction
  error?: string
  generatedAt?: number
}
```

### 3. UI Components

#### SuggestionBubble (`app/components/shared/SuggestionBubble.tsx`)

Displays auto-suggestions with:
- Color-coded by type (tone, completeness, engagement, consistency)
- Emoji indicator
- Title and message
- Confidence score
- Apply/Ignore buttons

```typescript
<SuggestionBubble
  suggestion={suggestion}
  onApply={handleApplySuggestion}    // Apply auto-fix
  onIgnore={handleIgnoreSuggestion}  // Dismiss suggestion
/>
```

#### ChatPanel Updates

Added auto-suggestions display:
```typescript
{autoSuggestions.map((suggestion) => (
  <SuggestionBubble
    key={suggestion.id}
    suggestion={suggestion}
    onApply={onApplySuggestion}
    onIgnore={onIgnoreSuggestion}
  />
))}
```

### 4. Page Logic (`app/page.tsx`)

```typescript
// 1. Track draft changes with debounce
const handleDraftChange = useCallback((newDraft: string) => {
  setDraft(newDraft);
  
  // Debounce 800ms before generating suggestions
  if (suggestionTimeoutRef.current) {
    clearTimeout(suggestionTimeoutRef.current);
  }

  suggestionTimeoutRef.current = setTimeout(() => {
    const suggestions = getMockAISuggestions(previousDraft, newDraft);
    setAutoSuggestions(suggestions);
    setPreviousDraft(newDraft);
  }, 800);
}, [previousDraft]);

// 2. Apply suggestion with auto-fix
const handleApplySuggestion = useCallback((action: string) => {
  const updatedDraft = applyMockAutoFix(draft, action);
  setDraft(updatedDraft);
  setPreviousDraft(updatedDraft);
  setAutoSuggestions([]);
  
  // Show confirmation in chat
  const confirmMsg: Message = {
    id: getNextId(),
    role: "ai",
    text: `✅ 已為你應用「${action}」建議。草稿已更新！`,
    timestamp: Date.now(),
  };
  setMessages((prev) => [...prev, confirmMsg]);
}, [draft]);

// 3. Ignore suggestion
const handleIgnoreSuggestion = useCallback((id: string) => {
  setAutoSuggestions((prev) => prev.filter((s) => s.id !== id));
}, []);
```

---

## 📊 Suggestion Types Explained

### 1. Tone (語氣) 🎨
**When**: User adds/removes emotional words
**Examples**: "讚", "超", "根本", "完全", "驚艷"
**Action**: `adjustTone` - rewrite with consistent tone
**Color**: Blue

### 2. Completeness (完整度) 📝
**When**: Draft too short, missing recommendations
**Examples**: Draft < 50 chars, removed "必吃"/"推薦"
**Action**: `expandContent`, `strengthenRecommendation`
**Color**: Amber

### 3. Engagement (吸引度) ✨
**When**: Missing emojis, needs more personality
**Examples**: Removed emojis, draft length increased
**Action**: `addEmoji`, `reviewContent`
**Color**: Purple

### 4. Consistency (一致性) 🔄
**When**: Style or tone shifts detected
**Examples**: Mixed formal/casual language
**Action**: `alignTone`, `normalizeFormal`
**Color**: Green

---

## 🎮 Auto-Fix Implementations

### adjustTone
Applies casual language transformations:
```typescript
"推薦" → "強烈推薦"
"建議" → "真的要"
"值得" → "一定要"
```

### strengthenRecommendation
Adds recommendation words if missing:
```typescript
"最後一句" → "最後一句，強烈推薦！"
```

### addEmoji
Distributes emojis throughout:
```typescript
"句子A。句子B。" 
→ "句子A。🍽️句子B。😭"
```

### expandContent
Appends suggested details:
```typescript
draft + "\n\n環境非常舒適，服務態度也很親切。..."
```

---

## ⚙️ Technical Details

### Debouncing
- Waits 800ms after user stops typing
- Prevents excessive suggestion generation
- Smooth user experience

### Previous Draft Tracking
- Compares `previousDraft` with `currentDraft`
- Detects what changed
- Only generates suggestions if changes detected

### Suggestion Limiting
- Max 2 suggestions at a time
- Prevents overwhelming user
- Sorts by confidence

### Cleanup
- Auto-suggestions cleared when user sends chat message
- Cleared when suggestion applied/ignored
- Prevents stale suggestions

---

## 🔄 Data Flow Diagram

```
DraftPanel (User edits)
    ↓
handleDraftChange()
    ↓
debounce 800ms
    ↓
getMockAISuggestions()
    ├─ analyzeDraft()
    └─ generateSuggestions()
        ├─ Rule: Tone Shift
        ├─ Rule: Recommendation Missing
        ├─ Rule: Content Length
        ├─ Rule: Emoji Change
        └─ Rule: Short Draft
    ↓
setAutoSuggestions()
    ↓
ChatPanel displays SuggestionBubble
    ↓
User clicks "應用"
    ↓
handleApplySuggestion()
    ↓
applyMockAutoFix()
    ↓
setDraft() + confirmation message
```

---

## 🧪 Testing the Feature

### Test 1: Tone Detection
1. Open app
2. Click "生成草稿" to generate initial draft
3. Edit draft to add casual language and emojis
4. Wait 1 second
5. Suggestion appears: "偵測到語氣變化"
6. Click "應用" → whole draft becomes casual
7. ✅ Verify confirmation message in chat

### Test 2: Recommendation Missing
1. Generate a draft with "必吃" or "推薦"
2. Delete those words
3. Wait 1 second
4. Suggestion appears: "建議加強推薦力度"
5. Click "應用" → adds "強烈推薦！" to end
6. ✅ Verify it was added

### Test 3: Ignore Suggestion
1. Generate suggestion as above
2. Click "忽略" button
3. ✅ Suggestion disappears without changing draft

### Test 4: Multiple Suggestions
1. Delete everything from draft
2. Wait 1 second
3. Multiple suggestions may appear at once
4. Apply/ignore one
5. Others remain
6. ✅ Verify selective applying

---

## 🚀 Future Enhancements

### Phase 1: Extended Rules (Easy)
Add more suggestion rules:
- Language consistency checking
- Long sentence detection
- Hashtag suggestions
- Character count optimization

### Phase 2: Machine Learning (Medium)
Replace rules with ML model:
- Train on restaurant review data
- Learn patterns from human writing
- Personalize to user style

### Phase 3: Real AI API (Hard)
Integrate with real AI:
- Include draft + materials context
- Stream real-time suggestions
- Cache suggestions for performance
- Handle API errors gracefully

### Configuration for Later
```typescript
// Easy to swap when backend ready:
const suggestions = process.env.USE_REAL_AI
  ? await getAISuggestions(draft, materials)  // Real API
  : getMockAISuggestions(previousDraft, draft)  // Mock
```

---

## 📝 Code Structure

```
app/
├── utils/
│   ├── mockAiSuggestions.ts       ← Core suggestion logic
│   └── ai.ts                      ← Existing mock chat
├── types/
│   ├── state.ts                   ← Updated with AutoSuggestion
│   └── index.ts                   ← Exports
├── components/
│   ├── DraftPanel.tsx             ← Triggers suggestions
│   ├── ChatPanel.tsx              ← Displays suggestions
│   └── shared/
│       └── SuggestionBubble.tsx   ← Suggestion UI
└── page.tsx                       ← Orchestrates workflow
```

---

## ✅ Testing Checklist

- [ ] Draft changes trigger suggestions
- [ ] Debounce prevents spam
- [ ] Apply/Ignore buttons work
- [ ] Auto-fix modifies draft correctly
- [ ] Confirmation message appears
- [ ] Multiple suggestions handled
- [ ] Empty draft shows contextual suggestion
- [ ] Suggestions clear on chat send
- [ ] UI renders properly with colored bullets
- [ ] Emoji icons display correctly

---

## 🎓 Key Learnings

1. **Debouncing** is crucial for good UX
2. **Rule-based systems** are easier to debug than ML
3. **Confidence scores** help users understand suggestions
4. **Clear state tracking** (previous vs current) enables smart detection
5. **Auto-fixes** should be reversible (undo history)
6. **Limiting suggestions** prevents cognitive overload

---

## 🔗 Related Documentation

- **`FRONTEND_STATE_DESIGN.md`** - Overall state architecture
- **`STATE_QUICK_REFERENCE.md`** - Quick lookup guide
- **`mockAiSuggestions.ts`** - Inline code comments

---

## 📞 Questions?

This system is fully self-contained and can run without any backend. When you're ready to add real AI:

1. Create `app/utils/realAiSuggestions.ts`
2. Implement async API calls to your AI service
3. Replace `getMockAISuggestions()` call in `page.tsx`
4. Rest of the UI and state management stays the same

The architecture is designed for easy swapping of the suggestion engine!
