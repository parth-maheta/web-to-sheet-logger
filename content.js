let saveBtn;

function createButton() {
  if (saveBtn) return;

  saveBtn = document.createElement("button");
  saveBtn.textContent = "Save to Sheet";
  saveBtn.style.position = "absolute";
  saveBtn.style.zIndex = 10000;
  saveBtn.style.padding = "5px 10px";
  saveBtn.style.fontSize = "12px";
  saveBtn.style.borderRadius = "5px";
  saveBtn.style.border = "none";
  saveBtn.style.backgroundColor = "#4CAF50";
  saveBtn.style.color = "white";
  saveBtn.style.cursor = "pointer";
  saveBtn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  saveBtn.style.display = "none";

  saveBtn.addEventListener("click", () => {
    const selection = window.getSelection();
    const selectedText = selection.toString();

    if (!selectedText.trim()) return;

    try {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.style.backgroundColor = "yellow";
      span.className = "webtosheet-highlight";
      span.textContent = selectedText;
      range.deleteContents();
      range.insertNode(span);
    } catch (err) {
      console.warn("Highlighting failed:", err);
    }

    const data = {
      action: "saveSelection",
      data: {
        text: selectedText,
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString(),
      },
    };

    try {
      chrome.runtime.sendMessage(data, (response) => {
        if (chrome.runtime.lastError) {
          console.warn("sendMessage failed:", chrome.runtime.lastError.message);
        } else {
          alert("Saved to Sheet!");
        }
      });
    } catch (err) {
      console.warn("Message sending completely failed:", err);
    }

    saveBtn.style.display = "none";
    window.getSelection().removeAllRanges();
  });

  document.body.appendChild(saveBtn);
}

function updateButtonPosition() {
  const selection = window.getSelection();
  if (
    !selection ||
    selection.rangeCount === 0 ||
    !selection.toString().trim()
  ) {
    if (saveBtn) saveBtn.style.display = "none";
    return;
  }

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  if (!saveBtn) createButton();

  saveBtn.style.top = `${rect.bottom + window.scrollY + 5}px`;
  saveBtn.style.left = `${rect.left + window.scrollX}px`;
  saveBtn.style.display = "block";
}

let debounceTimer;
document.addEventListener("selectionchange", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    try {
      updateButtonPosition();
    } catch (err) {
      console.warn("updateButtonPosition failed:", err);
    }
  }, 150);
});
