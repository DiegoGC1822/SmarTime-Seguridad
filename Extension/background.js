chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    console.log("Bloqueado:", details.url);
    return { cancel: true }; // corta la navegación
  },
  {
    urls: [
      "*://*.tiktok.com/*",
      "*://*.facebook.com/*",
      "*://*.instagram.com/*",
    ],
  },
  ["blocking"]
);
