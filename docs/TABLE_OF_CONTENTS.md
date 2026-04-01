# 📚 文檔目錄

歡迎來到 MomoPi 的文檔。選擇下面的主題開始：

## 🚀 快速開始

- **[開始使用](./QUICK_START.md)** - 5 分鐘快速上手
- **[設置開發環境](./SETUP.md)** - 環境安裝和配置

## 🏗️ 系統文檔

- **[架構概覽](./ARCHITECTURE.md)** - 系統設計和組件關係
  - 組件層次結構
  - 狀態管理流程
  - 數據持久化架構

- **[自定義 Hooks API](./HOOKS_API.md)** - 詳細的 Hook 參考
  - `useLocalStorage` - 持久化數據
  - `useDraftState` - 草稿編輯邏輯
  - `useChatState` - 聊天管理
  - `useMaterialsState` - 材料輸入

## 🤖 Mock AI 與建議

- **[Mock AI 工作流程](./MOCK_AI_WORKFLOW.md)** - 如何使用 AI 建議系統
  - 建議如何生成
  - 可用的自動修復
  - 測試建議引擎

- **[建議規則指南](./SUGGESTION_RULES_GUIDE.md)** - 詳細規則說明
  - 6 項檢測規則
  - 5 項自動修復
  - 自定義規則開發

## 🧪 測試與品質

- **[測試指南](./TESTING.md)** - 如何測試功能
  - 手動測試程序
  - 單元測試設置
  - 集成測試示例

## 🤝 貢獻

- **[貢獻指南](./CONTRIBUTING.md)** - 如何 fork、編輯和提交 PR
  - 代碼風格規範
  - 提交訊息格式
  - PR 檢查清單

## 🚀 部署

- **[部署指南](./DEPLOYMENT.md)** - 構建和部署應用
  - 本地構建
  - Vercel 部署
  - Docker 容器化
  - CI/CD 設置

## 📋 項目計畫

- **[ROADMAP](../ROADMAP.md)** - 開發路線圖和未來計畫
  - Phase 0: 當前 Mock AI 工作流程
  - Phase 1: API 集成和認証
  - Phase 2: 高級功能
  - Phase 3-4: 生產準備和擴展

## 📖 其他資源

### 文件結構
```
/
├── app/
│   ├── components/       👉 UI 組件
│   ├── hooks/            👉 自定義 state hooks
│   ├── types/            👉 TypeScript 類型定義
│   ├── utils/            👉 工具函數
│   └── page.tsx
│
├── docs/                 👉 本文檔文件夾
│   ├── QUICK_START.md
│   ├── SETUP.md
│   ├── ARCHITECTURE.md
│   ├── HOOKS_API.md
│   ├── MOCK_AI_WORKFLOW.md
│   ├── SUGGESTION_RULES_GUIDE.md
│   ├── TESTING.md
│   ├── CONTRIBUTING.md
│   ├── DEPLOYMENT.md
│   └── TABLE_OF_CONTENTS.md (本文件)
│
├── public/              👉 靜態資源
├── ROADMAP.md          👉 項目路線圖
├── README.md           👉 項目概覽
├── package.json
├── tsconfig.json
└── next.config.ts
```

### 按用途查找

**我想...**

| 目標 | 查看 |
|------|------|
| 快速開始使用應用 | [QUICK_START.md](./QUICK_START.md) |
| 設置開發環境 | [SETUP.md](./SETUP.md) |
| 理解系統架構 | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| 學習如何使用 Hooks | [HOOKS_API.md](./HOOKS_API.md) |
| 測試 AI 建議功能 | [MOCK_AI_WORKFLOW.md](./MOCK_AI_WORKFLOW.md) |
| 了解建議規則 | [SUGGESTION_RULES_GUIDE.md](./SUGGESTION_RULES_GUIDE.md) |
| 貢獻代碼 | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| 測試應用程序 | [TESTING.md](./TESTING.md) |
| 部署應用 | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| 查看未來計畫 | [ROADMAP.md](../ROADMAP.md) |

## 🔍 快速查找

### 常用清單
- 📝 localStorage 鍵: `momopi_*` (見 SETUP.md)
- 🎯 3 個主要 Hooks: useDraftState, useChatState, useMaterialsState
- 🤖 6 項建議規則: 語氣/推薦/內容/emoji/長度/空白
- 🛠️ 5 項自動修復: adjustTone, strengthenRecommendation, addEmoji, expandContent, custom

### 重要文件位置
- 類型定義: `app/types/state.ts`
- Mock AI: `app/utils/mockAiSuggestions.ts`
- 根組件: `app/page.tsx`
- 主樣式: `app/globals.css`

## ❓ 常見問題

**Q: 我可以在沒有後端的情況下使用嗎？**
A: 是的！目前所有數據存儲在瀏覽器的 localStorage 中。見 QUICK_START.md。

**Q: 如何添加新的建議規則？**
A: 查看 [SUGGESTION_RULES_GUIDE.md](./SUGGESTION_RULES_GUIDE.md) 的「添加新規則」部分。

**Q: 如何部署到生產環境？**
A: 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 的完整指南。

**Q: 我想貢獻代碼？**
A: 歡迎！查看 [CONTRIBUTING.md](./CONTRIBUTING.md)。

**Q: 如何報告 Bug？**
A: 在 GitHub Issues 中提出，參考 CONTRIBUTING.md 的 Issue 模板。

## 🎯 下一步

1. **新用戶？** 從 [QUICK_START.md](./QUICK_START.md) 開始
2. **要開發？** 查看 [SETUP.md](./SETUP.md) 和 [ARCHITECTURE.md](./ARCHITECTURE.md)
3. **要貢獻？** 閱讀 [CONTRIBUTING.md](./CONTRIBUTING.md)
4. **要部署？** 查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**上次更新**: 2024 年
**維護者**: Xiaohongshu Food AI Team
**許可證**: MIT
