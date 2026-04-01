# MomoPi — 讓 Momo 幫你寫一下小紅書

一個會吃、會記、會寫的 AI 分身。使用 Next.js、React 和 TypeScript 構建，完全基於前端，無需後端或 API。

![Preview](https://img.shields.io/badge/Status-Alpha-yellow) ![License](https://img.shields.io/badge/License-MIT-blue) ![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black)

## 📸 功能特性

### 核心功能
- **✍️ 三面板布局** - 素材輸入、聊天對話、實時草稿編輯
- **🐾 Momo 對話** - 規則引擎模擬 Momo 回應（無 API 調用）
- **💡 智能建議系統** - 自動檢測：
  - 語氣變化
  - 內容長度
  - 推薦詞缺失
  - Emoji 使用
  
### 數據管理
- **💾 本地持久化** - 所有數據保存在 localStorage
- **📝 修訂追蹤** - 完整歷史記錄所有草稿編輯
- **🔄 狀態管理** - 模塊化 hooks 設計，易於測試

## 🚀 快速開始

### 先決條件
- Node.js 18+
- npm 或 yarn

### 安裝

```bash
# 克隆項目
git clone https://github.com/yourusername/momopi.git
cd momopi

# 安裝依賴
npm install

# 啟動開發服務器
npm run dev
```

打開 [http://localhost:3000](http://localhost:3000) 查看應用。

## 📁 項目結構

```
momopi/
├── app/
│   ├── components/          # React 組件
│   │   ├── ChatPanel.tsx    # 聊天介面
│   │   ├── DraftPanel.tsx   # 草稿編輯器
│   │   ├── MaterialsPanel.tsx # 素材輸入
│   │   └── shared/          # 共享組件
│   ├── hooks/               # 自定義 hooks（推薦的狀態管理）
│   │   ├── useChatState.ts
│   │   ├── useDraftState.ts
│   │   └── useLocalStorage.ts
│   ├── types/               # TypeScript 類型定義
│   ├── utils/               # 工具函數
│   │   ├── mockAiSuggestions.ts  # 規則引擎
│   │   ├── draftRevisionTracking.ts # 修訂部分
│   │   └── ai.ts            # Mock AI 邏輯
│   └── page.tsx             # 根組件（已優化）
├── docs/                    # 文檔
└── package.json
```

## 🔧 開發

### 可用腳本

```bash
npm run dev      # 啟動開發服務器（Turbopack）
npm run build    # 生產構建
npm run start    # 運行生產版本
npm run lint     # ESLint 檢查
```

### 核心技術棧
- **框架**: Next.js 16.2.1
- **UI**: React 19 + Tailwind CSS 4
- **類型**: TypeScript 5
- **打包工具**: Turbopack
- **狀態**: Context + Custom Hooks
- **存儲**: localStorage API

## 📊 當前功能概覽

### 聊天面板
- 發送消息到 Mock AI
- 接收基於素材的建議
- 自動提取生成的草稿

### 素材輸入
- 餐廳名稱、地點、推薦菜色
- 原始筆記與感受
- 實時保存到 localStorage

### 草稿編輯
- 實時編輯和預覽
- 自動建議（語氣、長度、推薦詞）
- 修訂歷史追蹤
- 一鍵複製

## 💾 數據持久化

所有數據自動保存到 localStorage：
```javascript
// 清空所有數據（if needed）
localStorage.clear();
location.reload();
```

## 🗓️ 開發路線圖

詳見 [ROADMAP.md](./ROADMAP.md)

核心計劃：
1. **Phase 0 (Now)** - Mock 工作流 ✅
2. **Phase 1** - 真實 AI 集成（LLM API）
3. **Phase 2** - 增強建議（情感分析、SEO 優化）
4. **Phase 3** - 用戶帳戶和雲同步

## 📚 文檔

完整文檔請查看 **[文檔目錄](./docs/TABLE_OF_CONTENTS.md)**

主要文檔：
- **[快速開始](./docs/QUICK_START.md)** - 5 分鐘快速上手
- **[架構概覽](./docs/ARCHITECTURE.md)** - 系統設計和組件關係
- **[Mock AI 工作流程](./docs/MOCK_AI_WORKFLOW.md)** - AI 建議系統詳解
- **[建議規則指南](./docs/SUGGESTION_RULES_GUIDE.md)** - 6 項規則詳細說明
- **[Hooks API 參考](./docs/HOOKS_API.md)** - 自定義 hooks 使用
- **[部署指南](./docs/DEPLOYMENT.md)** - 構建和部署說明
- **[貢獻指南](./docs/CONTRIBUTING.md)** - 如何貢獻代碼
- **[發展路線圖](./ROADMAP.md)** - 未來功能計畫

## 🐛 已知限制

- **無後端** - 當前所有功能都是前端
- **Mock AI** - 建議使用規則引擎，不是真實 LLM
- **本地存儲** - 數據不同步到伺服器
- **單用戶** - 無用戶認證或帳户系統

## 🔮 未來計劃

- [ ] 集成真實 AI API（Claude / GPT）
- [ ] 用戶註冊與帳户系統
- [ ] 雲同步和備份
- [ ] 更多平台支持（抖音、小红书 API）
- [ ] 批量生成和發佈功能

## 🤝 貢獻

我們歡迎貢獻！請查看 [貢獻指南](./docs/CONTRIBUTING.md) 了解詳情。

簡短流程：
1. Fork 項目
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打開 Pull Request

## 📄 許可證

本項目採用 MIT 許可證 - 詳見 [LICENSE](./LICENSE) 文件

## 📧 聯繫方式

有問題或建議？[提出 Issue](https://github.com/yourusername/momopi/issues)

---

**注意**: 這是一個 Alpha 版本。API 和功能可能會在不經通知的情況下更改。
