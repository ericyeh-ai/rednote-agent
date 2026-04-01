# 🚀 部署指南

本指南涵蓋如何構建和部署 MomoPi。

## 環境準備

### 前置要求
- Node.js 18.17 或更高版本
- npm 或 yarn 套件管理器
- 現代化瀏覽器（Chrome、Safari、Firefox 最新版本）

## 本地構建

### 1. 安裝依賴

```bash
npm install
```

### 2. 構建應用

```bash
npm run build
```

**輸出**
```
✓ Next.js 構建完成
✓ 生成的文件位於 `.next/` 目錄
✓ 靜態資源位於 `public/` 目錄
```

### 3. 測試生產版本

```bash
npm run build && npm start
# 應用將運行於 http://localhost:3000
```

## 部署到 Vercel（推薦）

### 前置要求
- GitHub 帳號
- [Vercel 帳號](https://vercel.com/signup)

### 步驟

1. **推送到 GitHub**
   ```bash
   git add .
   git commit -m "chore: ready for vercel deployment"
   git push origin main
   ```

2. **連接到 Vercel**
   - 訪問 [vercel.com/dashboard](https://vercel.com/dashboard)
   - 點擊「Add New」→「Project」
   - 導入你的 GitHub 倉庫
   - 選擇 Next.js 框架預設

3. **部署設置**
   ```
   框架: Next.js ✓
   構建命令: npm run build ✓
   輸出目錄: .next ✓
   環境: Node.js 18.x ✓
   ```

4. **部署**
   - 點擊「Deploy」
   - 等待構建完成（約 1-2 分鐘）
   - 獲得唯一的 `.vercel.app` URL

### 自動部署
推送到 `main` 分支後，Vercel 將自動部署新版本。

## 部署到 Docker

### Dockerfile 示例

```dockerfile
# 構建階段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生產階段
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/.next ./.next
COPY public ./public

EXPOSE 3000
CMD ["npm", "start"]
```

### 構建和運行

```bash
# 構建鏡像
docker build -t momopi:latest .

# 運行容器
docker run -p 3000:3000 momopi:latest
```

## 部署到其他平台

### Netlify

```bash
# 創建 netlify.toml
[build]
  command = "npm run build"
  functions = "/.netlify/functions"
  publish = ".next/out"

[dev]
  command = "npm run dev"
  port = 3000
```

然後：
1. 推送到 GitHub
2. 在 Netlify Dashboard 連接倉庫
3. 自動部署

### Railway.app

```bash
# 推送到 Railway
railway link
railway up

# 或通過 GUI
# 1. https://railway.app/dashboard
# 2. 創建新項目
# 3. 選擇 GitHub 倉庫
```

### 其他平台
- **AWS Amplify**: 類似 Vercel，支持自動部署
- **Render**: 免費層級可用
- **Heroku**: 需要 `Procfile` 和 `package.json` 腳本

## 環境變數

目前應用不需要環境變數。如果添加後端集成，遵循此模式：

### .env.local （本地開發）
```
NEXT_PUBLIC_API_URL=http://localhost:3001
API_SECRET_KEY=your_secret_key
```

### Vercel 環境變數設置
1. 進入項目設置 → Environment Variables
2. 添加變數（分生產、預覽和開發環境）
3. 重新部署以應用更改

## 版本控制和發佈

### 語義化版本控制 (SemVer)

遵循 `MAJOR.MINOR.PATCH` 格式：

- **MAJOR**: 破壞性改動 (v2.0.0)
- **MINOR**: 新功能向後相容 (v1.1.0)
- **PATCH**: 錯誤修復 (v1.0.1)

### 發佈流程

```bash
# 1. 在 main 分支上進行
git checkout main
git pull

# 2. 更新版本
npm version patch  # 或 minor/major

# 3. 推送
git push
git push --tags

# 4. 在 GitHub Releases 創建發佈說明
#    詉述新功能、修復和破壞性改動
```

## 持續集成 (CI)

### GitHub Actions 工作流程 (可選)

在 `.github/workflows/deploy.yml` 中：

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 部署檢查清單

部署前確認：

- [ ] 所有測試通過 (`npm run build`)
- [ ] 沒有 console.log 或調試代碼
- [ ] 環境變數已正確設置
- [ ] 版本號已更新
- [ ] CHANGELOG/發佈說明已完成
- [ ] 性能指標可接受
- [ ] localStorage 兼容性確認

## 監控和日誌

### Vercel 分析
- 訪問 Vercel Dashboard
- 查看部署歷史
- 監控重點指標（Core Web Vitals）

### 瀏覽器控制台檢查
本應用僅在模式下輸出調試信息。生產環境應無錯誤。

## 故障排除

### 構建失敗

```bash
# 1. 清除快取
rm -rf .next node_modules
npm install

# 2. 重新構建
npm run build

# 3. 檢查錯誤、訊息
# 確認所有類型和導入是否正確
```

### 部署後空白頁

- 檢查瀏覽器控制台是否有錯誤
- 確認 Next.js 版本相容性
- 清除瀏覽器快取和 localStorage
- 檢查 CSP（內容安全策略）設置

### 性能問題

1. 檢查 Network 選項卡中的資源大小
2. 使用 Lighthouse 或 WebPageTest 分析
3. 考慮圖片優化和代碼分割

## 回滾

### Vercel 回滾
1. 進入 Deployments 選項卡
2. 選擇上一個工作部署
3. 點擊「Redeploy」

### Git 回滾
```bash
# 找到提交 ID
git log --oneline

# 回滾到特定版本
git revert <commit-id>
git push

# Vercel 將自動重新部署
```

## 性能優化

### Next.js 優化
```typescript
// ✅ 動態導入以減少包大小
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
});

// ✅ 圖片最佳化
<Image
  src="/image.png"
  alt="描述"
  width={200}
  height={200}
  priority
/>
```

### Tailwind CSS 最佳化
生產構建自動移除未使用的樣式，最終 CSS 通常 < 10KB。

## 下一步

- 📖 查看 [ROADMAP.md](../ROADMAP.md) 了解未來功能
- 🔄 設置自動測試（GitHub Actions）
- 📊 集成分析（Google Analytics、Mixpanel）
- 🔐 添加 API 認證和會話管理

---

**需要幫助？** 查看 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) 或提出 Issue。
