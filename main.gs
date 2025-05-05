const SHEET_NAME = '工作表1';
const FOLDER_ID = '1RnDjJnGnE1MHWdcxMd7QNQ3ncINYgtPW';

function doPost(e) {
  try {
    const company = e.parameter.company || '';
    const position = e.parameter.position || '';
    const date = e.parameter.date || '';

    // 寫入試算表
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    sheet.appendRow([company, position, date]);

    // 建立以公司為名的資料夾
    const baseFolder = DriveApp.getFolderById(FOLDER_ID);
    let subfolder = baseFolder.getFoldersByName(company);
    if (subfolder.hasNext()) {
      subfolder = subfolder.next();
    } else {
      subfolder = baseFolder.createFolder(company);
    }

    // 上傳公司簡介PDF
    if (e.parameter.file1) {
      const blob1 = Utilities.base64Decode(e.parameter.file1.split(',')[1]);
      const fileBlob1 = Utilities.newBlob(blob1, e.parameter.filetype1, company + "_" + position + "_職位內容" + "_" + date + ".pdf");
      subfolder.createFile(fileBlob1);
    }

    // 上傳履歷PDF
    if (e.parameter.file2) {
      const blob2 = Utilities.base64Decode(e.parameter.file2.split(',')[1]);
      const fileBlob2 = Utilities.newBlob(blob2, e.parameter.filetype2, company + "_" + position + "_履歷" + "_" + date + ".pdf");
      subfolder.createFile(fileBlob2);
    }

    return ContentService.createTextOutput("成功上傳！").setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    return ContentService.createTextOutput("錯誤：" + error.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}

function doGet(e) {
  const company = e.parameter.company;
  const action = e.parameter.action;

  // 資料夾網址
  if (action === 'drive') {
    const baseFolder = DriveApp.getFolderById(FOLDER_ID);
    const folders = baseFolder.getFoldersByName(company);
    if (folders.hasNext()){
      const targetFolder = folders.next();
      const url = targetFolder.getUrl();
      //Logger.log(url);
      return ContentService.createTextOutput(url);
    }
    else {
      return ContentService.createTextOutput("沒有該資料夾");
    }
  }

  // 公司紀錄
  if (action === 'records') {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('工作表1');
    const data = sheet.getDataRange().getDisplayValues();

    // 過濾只取該公司資料
    const filtered = data.filter(row => row[0] === company); // 假設公司名稱在第0欄
    //Logger.log(filtered);
    return ContentService.createTextOutput(JSON.stringify(filtered)).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput('無效的action參數').setMimeType(ContentService.MimeType.TEXT);
}