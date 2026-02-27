# Worker Dashboard v2.0

工作任務看板管理系統 - 6 欄位 Kanban 介面

## 功能特色

- ✅ 6 欄位 Kanban 看板 (daily, backlog, inprogress, testing, deploy, done)
- ✅ Tag 標籤系統 (Cat, SRE)
- ✅ 移動任務時自動更新 tag
- ✅ 新增 / 編輯 / 刪除任務
- ✅ RESTful API + SQLite 持久化

## 技術堆疊

- **前端**: React
- **後端**: Node.js + Express
- **資料庫**: SQLite

## 快速開始

```bash
# 安裝依賴
npm run install-all

# 啟動開發伺服器 (後端 port 3004)
npm start

# 單獨啟動前端
npm run client
```

## API 端點

| Method | Endpoint | 說明 |
|--------|----------|------|
| GET | /api/tasks | 取得所有任務 |
| POST | /api/tasks | 建立新任務 |
| PUT | /api/tasks/:id | 更新任務 |
| PUT | /api/tasks/:id/move | 移動任務欄位 |
| DELETE | /api/tasks/:id | 刪除任務 |

## 狀態欄位

| Key | 顯示名稱 | 說明 |
|-----|----------|------|
| daily | 交辦事項 | 持續性任務 |
| backlog | 需求 | 待處理的開發任務 |
| inprogress | 開發 | 正在開發中的任務 |
| testing | 測試 | 待 code review 的任務 |
| deploy | 部署 | 待部署的任務 |
| done | 交付 | 給老闆驗收用 |

## Tag 標籤

- **Cat**: 開發任務 (綠色)
- **SRE**: 系統維運任務 (藍色)

## 部署

後端運行 port: 3004

---

*維護者: cc + Cat*
