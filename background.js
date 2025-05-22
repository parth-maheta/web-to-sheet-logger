const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbwJRST7Pnpd0yViN4uc3S2rKC_kCVH4b5KFSJwYW7z5-7aADYIXEWcCkUmBQp0zoRG4ew/exec";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-selection",
    title: "Save to Google Sheet",
    contexts: ["selection"],
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "save-selection" && tab?.id) {
    try {
      const [injectionResult] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => ({
          text: window.getSelection().toString(),
          url: window.location.href,
          title: document.title,
          timestamp: new Date().toISOString(),
        }),
      });
      const data = injectionResult.result;
      sendDataToSheet(data, tab.id);
    } catch (error) {
      console.error("Error executing script in tab:", error);
    }
  }
});

// Listen for messages from content script (in-page button)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveSelection") {
    const data = message.data;
    const tabId = sender.tab?.id;
    sendDataToSheet(data, tabId)
      .then(() => {
        sendResponse({ status: "success" });
      })
      .catch((err) => {
        sendResponse({ status: "error", message: err.toString() });
      });
    return true;
  }
});

// Common function to send data to Google Sheet
async function sendDataToSheet(data, tabId) {
  try {
    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error ${res.status}: ${text}`);
    }
    await res.json();

    if (tabId) {
      await chrome.scripting.executeScript({
        target: { tabId },
        func: () => alert("Saved to Sheet!"),
      });
    }
  } catch (err) {
    console.error("Failed to send data to sheet:", err);
    if (tabId) {
      await chrome.scripting.executeScript({
        target: { tabId },
        func: (msg) => alert(msg),
        args: [err.toString()],
      });
    }
    throw err;
  }
}
