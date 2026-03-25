# Quick Start: Mock AI Workflow

## 🚀 Start Using Now

### 1. Start the App
```bash
npm run dev
```
App runs at `http://localhost:3000`

### 2. Generate Initial Draft
- Click "生成草稿" button
- AI generates a sample post about the restaurant

### 3. Edit and Watch Suggestions Appear
Edit the draft in the **right panel** and watch:

```
Type for 800ms → Suggestions appear in chat → Click "應用" or "忽略"
```

### 4. Try These Examples

**Example A: Add Casual Language** 😭
```
Original: "去了鼎泰豐，喜歡小籠包"
Edit to:  "超讚！根本停不下來😭我愛死了"
Wait...  → "偵測到語氣變化" suggestion appears
```

**Example B: Remove Recommendations** 📝
```
Original: "小籠包必吃！強烈推薦！"
Delete to: "小籠包不錯"
Wait...  → "建議加強推薦力度" suggestion appears
```

**Example C: Make It Too Short** ⚠️
```
Original: "很讚的餐廳，小籠包超好吃"
Delete to: "超讚"
Wait...  → "內容太短" suggestion appears (85% confidence)
```

---

## 📋 Suggestion Reference

### Auto-Suggestions That Appear

| Suggestion | When | Click "應用" Result |
|-----------|------|------------------|
| 🎨 **Tone Shift** | Add/remove casual words | Rewrites draft with consistent tone |
| 📝 **Missing Recommendations** | Remove "必吃"/"推薦" | Adds "強烈推薦！" to end |
| ✨ **Emoji Removed** | Delete emojis | Re-adds emojis throughout |
| 📄 **Too Short** | Less than 50 chars | Appends description |
| 🔄 **Content Expanded** | Added 50+ chars | Asks to review changes |
| ⏳ **Empty Draft** | No content | Encourages you to start |

---

## 🎮 Controls

### In Draft Panel (Right)
- **Type** → Suggestions appear after 800ms
- All changes are instant

### In Chat Panel (Middle)
- **Suggestion Bubble** → Color-coded by type
- **"應用" Button** → Apply the suggestion
- **"忽略" Button** → Dismiss suggestion

---

## 🧪 Test Cases

### Test 1: Tone Detection (Easy)
1. Click "生成草稿"
2. Add emojis and casual words: "超棒😭根本停不下來"
3. Wait 1 second
4. ✅ See "偵測到語氣變化" appear
5. Click "應用" → Whole draft becomes casual

### Test 2: Ignore Suggestion (Easy)
1. Any suggestion appears
2. Click "忽略"
3. ✅ Suggestion disappears, draft unchanged

### Test 3: Multiple Rules (Medium)
1. Change draft to just "讚"
2. Wait 1 second
3. ✅ Multiple suggestions appear
4. Apply one → Others stay for you to decide

---

## 🎯 Try These Flows

### Flow 1: Perfect Post
```
1. Click "生成草稿"
2. Edit to improve tone
3. Apply suggestions one by one
4. Click "複製" to copy final result
✅ Share on RedNote!
```

### Flow 2: Experiment With Rules
```
1. Start with empty draft
2. Type "很好吃" → See "內容太短" (85%)
3. Expand to 100 chars → Suggestion changes
4. Add emojis → Different suggestions
5. Remove them → Emoji suggestion appears
```

### Flow 3: Test Auto-Fixes
```
For each suggestion type:
  1. Create draft that triggers it
  2. Click "應用" to see auto-fix
  3. Review result in draft panel
  4. Undo manually if you want to try again
```

---

## 🔧 What's Happening Behind the Scenes

```
You type in draft
    ↓ (debounce 800ms)
Analysis engine runs
    ↓
Checks 6 rules:
  ✓ Tone shift?
  ✓ Missing recommendations?
  ✓ Content too short?
  ✓ Emoji removed?
  ✓ Content expanded?
  ✓ Empty draft?
    ↓
Generates suggestions (max 2)
    ↓
Displays in chat with colors
    ↓
You see suggestions!
```

**No backend. All frontend. No API calls.**

---

## 📚 Files to Explore

If curious about implementation:

1. **Core Logic**: `app/utils/mockAiSuggestions.ts` (250 lines)
   - How suggestions are generated
   - All 6 rules defined here

2. **UI Component**: `app/components/shared/SuggestionBubble.tsx` (50 lines)
   - How suggestions look
   - Apply/Ignore buttons

3. **Integration**: `app/page.tsx` (lines 28-55)
   - How debounce works
   - How auto-fixes are applied

4. **Types**: `app/types/state.ts` (AutoSuggestion interface)
   - Type definitions

---

## 💡 Tips

- **Debounce**: Wait 800ms after typing stops → suggestions appear
- **Confidence**: Higher % = AI is more confident in suggestion  
- **Color Coding**:
  - 🔵 Blue = Tone issues
  - 🟡 Amber = Completeness
  - 🟣 Purple = Engagement
  - 🟢 Green = Consistency

- **Try Extremes**: Delete everything, type one word, etc. to see different suggestions

---

## ⚡ Common Questions

**Q: Why do suggestions take 800ms to appear?**
A: Debounced to avoid showing suggestions while user is still typing.

**Q: Can I apply suggestions to my current draft?**
A: Yes! Click "應用" button. It auto-fixes the draft.

**Q: What if I don't like the auto-fix?**
A: Click "忽略" instead. Or manually undo the change.

**Q: Will this work without backend?**
A: Yes! Completely frontend. No API calls needed.

**Q: Can I add more suggestion types?**
A: Yes! See `MOCK_AI_WORKFLOW.md` for how to extend.

---

## 🚀 Ready to Build More?

Once you're comfortable with this:

1. **Add More Rules**: Check `SUGGESTION_RULES_GUIDE.md` for ideas
2. **Real AI Integration**: Replace `getMockAISuggestions()` with API call
3. **User Preferences**: Save user feedback on suggestions
4. **Analytics**: Track which suggestions are applied most

---

## 📖 Full Documentation

- **`MOCK_AI_WORKFLOW.md`** - Complete system guide
- **`SUGGESTION_RULES_GUIDE.md`** - Rule details & examples
- **`FRONTEND_STATE_DESIGN.md`** - State architecture
- **`STATE_QUICK_REFERENCE.md`** - Type references

---

## 🎉 Have Fun!

This is a fully working mock AI system. Play with it, test edge cases, and see what works best for your users.

When you're ready for real AI, just swap the suggestion engine and everything else works the same!

**Live at**: http://localhost:3000
