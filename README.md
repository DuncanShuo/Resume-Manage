# 履歷整理系統 Resume Manage

一個透過 Google Apps Script 與 Google Drive 整合的簡易履歷管理系統，可透過前端表單上傳公司資訊、職位、履歷與說明文件，並自動記錄到 Google Sheets，同時檔案儲存至 Google Drive 中對應公司資料夾。

## 功能列表

- [x] 上傳公司、職位、時間資訊
- [x] 上傳兩份 PDF（說明 + 履歷），並依公司自動儲存
- [x] 自動寫入 Google Sheets 表單
- [x] 可快速開啟紀錄表單
- [x] 可查看某公司歷史投遞紀錄
- [x] 可直接跳轉至公司 Google Drive 資料夾

## 系統結構

```bash
resume-manager/
├── manifest.json         # Chrome Extension 設定檔
├── popup.html            # 前端 UI 畫面
├── popup.js              # 前端邏輯控制
├── code.gs           # Google Apps Script 主邏輯
├── README.md
