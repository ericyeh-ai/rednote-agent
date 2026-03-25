# Visual Guide: Suggestions & Auto-Fixes

## 🎨 Suggestion Types & Colors

```
┌──────────────────────────────────────────────────────────────────┐
│ Suggestion Bubble Examples                                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│ ╔════════════════════════════════════════╗                       │
│ ║ 🎨 偵測到語氣變化              75%   ║ ← BLUE (Tone)          │
│ ║                                        ║                       │
│ ║ 我注意到你的語氣變得更輕鬆了。       ║                       │
│ ║ 要我調整整篇貼文保持一致嗎？         ║                       │
│ ║                                        ║                       │
│ ║ [應用]  [忽略]                        ║                       │
│ ╚════════════════════════════════════════╝                       │
│                                                                   │
│ ╔════════════════════════════════════════╗                       │
│ ║ 📝 內容太短                     85%   ║ ← AMBER (Completeness)│
│ ║                                        ║                       │
│ ║ 你的草稿只有12字。貼文至少要50字才   ║                       │
│ ║ 夠吸引人。要展開敘述嗎？             ║                       │
│ ║                                        ║                       │
│ ║ [應用]  [忽略]                        ║                       │
│ ╚════════════════════════════════════════╝                       │
│                                                                   │
│ ╔════════════════════════════════════════╗                       │
│ ║ ✨ 表情符號提示                 65%   ║ ← PURPLE (Engagement) │
│ ║                                        ║                       │
│ ║ 你移除了表情符號。在小紅書上，適當  ║                       │
│ ║ 的emoji能增加吸引力。要加回一些嗎？  ║                       │
│ ║                                        ║                       │
│ ║ [應用]  [忽略]                        ║                       │
│ ╚════════════════════════════════════════╝                       │
│                                                                   │
│ ╔════════════════════════════════════════╗                       │
│ ║ 🔄 建議加強推薦力度              70%   ║ ← GREEN (Consistency) │
│ ║                                        ║                       │
│ ║ 我發現你移除了一些強烈的推薦詞。     ║                       │
│ ║ 要加入「必吃」或「推薦」加強說服力？ ║                       │
│ ║                                        ║                       │
│ ║ [應用]  [忽略]                        ║                       │
│ ╚════════════════════════════════════════╝                       │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Suggestion Trigger Map

### Tone (🎨 Blue) - Confidence: 75%
```
TRIGGER DETECTION:
    ┌─────────────────────────────────────┐
    │ Emotional word count changed        │
    │ Previous: 0     Current: 2+         │
    │                                      │
    │ Detected: 超, 愛, 😭, 根本, 讚     │
    └─────────────────────────────────────┘

WHEN IT APPEARS:
    User adds: "超讚！我愛死了😭"
    →  Suggestion: Adjust tone to match

AUTO-FIX APPLIED:
    Before: "很讚的餐廳"
    After:  "超讚啦！整個環境超舒適..."

BUTTONS:
    [應用]  →  Rewrite whole draft with casual tone
    [忽略]  →  Keep current draft
```

### Recommendations (📝 Amber) - Confidence: 70%
```
TRIGGER DETECTION:
    ┌─────────────────────────────────────┐
    │ Removed recommendation words        │
    │ Previous had: "必吃", "推薦"        │
    │ Current: NONE                       │
    └─────────────────────────────────────┘

WHEN IT APPEARS:
    User edits: "小籠包超好吃" (removed "必吃")
    →  Suggestion: Add back strong recommendation

AUTO-FIX APPLIED:
    Before: "不錯的地方"
    After:  "不錯的地方，強烈推薦！"

BUTTONS:
    [應用]  →  Add "強烈推薦！" to end
    [忽略]  →  Keep current draft
```

### Content Too Short (📄 Amber) - Confidence: 85%
```
TRIGGER DETECTION:
    ┌─────────────────────────────────────┐
    │ Draft length: 0 < chars < 50        │
    │ Example: "超讚"  (2 characters)     │
    └─────────────────────────────────────┘

WHEN IT APPEARS:
    Always when draft is very short
    Highest confidence (85%)

AUTO-FIX APPLIED:
    Before: "超讚"
    After:  "超讚
             環境非常舒適，服務態度也很親切。
             整體體驗非常值得，強烈推薦給大家！"

BUTTONS:
    [應用]  →  Append detailed description
    [忽略]  →  Keep short version
```

### Emoji Removed (✨ Purple) - Confidence: 65%
```
TRIGGER DETECTION:
    ┌─────────────────────────────────────┐
    │ Previous emojis: 3+                 │
    │ Current emojis:  0                  │
    │ User removed: 😭 👍 🙌             │
    └─────────────────────────────────────┘

WHEN IT APPEARS:
    User deletes emojis from draft

AUTO-FIX APPLIED:
    Before: "超讚 根本停不下來 完全推薦"
    After:  "超讚 🍽️ 根本停不下來 😭
             完全推薦 🙌"

BUTTONS:
    [應用]  →  Re-distribute emojis
    [忽略]  →  Keep current version
```

### Content Expanded (✨ Purple) - Confidence: 60%
```
TRIGGER DETECTION:
    ┌─────────────────────────────────────┐
    │ Added 50+ characters                │
    │ Total draft > 200 chars             │
    │ Change: +85 chars                   │
    └─────────────────────────────────────┘

WHEN IT APPEARS:
    User makes significant additions

AUTO-FIX APPLIED:
    Before: "去了鼎泰豐吃小籠包"
    After:  [No change - just asking to review]

BUTTONS:
    [應用]  →  Show confirmation message only
    [忽略]  →  Continue editing
```

### Empty Draft (⏳ Blue) - Confidence: 100%
```
TRIGGER DETECTION:
    ┌─────────────────────────────────────┐
    │ draft.trim() === ""                 │
    │ No content at all                   │
    └─────────────────────────────────────┘

WHEN IT APPEARS:
    Always when draft is empty
    100% confidence (contextual nudge)

AUTO-FIX APPLIED:
    [No fix - just encouragement]

BUTTONS:
    [應用]  →  Same as ignoring (just prompt)
    [忽略]  →  Continue
```

---

## 📊 Confidence Score Legend

```
┌─────────────────────────────────────┐
│ CONFIDENCE SCORE MEANINGS            │
├─────────────────────────────────────┤
│                                     │
│ 100% ████████████████████           │
│      "I'm absolutely sure"          │
│      • Empty draft (contextual)     │
│                                     │
│ 85%  ████████████████               │
│      "Very strong signal"           │
│      • Too short content            │
│                                     │
│ 75%  ███████████████                │
│      "Clear pattern detected"       │
│      • Tone shift                   │
│                                     │
│ 70%  ██████████████                 │
│      "Likely helpful"               │
│      • Missing recommendations      │
│                                     │
│ 65%  █████████████                  │
│      "Nice to have"                 │
│      • Emoji change                 │
│                                     │
│ 60%  ████████████                   │
│      "Light suggestion"             │
│      • Content expanded             │
│                                     │
└─────────────────────────────────────┘

Higher % = More prominent display
Sorted by confidence (highest first)
```

---

## 🔄 Before & After Examples

### Example 1: Casual Tone
```
┌─────────────────────────────────┬─────────────────────────────────┐
│ BEFORE (clicked "應用")         │ AFTER (auto-fixed)              │
├─────────────────────────────────┼─────────────────────────────────┤
│ 去了鼎泰豐，環境很舒適，       │ 去了鼎泰豐，超舒適啦，          │
│ 服務不錯                        │ 服務超好，整個超滿意             │
│                                 │ 小籠包根本停不下來，一定要再來！ │
└─────────────────────────────────┴─────────────────────────────────┘
```

### Example 2: Strong Recommendations
```
┌─────────────────────────────────┬─────────────────────────────────┐
│ BEFORE (clicked "應用")         │ AFTER (auto-fixed)              │
├─────────────────────────────────┼─────────────────────────────────┤
│ 小籠包很好吃                    │ 小籠包很好吃，強烈推薦！        │
└─────────────────────────────────┴─────────────────────────────────┘
```

### Example 3: Add Emojis
```
┌─────────────────────────────────┬─────────────────────────────────┐
│ BEFORE (clicked "應用")         │ AFTER (auto-fixed)              │
├─────────────────────────────────┼─────────────────────────────────┤
│ 超讚                            │ 超讚 🍽️ 環境舒適 😭             │
│ 環境舒適                        │ 強烈推薦 🙌                     │
│ 強烈推薦                        │                                 │
└─────────────────────────────────┴─────────────────────────────────┘
```

### Example 4: Expand Short Content
```
┌─────────────────────────────────┬─────────────────────────────────┐
│ BEFORE (clicked "應用")         │ AFTER (auto-fixed)              │
├─────────────────────────────────┼─────────────────────────────────┤
│ 讚                              │ 讚                              │
│                                 │ 環境非常舒適，服務態度也很親切。│
│                                 │ 整體體驗非常值得，強烈推薦給   │
│                                 │ 大家！                          │
└─────────────────────────────────┴─────────────────────────────────┘
```

---

## 🧪 Test Scenarios

### Scenario A: Tone Detection Flow
```
Step 1: Click "生成草稿"         
     → Draft appears: "去了X，驚艷到了..."

Step 2: Edit to add casual tone
     Typing: "超讚！我愛死了😭根本停不下來"

Step 3: Wait 800ms
     → Chat shows: Blue "偵測到語氣變化" bubble (75%)

Step 4: Click "應用"
     → Draft becomes: "超讚！我愛死了😭根本停不下來..."
     → Chat shows: "✅ 已為你應用「adjustTone」建議。"

Step 5: (Satisfied!)
     → Click "複製" to copy final result
```

### Scenario B: Multiple Suggestions
```
Step 1: Start with good draft

Step 2: Delete most of it, leaving "很讚"

Step 3: Wait 800ms
     → Chat shows: 
        • 🎨 (Tone shift?) No, similar
        • 📝 (Too short?) YES - 4 chars < 50 (85%)
        • ✨ (Emoji removed?) Check...
        
Step 4: Max 2 suggestions shown, sorted by confidence
     1st: 📝 "內容太短" (85%)
     2nd: ✨ "表情符號提示" (65%)

Step 5: Apply first
     → Draft expands: "很讚\n環境非常舒適..."

Step 6: Second suggestion still visible
     → Apply that too
     → Emojis added: "很讚 🍽️ 環境..."
```

---

## 🎯 Quick Reference Table

| Type | Icon | Color | Confidence | When | Auto-Fix |
|------|------|-------|-----------|------|----------|
| Tone | 🎨 | Blue | 75% | Tone keywords change | Rewrite draft |
| Recommendation | 📝 | Amber | 70% | Remove "必吃"/"推薦" | Add recommendation |
| Too Short | 📄 | Amber | 85% | <50 chars | Expand content |
| Emoji | ✨ | Purple | 65% | Removed emojis | Re-add emojis |
| Expansion | 📈 | Purple | 60% | +50 chars | Confirm change |
| Empty | ⏳ | Blue | 100% | No content | (contextual) |

---

## 💡 Design Notes

- **Max 2 suggestions** prevents overwhelming user
- **Sorted by confidence** shows most important first
- **Color coded** helps users understand suggestion type
- **Debounced** prevents spam while user is typing
- **Auto-fixes** show immediate before/after results
- **Apply/Ignore buttons** give user full control

---

## 🚀 Extension Ideas

### Easy Additions
```
• Add "句子太長" (sentence > 30 chars)
• Add "沒有標籤" (no hashtags)
• Add "沒有地點" (no location tag)
```

### Medium Additions
```
• Analyze sentiment (positive/negative/neutral)
• Detect repetitive words
• Check grammar (when backend available)
```

### Hard Additions
```
• ML-based style matching
• User preference learning
• Multi-language support
```

---

## 📞 Troubleshooting

**Q: Suggestions not appearing?**
A: Wait 800ms after typing stops (debounce delay)

**Q: Only 1 suggestion shown instead of 2?**
A: Only 1 rule was triggered. Keep editing changes to see more.

**Q: Auto-fix changed something I didn't want?**
A: Manually undo with Ctrl+Z or click "忽略" next time

**Q: How to change colors/styling?**
A: Find color classes in `SuggestionBubble.tsx`:
```typescript
typeColors: Record<string, string> = {
  tone: "border-blue-200 bg-blue-50",        // ← Change this
  completeness: "border-amber-200 bg-amber-50",
  // ...
}
```

---

This visual guide covers all suggestion types and how they work!
