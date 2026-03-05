// Content script for MakerWorld pages
// Adds a floating "Add to PrintQueue" button on model pages

(function () {
  // Only run on model pages
  if (!window.location.pathname.match(/\/model\//)) return;

  const button = document.createElement("button");
  button.id = "printqueue-add-btn";
  button.innerHTML = "🖨️ Add to PrintQueue";
  button.title = "Add this model to your PrintQueue";
  document.body.appendChild(button);

  button.addEventListener("click", async () => {
    const serverUrl = localStorage.getItem("printqueue_server") || "";

    if (!serverUrl) {
      const url = prompt(
        "Enter your PrintQueue server URL (e.g., https://your-app.vercel.app):"
      );
      if (!url) return;
      localStorage.setItem("printqueue_server", url.replace(/\/$/, ""));
    }

    const server = localStorage.getItem("printqueue_server");
    const pageUrl = window.location.href;
    const title =
      document.querySelector('meta[property="og:title"]')?.getAttribute("content") ||
      document.title;
    const thumbnail =
      document.querySelector('meta[property="og:image"]')?.getAttribute("content") ||
      "";
    const description =
      document.querySelector('meta[property="og:description"]')?.getAttribute("content") ||
      "";

    // Open the app with pre-filled data
    const params = new URLSearchParams({
      add: "true",
      url: pageUrl,
      title: title,
    });

    window.open(`${server}/?${params.toString()}`, "_blank");
    button.innerHTML = "✅ Opened PrintQueue!";
    setTimeout(() => {
      button.innerHTML = "🖨️ Add to PrintQueue";
    }, 2000);
  });
})();
