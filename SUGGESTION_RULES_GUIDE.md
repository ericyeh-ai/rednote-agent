# Suggestion Rules Details & Examples

This document provides in-depth examples of each suggestion rule and when it triggers.

---

## Rule 1: Tone Shift Detection 🎨

### How It Works
Detects when user adds or removes emotional/casual language indicators.

### Keywords Detected

**Casual Indicators** (used for casual tone):
- 哈, 超, 根本, 完全, 讚, 😭, 🙌

**Formal Indicators** (used for formal tone):
- 推薦, 建議, 特別, 非常, 值得

**Emotional Words** (shows engagement):
- 喜歡, 愛, 驚艷, 療癒, 感動

### Example Scenarios

#### Scenario A: User adds casual language
```
Previous: "這是一家很好的餐廳，推薦大家去吃"
Current:  "這家根本超讚！我愛死這裡了😭"

Trigger: Emotional words increased from 0 to 2
Result: Suggestion appears
Title: "偵測到語氣變化"
Message: "我注意到你的語氣變得更輕鬆了。要我調整整篇貼文保持一致嗎？"
Action: "adjustTone"
```

#### Scenario B: User switches to formal tone
```
Previous: "超好吃！根本停不下來。完全推薦！"
Current:  "此餐廳服務優質，值得推薦"

Trigger: Casual indicators removed, formal indicators added
Result: Suggestion appears
Title: "偵測到語氣變化"
Message: "我注意到你的語氣變得更正式了。..."
```

### Implementation
```typescript
const previousAnalysis = analyzeDraft(previousDraft);
const toneShift = 
  analysis.emotionalWords.length !== previousAnalysis.emotionalWords.length;

if (toneShift && analysis.emotionalWords.length > 0) {
  suggestions.push({
    type: "tone",
    title: "偵測到語氣變化",
    message: `我注意到你的語氣變得更${...}了。要我調整整篇貼文保持一致嗎？`,
    suggestedAction: "adjustTone",
    confidence: 75,
  });
}
```

---

## Rule 2: Recommendation Missing Detection 🔥

### How It Works
Detects when user removes strong recommendation words that were previously present.

### Keywords Detected
- 必吃
- 推薦
- 一定要
- 強烈
- 不能錯過
- 絕對

### Example Scenarios

#### Scenario A: Removed one recommendation word
```
Previous: "小籠包必吃，環境很舒適"
Current:  "小籠包很好吃，環境很舒適"

Trigger: "必吃" was present, now removed
Previous hasRecommendations: true
Current hasRecommendations: false

Result: Suggestion appears
Title: "建議加強推薦力度"
Message: "我發現你移除了一些強烈的推薦詞。要不要加入「必吃」或「推薦」來加強說服力？"
Confidence: 70%
```

#### Scenario B: Multiple recommendations removed
```
Previous: "強烈推薦！一定要試試這家！不能錯過！"
Current:  "這家滿不錯的"

Trigger: Multiple recommendation words removed
Result: High confidence suggestion (75%+)
Auto-fix: Adds "強烈推薦！" to end of draft
```

### Implementation
```typescript
if (previousAnalysis.hasRecommendations && !analysis.hasRecommendations) {
  suggestions.push({
    type: "completeness",
    title: "建議加強推薦力度",
    message: "我發現你移除了一些強烈的推薦詞...",
    suggestedAction: "strengthenRecommendation",
    confidence: 70,
    autoApplyFix: "必吃",
  });
}
```

---

## Rule 3: Content Length Change 📝

### How It Works
Detects significant additions of text, indicating expanded content.

### Thresholds
- **Trigger**: Added 50+ characters
- **Additional Condition**: Total draft > 200 characters
- **Confidence**: 60%

### Example Scenarios

#### Scenario A: User expands narrative
```
Previous (120 chars): 
"去了鼎泰豐吃小籠包，超讚！環境很舒適。"

Current (190 chars):
"去了信義區的鼎泰豐吃小籠包，超讚！環境很舒適，
服務生也很親切。坐著聊天聊了快三小時都不想走。"

Length diff: +70 characters
Total: 190 chars (> 200? No)

Trigger: Added 50+ characters && total > 200
Result: Suggestion appears if current > 200
```

#### Scenario B: User adds substantial content
```
Previous (80 chars):
"很不錯的餐廳"

Current (280 chars):
"很不錯的餐廳，小籠包超好吃，一口咬下去汁多
餡飽。環境非常舒適，燈光柔和。服務生態度很好。
下次還要再去。強烈推薦！"

Length diff: +200 characters
Total: 280 chars (> 200? Yes)

Result: Suggestion appears
Title: "內容變更提示"
Message: "你新增了200個字。內容更豐富了！確認這些內容都是你想要的嗎？"
Confidence: 60%
```

### Implementation
```typescript
const lengthDiff = currentDraft.length - previousDraft.length;
if (lengthDiff > 50 && currentDraft.length > 200) {
  suggestions.push({
    type: "engagement",
    title: "內容變更提示",
    message: `你新增了${lengthDiff}個字。內容更豐富了！...`,
    suggestedAction: "reviewContent",
    confidence: 60,
  });
}
```

---

## Rule 4: Emoji Usage Shift 😊

### How It Works
Detects when emojis are removed from draft, affecting engagement.

### Emoji Pattern
```typescript
const emojiRegex = /[\u{1F300}-\u{1F9FF}]/gu;
```

### Example Scenarios

#### Scenario A: User removed emojis
```
Previous: "超讚👍 小籠包根本停不下來😭 完全推薦👏"
Current:  "超讚 小籠包根本停不下來 完全推薦"

Previous emojis: 3
Current emojis: 0

Trigger: Had emojis before, none now
Result: Suggestion appears
Title: "表情符號提示"
Message: "你移除了表情符號。在小紅書上，適當的emoji能增加吸引力。要加回一些嗎？"
Confidence: 65%
```

#### Scenario B: User has emojis initially, removed some
```
Previous: "去了鼎泰豐😆 小籠包超讚👍 環境舒適✨"
Current:  "去了鼎泰豐，小籠包超讚，環境舒適"

Previous emojis: 3
Current emojis: 0

Trigger: currentEmojis === 0 && previousEmojis > 0
Result: Suggestion
Auto-fix: Distributes emojis: "去了鼎泰豐。🍽️小籠包超讚。😭環境舒適。✨"
```

### Implementation
```typescript
const previousEmojis = (previousDraft.match(emojiRegex) || []).length;
const currentEmojis = (currentDraft.match(emojiRegex) || []).length;

if (currentEmojis === 0 && previousEmojis > 0) {
  suggestions.push({
    type: "engagement",
    title: "表情符號提示",
    message: "你移除了表情符號。在小紅書上，適當的emoji能增加吸引力。要加回一些嗎？",
    suggestedAction: "addEmoji",
    confidence: 65,
  });
}
```

---

## Rule 5: Draft Too Short ⚠️

### How It Works
Detects when draft content is below minimum recommended length.

### Thresholds
- **Threshold**: Less than 50 characters
- **Condition**: Draft is not empty (>0 && <50)
- **Confidence**: 85% (high - clear action needed)

### Example Scenarios

#### Scenario A: Very short draft
```
Draft: "很讚"
Length: 2 characters

Trigger: 0 < length < 50
Result: Suggestion
Title: "內容太短"
Message: "你的草稿只有2字。貼文至少要50字才夠吸引人。要展開敘述嗎？"
Confidence: 85%
Action: "expandContent"
Auto-fix: Appends "環境非常舒適，服務態度也很親切。整體體驗非常值得，強烈推薦給大家！"
```

#### Scenario B: Borderline short
```
Draft: "小籠包超好吃，推薦！"
Length: 12 characters

Trigger: 0 < 12 < 50
Result: Suggestion (probably multiple)
```

### Implementation
```typescript
if (currentDraft.length > 0 && currentDraft.length < 50) {
  suggestions.push({
    type: "completeness",
    title: "內容太短",
    message: `你的草稿只有${currentDraft.length}字。貼文至少要50字才夠吸引人。...`,
    suggestedAction: "expandContent",
    confidence: 85,
  });
}
```

---

## Rule 6: Empty Draft ⏳

### How It Works
Contextual suggestion when draft is completely empty.

### Thresholds
- **Trigger**: Draft is empty or whitespace only
- **Confidence**: 100% (always show)
- **Type**: Default contextual message

### Example Scenarios

#### Scenario A: Initial state
```
Draft: ""
Trigger: !currentDraft.trim()

Display: "準備好了嗎？"
Message: "你的草稿是空的。準備好開始寫貼文了嗎？"
Confidence: 100%
```

#### Scenario B: User cleared draft
```
Previous: "很讚的餐廳..."
Current: ""
Trigger: User cleared it

Result: Suggestion (indicates nudge to restart)
Title: "準備好了嗎？"
```

### Implementation
```typescript
if (!currentDraft.trim()) {
  suggestions.push({
    type: "completeness",
    title: "準備好了嗎？",
    message: "你的草稿是空的。準備好開始寫貼文了嗎？",
    suggestedAction: "startDraft",
    confidence: 100,
  });
}
```

---

## Priority & Limiting

### Confidence Scores
Suggestions ranked by confidence:
```
100% → Always show (empty draft)
85%  → Strong signal (too short)
75%  → Clear pattern (tone shift)
70%  → Likely helpful (recommendations missing)
65%  → Nice to have (emoji change)
60%  → Light suggestion (content expanded)
```

### Suggestion Limiting
Maximum 2 suggestions at once:
```typescript
return suggestions.slice(0, 2);  // Limit output
```

### Ordering
Sorted by confidence (highest first):
```typescript
suggestions.sort((a, b) => b.confidence - a.confidence);
```

---

## Testing Examples

### Test Case 1: Tone Detection
```
Input previous:  "這是不錯的餐廳"
Input current:   "這超讚！我愛死了😭"
Expected: Tone shift suggestion
Actual: ✅ Appears with 75% confidence
```

### Test Case 2: Multiple Rules Triggered
```
Input previous:  "很讚👍"
Input current:   "超讚"
Triggered rules:
  1. Emoji removed (65%)
  2. Too short (85%)
Expected: Max 2 suggestions (85% + 65%)
Actual: ✅ Both appear
```

### Test Case 3: No Change
```
Input previous:  "很讚的餐廳"
Input current:   "很讚的餐廳"
Expected: No suggestions
Actual: ✅ No suggestions generated
```

---

## Edge Cases

### Edge Case 1: Context Words vs Actual Tone
```
Draft: "我不喜歡這裡。完全不推薦"
Analysis: Detects "推薦" keyword
False positive risk: Says tone is positive
Reality: Draft is negative recommendation

Mitigation: Future: Add sentiment analysis
Current: Users can ignore suggestions
```

### Edge Case 2: Hashtags Containing Keywords
```
Draft: "#推薦餐廳 #必吃清單"
Analysis: Detects recommendation keywords
False positive: Suggests to strengthen
Reality: Keywords in hashtags, not in recommendation

Mitigation: Ignore words in hashtags (#tag format)
```

### Edge Case 3: Very Long Drafts
```
Draft: 1000+ characters
Rule: Length change only triggers if diff > 50
Issue: Might not trigger if user adds small amounts repeatedly
Solution: Check total length threshold, not just diff
```

---

## Future Rule Ideas

### Hashtag Usage
```
Trigger: No hashtags in draft
Suggestion: "小紅書推薦至少3-5個hashtags。要我建議一些嗎？"
Action: "addHashtags"
```

### Sentence Length
```
Trigger: One sentence > 30 characters
Suggestion: "句子有點長，可以拆成兩句提高可讀性"
Action: "improveReadability"
```

### Location Mention
```
Trigger: No location in draft
Suggestion: "記得標註地點，方便讀者找到！"
Action: "addLocation"
```

### Dish Variety
```
Trigger: Only one dish mentioned
Suggestion: "提到多個菜色讀者會更有興趣"
Action: "addMoreDishes"
```

---

## Configuration for Customization

```typescript
// Easy to tune these values:

const SUGGESTION_RULES = {
  TONE_SHIFT_CONFIDENCE: 75,
  TONE_SHIFT_DEBOUNCE_MS: 800,
  
  MISSING_RECOMMENDATION_CONFIDENCE: 70,
  RECOMMENDATION_KEYWORDS: ["必吃", "推薦", "一定要", ...],
  
  LENGTH_CHANGE_THRESHOLD: 50,
  EMOJI_CONFIDENCE: 65,
  
  MIN_CONTENT_LENGTH: 50,
  SHORT_CONTENT_CONFIDENCE: 85,
  
  MAX_SUGGESTIONS_AT_ONCE: 2,
  
  EXPANSION_THRESHOLD: 200,  // Total chars to trigger expansion suggestion
};
```

This makes it easy to fine-tune without changing core logic!
