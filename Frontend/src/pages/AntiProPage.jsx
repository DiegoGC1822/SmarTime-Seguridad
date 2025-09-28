import { useState, useEffect } from "react";
import "../styles/AntiProPage.css";
import {
  getAntiPros,
  createAntiPro,
  deleteAntiPro,
} from "../services/antiProService";

const AntiProPage = ({ extensionInstalled }) => {
  const [isActive, setIsActive] = useState(false);
  const [blockedSites, setBlockedSites] = useState([]);
  const [newSite, setNewSite] = useState("");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [remainingTime, setRemainingTime] = useState(null);

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const urls = await getAntiPros();
        setBlockedSites(urls);
      } catch (error) {
        console.error("Error al cargar URLs bloqueadas:", error);
        setBlockedSites([]);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    let timer;
    if (isActive && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      setIsActive(false);
    }
    return () => clearInterval(timer);
  }, [isActive, remainingTime]);

  if (extensionInstalled === null) {
    return <div>Cargando...</div>;
  }

  if (extensionInstalled === false) {
    return (
      <div>
        <p>
          Para usar esta función, por favor instala la extensión del navegador y
          recarga la pagina.
        </p>
      </div>
    );
  }

  const handleToggle = () => {
    const totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60;
    setIsActive((prev) => !prev);
    if (!isActive && totalSeconds > 0) {
      setRemainingTime(totalSeconds);
      window.postMessage(
        { type: "ACTIVATE", duration: totalSeconds, token: authToken },
        "*"
      );
    } else {
      setRemainingTime(null);
      window.postMessage({ type: "DEACTIVATE" }, "*");
    }
  };

  const handleAddSite = async () => {
    if (newSite && !blockedSites.includes(newSite)) {
      try {
        const createdSite = await createAntiPro({ url: newSite });
        const updatedSites = [...blockedSites, createdSite];
        setBlockedSites(updatedSites);
      } catch (error) {
        console.error("Error al agregar sitio:", error);
      }
      setNewSite("");
    }
  };

  const handleRemoveSite = async (site) => {
    try {
      await deleteAntiPro(site.id);
      const updatedSites = blockedSites.filter((s) => s !== site);
      setBlockedSites(updatedSites);
    } catch (error) {
      console.error("Error al eliminar sitio:", error);
    }
  };

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="antipro-container">
      <h2>Modo Antiprocrastinación</h2>

      <div className="antipro-section">
        <label>Activar modo antiprocrastinación</label>
        <label className="switch">
          <input type="checkbox" checked={isActive} onChange={handleToggle} />
          <span className="slider round"></span>
        </label>
        {remainingTime !== null && isActive && (
          <p>Tiempo restante: {formatTime(remainingTime)}</p>
        )}
      </div>

      <div className="antipro-section">
        <h3>Sitios bloqueados</h3>
        <input
          type="text"
          placeholder="Escribir url de sitio web solo con su dominio (ej: facebook.com)"
          value={newSite}
          onChange={(e) => setNewSite(e.target.value)}
        />
        {!isActive && (
          <button className="add-site-btn" onClick={handleAddSite}>
            + agregar sitio
          </button>
        )}

        <ul className="site-list">
          {Array.isArray(blockedSites) && blockedSites.length > 0 ? (
            blockedSites.map((site) => (
              <li key={site.id}>
                {site.url}
                {!isActive && (
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveSite(site)}
                  >
                    ❌
                  </button>
                )}
              </li>
            ))
          ) : (
            <li>añada sus sitios bloqueados</li>
          )}
        </ul>
      </div>

      <div className="antipro-section">
        <h3>Duración del bloqueo</h3>
        <input
          type="number"
          min="0"
          max="99"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="Horas"
        />
        <input
          type="number"
          min="0"
          max="59"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          placeholder="Minutos"
        />
      </div>
    </div>
  );
};

export default AntiProPage;
