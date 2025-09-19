let timerId = null;
let active = false;
let lastRuleIds = [];

console.log("✅ Background script iniciado");

function buildRules(urls) {
  return urls.map((site, index) => ({
    id: index + 1, // IDs deben ser únicos y > 0
    priority: 1,
    action: { type: "block" },
    condition: {
      urlFilter: `||${site.url}^`,
      resourceTypes: ["main_frame"],
    },
  }));
}

async function fetchBlockListAndActivate(durationSeconds, authToken) {
  if (!authToken) {
    console.error("No auth token found. Cannot fetch block list.");
    return;
  }
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/antiprocrastinacion/urls",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Error al obtener sitios bloqueados:", response.status);
      return;
    }

    const sites = await response.json();

    // Generar reglas
    const rules = buildRules(sites);
    const newRuleIds = rules.map((r) => r.id);

    // Añadir reglas nuevas
    try {
      await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: rules,
      });
      lastRuleIds = newRuleIds;
      active = true;
      console.log(
        "Bloqueo activado. Regla(s) añadidas:",
        newRuleIds,
        "por",
        durationSeconds,
        "segundos"
      );
    } catch (err) {
      console.error("Error añadiendo reglas:", err);
      // Aseguramos no dejar lastRuleIds apuntando a algo inválido
      lastRuleIds = [];
      active = false;
      return;
    }

    // Temporizador para desactivar automáticamente
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(async () => {
      try {
        const currentRules =
          await chrome.declarativeNetRequest.getDynamicRules();
        console.log("Reglas actuales antes de desactivar:", currentRules);
        if (currentRules.length > 0) {
          const ids = currentRules.map((r) => r.id);
          await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: ids,
          });
          console.log(
            "Bloqueo desactivado automaticamente. Todas las reglas eliminadas:",
            ids
          );
        } else {
          console.log("No había reglas activas");
        }
      } catch (err) {
        console.error("Error al desactivar manualmente:", err);
      } finally {
        lastRuleIds = [];
        active = false;
        if (timerId) clearTimeout(timerId);
        timerId = null;
        const currentRulesAfter =
          await chrome.declarativeNetRequest.getDynamicRules();
        console.log(
          "Reglas actuales después de desactivar:",
          currentRulesAfter
        );
      }
    }, durationSeconds * 1000);
  } catch (err) {
    console.error("Error al activar:", err);
  }
}

async function deactivate() {
  try {
    const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
    console.log("Reglas actuales antes de desactivar:", currentRules);
    if (currentRules.length > 0) {
      const ids = currentRules.map((r) => r.id);
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ids,
      });
      console.log(
        "Bloqueo desactivado manualmente. Todas las reglas eliminadas:",
        ids
      );
    } else {
      console.log("No había reglas activas");
    }
  } catch (err) {
    console.error("Error al desactivar manualmente:", err);
  } finally {
    lastRuleIds = [];
    active = false;
    if (timerId) clearTimeout(timerId);
    timerId = null;
    const currentRulesAfter =
      await chrome.declarativeNetRequest.getDynamicRules();
    console.log("Reglas actuales después de desactivar:", currentRulesAfter);
  }
}

// 🔹 Recibir mensajes desde content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("🛠 Background recibió:", message);

  if (message.type === "ACTIVATE") {
    console.log(`Activando bloqueo por ${message.duration} segundos`);

    fetchBlockListAndActivate(message.duration, message.token);
    sendResponse({ success: true });
  } else if (message.type === "DEACTIVATE") {
    console.log("Desactivando bloqueo");
    deactivate();
    sendResponse({ success: true });
  } else {
    console.warn("Acción no válida:", message.type);
    sendResponse({ success: false, error: "Acción no válida" });
  }
});
