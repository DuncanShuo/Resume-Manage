const GAS_URL = "https://script.google.com/macros/s/AKfycbxyzOUvMQegQqTsl7UxChC9wip3Qgv2qD3xsOu-O3OZPgGoKKNduD8GeqY4vPbd5JZV/exec";
const SHEET_URL = "https://docs.google.com/spreadsheets/d/1EE-jQoneT610p50wVUf7rVtgR1BU9JyP6LBgO9zAOnk/edit?usp=sharing";

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('status');
  status.textContent = '準備上傳...';

  const company = form.company.value;
  const position = form.position.value;
  const date = new Date().toLocaleString().split(' ')[0];
  const file1 = form.file1.files[0];
  const file2 = form.file2.files[0];

  const reader1 = new FileReader();
  const reader2 = new FileReader();

  reader1.onloadend = () => {
    reader2.onloadend = async () => {
      const base64File1 = reader1.result;
      const base64File2 = reader2.result;

      const formData = new URLSearchParams();
      formData.append("company", company);
      formData.append("position", position);
      formData.append("date", date);
      formData.append("file1", base64File1);
      formData.append("filename1", file1.name);
      formData.append("filetype1", file1.type);
      formData.append("file2", base64File2);
      formData.append("filename2", file2.name);
      formData.append("filetype2", file2.type);

      try {
        const response = await fetch(GAS_URL, {method: "POST", body: formData});
        const text = await response.text();
        status.textContent = text;
      } catch (err) {
        status.textContent = "錯誤：" + err.message;
      }
    };
    reader2.readAsDataURL(file2);
  };
  reader1.readAsDataURL(file1);
});
  
// 獲取資料按鈕
document.getElementById('getDataBtn').addEventListener('click', async () => {
  window.open(SHEET_URL, '_blank');
});

document.getElementById('showHistoryBtn').addEventListener('click', async () => {
  const company = document.querySelector('input[name="company"]').value;
  const res = await fetch(GAS_URL+`?company=${encodeURIComponent(company)}&action=records`);
  const data = await res.json();

  if (data == "無效的action參數") {
    records.textContent = "無效的action參數";
  }

  const recordsDiv = document.getElementById('records');
  if (data.length === 0) {
    recordsDiv.innerHTML = '沒有該公司紀錄';
    return;
  }

  let html = '<table border="1"><tr><th>公司</th><th>職位</th><th>日期</th></tr>';
  data.forEach(row => {
    html += `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`;
  });
  html += '</table>';
  recordsDiv.innerHTML = html;
});

// 打開該公司資料夾
document.getElementById('openDriveBtn').addEventListener('click', async () => {
  const company = document.querySelector('input[name="company"]').value;
  const response = await fetch(GAS_URL+`?company=${encodeURIComponent(company)}&action=drive`);
  const url = await response.text();
  const records = document.getElementById('records');
  //records.textContent = url;
  if (url == "無效的action參數") {
    records.textContent = "無效的action參數";
  }
  else if (url == "沒有該資料夾") {
    records.textContent = "沒有該公司資料夾";
  }
  else {
    window.open(url, '_blank'); 
  }
});