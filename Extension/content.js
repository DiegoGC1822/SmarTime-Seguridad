window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  const msg = event.data;

  // ✅ Filtrar solo nuestros mensajes
  if (!msg || !msg.type) return;
  if (!["EXTENSION_PING", "ACTIVATE", "DEACTIVATE"].includes(msg.type)) {
    return; // ignorar mensajes raros (como webpackHotUpdate)
  }

  if (msg.type === "EXTENSION_PING") {
    window.postMessage({ type: "EXTENSION_PONG", checkId: msg.checkId }, "*");
  } else if (msg.type === "ACTIVATE") {
    chrome.runtime.sendMessage({
      type: "ACTIVATE",
      duration: msg.duration,
      urls: msg.urls,
    });
  } else if (msg.type === "DEACTIVATE") {
    chrome.runtime.sendMessage({ type: "DEACTIVATE" });
  }
});
