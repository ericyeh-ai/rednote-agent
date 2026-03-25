# 📐 架構設計

## 系統架構概覽

```
┌─────────────────────────────────────────────────────────┐
│                    React Components                     │
│  ┌──────────────┬──────────────┬──────────────────────┐ │
│  │ MaterialsPanel  ChatPanel    DraftPanel             │ │
│  └───────┬────────┬──────────────┬─────────────────────┘ │
│          │        │              │                       │
├──────────┴────────┴──────────────┴───────────────────────┤
│              Custom Hooks (State Management)             │
│  ┌──────────────┬──────────────┬──────────────────────┐  │
│  │useMaterials  │ useChatState │ useDraftState        │  │
│  │State()       │              │                      │  │
│  └──────────────┴──────────────┴──────────────────────┘  │
│          ↓           ↓              ↓                     │
├──────────┴───────────┴──────────────┴──────────────────┤
│                  Utilities & Logic                     │
│  ┌──────────────┬──────────────┬──────────────────────┐ │
│  │mockAiSugg..  │draftRevision │ai.ts (ID gen)       │ │
│  │              │Tracking      │                      │ │
│  └──────────────┴──────────────┴──────────────────────┘ │
│                                                        │
├────────────────── localStorage ──────────────────────┤
│  rednote_materials                                    │
│  rednote_messages                                     │
│  rednote_draft                                        │
│  rednote_previousDraft                                │
│  rednote_revisions                                    │
└────────────────────────────────────────────────────────┘
```

---

## 核心概念

### 1. 組件層 (Components)

**三面板布局**
- **MaterialsPanel** - 輸入素材（餐廳、地點、菜色、筆記）
- **ChatPanel** - AI 對話和建議展示
- **DraftPanel** - 草稿編輯和預覽

**特性**
- 受控組件，所有狀態由父組件管理
- composition 事件支持（中文輸入法）
- localStorage 集成由 hooks 處理

### 2. 狀態管理層 (Hooks)

採用 **Custom Hooks** 設計模式（非 Redux、Zustand）。

```
page.tsx (Root)
├── useMaterialsState()
│   └── 素材輸入管理（restaurant, location, dishes, notes）
├── useChatState()
│   ├── 消息歷史
│   ├── 發送消息邏輯
│   └── 草稿提取
└── useDraftState()
    ├── 草稿編輯
    ├── 修訂追蹤
    └── 自動建議
```

**為什麼使用 Hooks 而非 Redux？**
- 項目規模較小（< 10 個全局狀態變量）
- 易於理解和維護
- 無需額外依賴
- 可輕鬆遷移到真實 API

### 3. 數據層 (localStorage)

**數據結構**
```typescript
// Materials
rednote_materials = {
  restaurant: string
  location: string
  dishes: string
  notes: string
}

// Chat Messages
rednote_messages = Message[] where Message = {
  id: number (timestamp-based)
  role: 'user' | 'ai'
  text: string
  timestamp: number
}

// Draft
rednote_draft = string
rednote_previousDraft = string

// Revisions
rednote_revisions = DraftRevision[] where DraftRevision = {
  id: string
  timestamp: number
  previousContent: string
  currentContent: string
  changeType: 'add' | 'delete' | 'modify'
  charDelta: number
  diffSummary: string
}
```

**持久化策略**
- 使用 `useLocalStorage<T>` hook
- 自動 JSON 序列化/反序列化
- 錯誤處理（try-catch）
- 客戶端初始化時加載

---

## 數據流

### 聊天流程

```
User Input
    ↓
ChatPanel.handleSend(text)
    ↓
useChatState.handleSend(text, materials)
    ├── 生成 Message { id, role: 'user', text, timestamp }
    ├── 調用 mockAiReply(text, materials)
    ├── 生成 Message { id, role: 'ai', text, timestamp }
    └── setMessages([...prev, userMsg, aiMsg])
    ↓
設置 localStorage['rednote_messages']
    ↓
ChatPanel.useEffect((messages.length)) 清空輸入框
    ↓
提取草稿（如果匹配」...」格式）
    ↓
設置 draft + previousDraft
```

### 建議流程

```
Draft Change
    ↓
DraftPanel.onDraftChange(newDraft)
    ↓
useDraftState.handleDraftChange(newDraft)
    ├── createRevision(previousDraft, newDraft)
    ├── setRevisions([...prev, revision])
    └── 800ms debounce
    ↓
getMockAISuggestions(previousDraft, newDraft)
    ├── detectChangeType()
    ├── 應用 6 個規則
    └── 返回 AutoSuggestion[]
    ↓
setAutoSuggestions(suggestions)
    ↓
ChatPanel 顯示 SuggestionBubble
    ↓
User 點擊 Apply
    ↓
applyMockAutoFix(draft, action)
    ├── 執行特定的修正
    ├── 返回 updatedDraft
    ├── createRevision(draft, updatedDraft)
    └── 設置 draft + previousDraft
    ↓
addMessage('ai', '✅ 已應用...')
```

---

## 關鍵決策

### 1. 為什麼是 localStorage？

✅ **優點**
- 無需後端
- 同步和簡單
- 足夠 MVP 測試
- 用戶數據隱私

❌ **限制**
- 同設備/瀏覽器
- ~5-10 MB 限制
- 無雲備份

**遷移計劃**: Phase 3 時添加雲同步

### 2. 為什麼是時間戳 ID？

```typescript
// ❌ 舊方式：全局計數器
let msgId = 0;
export function getNextId(): number {
  return ++msgId;  // 問題：刷新頁面重置
}

// ✅ 新方式：時間戳 + 隨機
export function getNextId(): number {
  return Date.now() * 100000 + Math.floor(Math.random() * 100000);
  // 保證：時間順序 + 毫秒級唯一性 + localStorage 相容
}
```

### 3. 為什麼是 Composition 事件？

中文輸入法流程：
```
User 打字 → compositionstart → IME 選字 → compositionend → onChange

按 Enter：
Phase 1 (IME 中): compositionstart...compositionend → 確認選字 ❌ 不發送
Phase 2 (確認後): 正常 Enter → 發送 ✅
```

---

## 性能考量

### 1. Debounce (建議生成)
- **延遲**: 800ms
- **原因**: 避免用戶輸入時頻繁計算
- **權衡**: 即時反饋 vs 性能

### 2. 建議限制
- **最多**: 2 個建議
- **原因**: 避免認知超載
- **策略**: 按信心度排序

### 3. Message ID 清理
- **自動**: 檢測重複 ID 並清空舊數據
- **觸發**: 頁面加載時
- **理由**: 防止 localStorage 損壞

---

## 擴展點

### 易於添加的功能

**新建議規則**
```typescript
// mockAiSuggestions.ts
const rules = [
  detectToneShift,
  detectMissingRecommendations,
  detectContentTooShort,
  // ← 添加新規則
  detectMissingHashtags,
  detectSpelling,
];
```

**新 Hook**
```typescript
// app/hooks/usePreferencesState.ts
export function usePreferencesState() {
  const [tone, setTone] = useLocalStorage<'casual' | 'formal'>(...);
  const [maxLength, setMaxLength] = useLocalStorage<number>(...);
  // ...
}
```

**集成真實 API**
```typescript
// 遷移簡單：只需替換 mockAiReply -> await llmApi.chat()
async function handleSend(text: string) {
  const aiText = await llmApi.chat(text, materials);  // ← 替換此行
  // 其他邏輯不變
}
```

---

## 測試策略

### 單元測試
```
✅ mockAiSuggestions.ts
✅ draftRevisionTracking.ts
✅ Custom Hooks (useChatState, useDraftState)
```

### 集成測試
```
- useLocalStorage ↔ 組件
- 建議引擎 ↔ 狀態管理
- UI 事件 ↔ state 變化
```

### E2E 測試
```
- 完整用戶流程（輸入素材 → 發送消息 → 應用建議 → 編輯草稿）
- 頁面重載持久化
- localStorage 清空恢復
```

---

## 已知限制

| 限制 | 原因 | 路線圖 |
|------|------|--------|
| Mock AI | 無後端 API | Phase 1 |
| 本地存儲 | 無雲同步 | Phase 3 |
| 單用戶 | 無認證 | Phase 3 |
| 無歷史版本 | 數據簡單 | Phase 2-3 |

---

## 參考資源

- [React Hooks 文檔](https://react.dev/reference/react)
- [Next.js 應用路由](https://nextjs.org/docs/app)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
