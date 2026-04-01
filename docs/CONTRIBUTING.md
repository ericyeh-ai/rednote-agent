# 🤝 貢獻指南

感謝您對 MomoPi 的興趣!

## 快速貢獻流程

### 1. 設置開發環境

```bash
# Fork 並克隆
git clone https://github.com/yourusername/momopi.git
cd momopi

# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 打開 http://localhost:3000
```

### 2. 尋找任務

**初級任務** (適合新手)
- [ ] 改進 UI 樣式（目前使用 Tailwind）
- [ ] 添加新 emoji 或圖標
- [ ] 改進錯誤訊息
- [ ] 類型定義改進

**中級任務** (需要邏輯理解)
- [ ] 添加新建議規則（見 `mockAiSuggestions.ts`）
- [ ] 增強 localStorage 復原力
- [ ] 添加客戶端工具函數

**高級任務** (架構級別)
- [ ] API 集成準備
- [ ] 狀態管理重頁構
- [ ] 工具測試框架

### 3. 提交貢獻

```bash
# 創建功能分支
git checkout -b feature/amazing-feature

# 編輯並提交
git add .
git commit -m "feat: Add amazing feature"
# 好的提交訊息格式（見下文）

# 推送
git push origin feature/amazing-feature

# 在 GitHub 提起 Pull Request
```

## 提交訊息規範

採用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
type(scope): description

[optional body]
[optional footer]
```

**類型**
- `feat` - 新功能
- `fix` - 修復 bug
- `docs` - 文檔變更
- `style` - 代碼風格（空格、逗號等，無邏輯變更）
- `refactor` - 重構（既不是新功能也不是修復）
- `perf` - 性能改進
- `test` - 添加或修改測試
- `chore` - 依賴、構建工具等

**示例**
```
feat(suggestions): Add spell-check rule

- Detect grammar errors
- Suggest corrections
- Integrate with ChatPanel

Closes #123
```

## 代碼風格

### TypeScript
```typescript
// ✅ 好例子
interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}

// ❌ 避免
const msg: any = { id: 1, role: 'user', text: 'Hi' };
```

### React 組件
```typescript
// ✅ 好例子
export function MyComponent({ prop }: Props) {
  const [state, setState] = useState("");

  const handleClick = useCallback(() => {
    // logic
  }, []);

  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
}

// ❌ 避免
export const MyComponent = (props) => {
  const handleClick = () => { /* ... */ };
  return <div />;
};
```

### Tailwind CSS
```tsx
// ✅ 好例子
<button className="rounded-lg px-3 py-2 text-sm text-white bg-rose-500 transition hover:bg-rose-600">
  Button
</button>

// ❌ 避免
<button style={{ padding: '10px', background: 'red' }}>
  Button
</button>
```

## 測試

在提交前運行：

```bash
# 類型檢查
npm run build

# Linting
npm run lint  # (if configured)

# 手動測試
npm run dev
# 在瀏覽器中測試你的更改
```

## 常見任務

### 添加新建議規則

1. 在 `app/utils/mockAiSuggestions.ts` 中添加檢測邏輯
2. 在 `generateSuggestions()` 函數中添加規則
3. 在 `applyMockAutoFix()` 中添加對應的修正
4. 在相應的 UI 中測試

**模板**
```typescript
// 1. 檢測邏輯
function detectNewIssue(drafted: string): boolean {
  // 你的檢測邏輯
  return /* true/false */;
}

// 2. 在 generateSuggestions() 中
if (detectNewIssue(currentDraft)) {
  suggestions.push({
    id: `newissue_${Date.now()}`,
    type: "newtype",
    title: "標題",
    message: "詳細訊息",
    suggestedAction: "actionName",
    confidence: 70,
  });
}

// 3. 在 applyMockAutoFix() 中
fixes["actionName"] = (draft) => {
  // 返回修正後的草稿
  return draft.modified;
};
```

### 改進 UI 組件

1. 編輯 `app/components/*.tsx`
2. 使用 Tailwind CSS 類
3. 在瀏覽器中測試響應式設計
4. 提交 PR 和螢幕截圖

### 更新文檔

1. 修改 `/docs` 或 `*.md` 文件
2. 確保目錄結構清晰
3. 添加代碼示例（如適用）

## PR 檢查清單

提交前確認：

- [ ] 代碼遵循風格指南
- [ ] 添加了必要的類型定義
- [ ] 沒有 console.log 或調試代碼
- [ ] 功能在本地測試通過
- [ ] 提交訊息遵循 Conventional Commits
- [ ] 相關文檔已更新
- [ ] 沒有破壞現有功能

## 報告問題

發現 bug 或有建議？[提起 Issue](https://github.com/yourusername/momopi/issues)

**Issue 模板**
```markdown
### 問題描述
簡短描述問題或功能請求

### 重現步驟
1. 第 1 步
2. 第 2 步
3. 第 3 步

### 預期行為
應該發生什麼

### 實際行為
實際發生了什麼

### 環境
- 瀏覽器: Chrome/Safari/Firefox
- OS: macOS/Windows/Linux
- Node 版本: 18/20/22
```

## 項目結構簡介

```
app/
├── components/          # UI 組件
├── hooks/              # 自定義 state hooks
├── types/              # TypeScript 類型
├── utils/              # 工具函數和邏輯
└── page.tsx            # 根組件

docs/                   # 文檔
tests/                  # 測試（未來）
```

## 需要幫助？

- 📖 查看 [ARCHITECTURE.md](./ARCHITECTURE.md)
- 🚀 查看 [ROADMAP.md](../ROADMAP.md)
- 💬 在 Issue 中提問

---

感謝貢獻!🎉
