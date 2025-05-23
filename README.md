## 📋 Web-to-Sheet Logger

**Web-to-Sheet Logger** is a Chrome Extension that lets you highlight content on any webpage and instantly log it into a connected Google Sheet. Perfect for researchers, students, and anyone collecting data from the web!

---

### 🔧 Features

* ✅ Highlight and log selected text
* ✅ Automatically captures webpage title and URL
* ✅ Sends data to Google Sheets in real time via Google Apps Script
* ✅ Simple one-click logging from context menu or popup

---

### 🔒 Permissions Used

The extension requires the following permissions:

* `activeTab`: To access the content of the currently active tab
* `contextMenus`: To add a custom context menu item
* `storage`: To store user preferences if needed in future versions
* `scripting`: To inject scripts dynamically for text capture

---

### 🚀 Getting Started

#### 1. **Clone the Repository**

```bash
git clone https://github.com/parth-maheta/web-to-sheet-logger.git
cd web-to-sheet-logger
```

---

#### 2. **Set Up Google Sheet**

1. Create a new **Google Sheet**.
2. Add the following column headers in the first row:

   * `text`, `url`, `title`, `time`
3. Click on **Extensions → Apps Script**.
4. Replace the default code with the following Apps Script:

```js
function doPost(e) {
  try {
    var ss = SpreadsheetApp.openById("1dytR5slbbvmyt1rjP_fSZ3Z_YdYHrPhGibPmRJ0IMZM");//yoursheetid
    var sheet = ss.getSheetByName("webtosheetlogger"); // your sheet name

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.text,
      data.url,
      data.title,
      new Date(data.timestamp)
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
```

5. Save and **Deploy**:

   * Click **Deploy → New deployment**
   * Click **Select type → Web app**
   * Set access to: **Anyone**
   * Deploy and copy the **Web App URL**:

```
https://script.google.com/macros/s/AKfycbwJRST7Pnpd0yViN4uc3S2rKC_kCVH4b5KFSJwYW7z5-7aADYIXEWcCkUmBQp0zoRG4ew/exec
```

---

#### 3. **Configure the Extension**

1. Replace the placeholder URL in background.js and popup.js with your copied Apps Script deployment URL.
2. Replace the placeholder URL with your copied Apps Script deployment URL.

```js
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwJRST7Pnpd0yViN4uc3S2rKC_kCVH4b5KFSJwYW7z5-7aADYIXEWcCkUmBQp0zoRG4ew/exec";
```

---

#### 4. **Load Extension in Chrome**

1. Open **Chrome** and go to `chrome://extensions/`
2. Enable **Developer mode** (top-right corner)
3. Click **Load unpacked**
4. Select the cloned folder (`web-to-sheet-logger`)

---

#### 5. **Use the Extension**

* **Option 1:** Highlight any text → Right-click → Click “Save to  sheet”
* **Option 2:** Highlight any text → Click on the extension icon → Click “Save to Sheet”

---

### 🛠️ Files in the Repo

* `manifest.json` – Chrome extension config
* `popup.html` / `popup.js` – Extension popup UI
* `content.js` – Handles content from webpages
* `background.js` – Manages context menu and messaging

---

### ⚠️ Known Limitations

* ❗ Requires manual deployment of Google Apps Script by the user
* ❗ Data logging may fail if the Web App URL is invalid or restricted
* ❗ Limited to highlighted text; images and other media not supported
* ❗ Requires internet connection to log data

---

### 📌 Notes

* Make sure your Google Apps Script deployment is public (**accessible to anyone**).
* Google may prompt you to authorize the script the first time it runs.

---

### 📄 License

MIT License
