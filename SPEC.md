# Worker Dashboard v2.0 開發規範

## 專案概述

- **名稱**: Worker Dashboard v2.0
- **用途**: 工作任務看板管理系統
- **技術堆疊**: React + Node.js + SQLite

## 狀態欄位

| Key | 顯示名稱 | 說明 |
|-----|----------|------|
| daily | 交辦事項 | 持續性任務（如 Nightly Self-Improvement） |
| backlog | 需求 | 待處理的開發任務 |
| inprogress | 開發 | 正在開發中的任務 |
| testing | 測試 | 待 code review 的任務 |
| deploy | 部署 | 待部署的任務 |
| done | 交付 | 給老闆驗收用 |

## Tag 標籤系統

每張任務都有 tag 標籤，用於指派給不同成員：
- **SRE**: 系統維運任務
- **Cat**: 開發任務
- **其他**: 可擴充

## 功能需求

### 1. 任務管理
- 新增任務（標題、描述、標籤）
- 編輯任務
- 刪除任務
- 移動任務欄位

### 2. 欄位顯示
- 6 個欄位显示
- 顯示任務數量
- 顯示 tag 標籤

### 3. Tag 指派
- 移動到「開發」欄位時，tag 自動改為執行者
- 版本確認時顯示狀態 + tag

### 4. API
- RESTful API
- 資料持久化（SQLite）

## 開發流程

1. 建立 GitHub repo
2. 初始化專案
3. 後端 API 開發
4. 前端介面開發
5. 部署設定
6. 測試驗收

---

*維護者: cc + Cat*
