# Worker Dashboard v2.0 - 開發規範

## 專案資訊
- **名稱**: Worker Dashboard v2.0
- **Repo**: https://github.com/ttcccat-tech/worker-dashboard-v2
- **技術堆疊**: React + Node.js + SQLite
- **本地路徑**: /var/repo/worker-dashboard-v2

## 狀態欄位（6 欄位 Kanban）

| Key | 顯示名稱 | 說明 | 自動 Tag |
|-----|----------|------|----------|
| daily | 交辦事項 | 持續性任務（需持續執行的查詢/任務） | 不自動設定，由老闆決定 |
| backlog | 需求 | 待處理的開發任務 | cc |
| inprogress | 開發 | 正在開發中的任務 | Cat |
| testing | 測試 | 待 code review 的任務 | cc |
| deploy | 佈署 | 待部署的任務 | Cat |
| done | 交付 | 給老闆驗收用 | 老闆 |

## Tag 標籤系統

| Tag | 說明 | 誰處理 |
|-----|------|--------|
| Cat | 開發任務 | Cat 負責處理 |
| cc | 需求/測試/交辦事項 | cc 負責處理 |
| 老闆 | 交付驗收 | 老闆負責處理 |
| SRE | 系統維運任務 | **所有人都要執行** |

## 工作規則

1. **移動牌卡時自動更新 tag** - 移到哪個欄位，tag 就變成對應的人
2. **根據 tag 指派** - 誰的 tag 誰處理
3. **欄位不是必要條件** - repo 是共用的，其他人可以偕同開發
4. **SRE 標籤** - 所有人都要執行該張牌卡

## 自動化邏輯

```
backlog → cc
inprogress/deploy → Cat
testing → cc
done → 老闆
daily → 不自動設定，由老闆決定
```

## API 端點

| Method | Endpoint | 說明 |
|--------|----------|------|
| GET | /api/tasks | 取得所有任務 |
| POST | /api/tasks | 建立新任務 |
| PUT | /api/tasks/:id | 更新任務 |
| PUT | /api/tasks/:id/move | 移動任務欄位（同時自動更新 tag） |
| DELETE | /api/tasks/:id | 刪除任務 |

## 部署

- 後端 port: 3004
- URL: http://192.168.1.206:3004

---

*維護者: cc*
