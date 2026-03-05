const serverInput = document.getElementById("server");
const addBtn = document.getElementById("addBtn");
const openBtn = document.getElementById("openBtn");
const statusDiv = document.getElementById("status");

// Load saved server URL
chrome.storage?.local?.get(["serverUrl"], (result) => {
  if (result.serverUrl) {
    serverInput.value = result.serverUrl;
  }
});

// Save server URL on change
serverInput.addEventListener("change", () => {
  const url = serverInput.value.replace(/\/$/, "");
  serverInput.value = url;
  chrome.storage?.local?.set({ serverUrl: url });
});

function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.display = "block";
  setTimeout(() => {
    statusDiv.style.display = "none";
  }, 3000);
}

addBtn.addEventListener("click", async () => {
  const server = serverInput.value.replace(/\/$/, "");
  if (!server) {
    showStatus("Please enter your server URL first", "error");
    return;
  }

  // Save the URL
  chrome.storage?.local?.set({ serverUrl: server });

  // Get current tab info
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab?.url) {
    showStatus("No active tab found", "error");
    return;
  }

  const params = new URLSearchParams({
    add: "true",
    url: tab.url,
    title: tab.title || "",
  });

  chrome.tabs.create({ url: `${server}/?${params.toString()}` });
  showStatus("Opening PrintQueue...", "success");
});

openBtn.addEventListener("click", () => {
  const server = serverInput.value.replace(/\/$/, "");
  if (!server) {
    showStatus("Please enter your server URL first", "error");
    return;
  }
  chrome.tabs.create({ url: server });
});
