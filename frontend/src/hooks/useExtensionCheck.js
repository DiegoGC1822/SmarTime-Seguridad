import { useState, useEffect } from "react";

function useExtensionCheck(timeout = 1000) {
  const [installed, setInstalled] = useState(null); // null = aún no sé, true/false = detectado

  useEffect(() => {
    const checkId = Date.now();

    function handleResponse(event) {
      if (
        event.source === window &&
        event.data?.type === "EXTENSION_PONG" &&
        event.data?.checkId === checkId
      ) {
        setInstalled(true);
        window.removeEventListener("message", handleResponse);
        clearTimeout(timer);
      }
    }

    window.addEventListener("message", handleResponse);

    // Mandamos el "ping" al content script
    window.postMessage({ type: "EXTENSION_PING", checkId }, "*");

    // Si no responde en X ms → asumimos que no está instalada
    const timer = setTimeout(() => {
      setInstalled(false);
      window.removeEventListener("message", handleResponse);
    }, timeout);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("message", handleResponse);
    };
  }, [timeout]);

  return installed;
}

export default useExtensionCheck;
