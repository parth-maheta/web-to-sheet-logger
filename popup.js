const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbwJRST7Pnpd0yViN4uc3S2rKC_kCVH4b5KFSJwYW7z5-7aADYIXEWcCkUmBQp0zoRG4ew/exec";

const saveBtn = document.getElementById("saveBtn");
const statusEl = document.getElementById("status");

saveBtn.addEventListener("click", () => {
  saveBtn.disabled = true;
  statusEl.textContent = "Saving...";

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0].id) {
      statusEl.textContent = "No active tab found!";
      saveBtn.disabled = false;
      return;
    }

    chrome.scripting
      .executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          return {
            text: window.getSelection().toString(),
            url: window.location.href,
            title: document.title,
            timestamp: new Date().toISOString(),
          };
        },
      })
      .then(([result]) => {
        const data = result.result;

        if (!data.text) {
          statusEl.textContent = "No text selected on the page!";
          saveBtn.disabled = false;
          return;
        }

        fetch(WEB_APP_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to save");
            return res.json();
          })
          .then(() => {
            statusEl.textContent = "Saved successfully!";
          })
          .catch((err) => {
            statusEl.textContent = "Error saving: " + err.message;
          })
          .finally(() => {
            saveBtn.disabled = false;
          });
      });
  });
});
