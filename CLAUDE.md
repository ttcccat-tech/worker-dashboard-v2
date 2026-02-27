# Worker Dashboard v2.0 - 開發規範

## 專案資訊
- **名稱**: Worker Dashboard v2.0
- **Repo**: https://github.com/ttcccat-tech/worker-dashboard-v2
- **技術堆疊**: React + Node.js + SQLite
- **本地路徑**: /var/repo/worker-dashboard-v2

## 狀態欄位（6 欄位 Kanban）

| Key | 顯示名稱 | 說明 |
|-----|----------|------|
| daily | 交辦事項 | 持續性任務（如 Nightly Self-Improvement） |
| backlog | 需求 | 待處理的開發任務 |
| inprogress | 開發 | 正在開發中的任務 |
| testing | 測試 | 待 code review 的任務 |
| deploy | 部署 | 待部署的任務 |
| done | 交付 | 給老闆驗收用 |

## Tag 標籤系統

- **SRE**: 系統維運任務
- **Cat**: 開發任務
- **可擴充**: 未來可增加其他 tag

## 功能需求

### 後端 API (Node.js + Express + SQLite)
1. **任務 CRUD**
   - GET /api/tasks - 取得所有任務
   - POST /api/tasks - 建立新任務
   - PUT /api/tasks/:id - 更新任務
   - DELETE /api/tasks/:id - 刪除任務
   - PUT /api/tasks/:id/move - 移動任務欄位

2. **資料模型**
   ```sql
   CREATE TABLE tasks (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     title TEXT NOT NULL,
     description TEXT,
     status TEXT NOT NULL DEFAULT 'backlog',
     tag TEXT DEFAULT 'Cat',
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );
   ```

### 前端 (React)
1. 6 欄位 Kanban 介面
2. 顯示任務數量
3. 顯示 tag 標籤（不同顏色）
4. 拖曳或點擊移動任務
5. 新增/編輯/刪除任務

### Tag 自動化
- 移動到「inprogress」自動設為「Cat」
- 移動到「done」自動設為「Cat」（完成）

## 開發流程（Git 操作）

1. 每個功能開發完成後 `git add .` + `git commit -m "feat: 描述"`
2. 開發完成後 `git push origin main`
3. Commit message 格式：`feat:`, `fix:`, `refactor:`, `docs:`

## 部署
- 後端 port: 3004
- 前端 build 後靜態托管
- SQLite 資料庫檔案: database.sqlite

---

*維護者: cc*
