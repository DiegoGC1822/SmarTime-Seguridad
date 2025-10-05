import { useState, useEffect, useRef } from "react"; // Hooks añadidos
import { Link, useNavigate } from "react-router-dom";
import UserIconSVG from "../assets/Icons/user-profile.svg"; // Renombrado para claridad
import "../styles/Header.css"; // Asegúrate que la ruta es correcta

const Header = ({ pageTitle = "Enfocado en Mejorar" }) => {
  // Título por defecto de ejemplo
  const navigate = useNavigate();
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const notificationTriggerRef = useRef(null); // Para el botón de la campana
  const notificationPanelRef = useRef(null); // Para el panel

  // Nombres de clase (los que ya tenías)
  const headerContainerClasses = "app-header-container";
  const leftSectionClasses = "app-header-left";
  const logoLinkClasses = "app-header-logo-link"; // Lo mantenemos por si lo reactivas
  const logoTextClasses = "app-header-logo-text"; // Lo mantenemos por si lo reactivas
  const pageTitleClasses = "app-header-page-title";
  const rightSectionClasses = "app-header-right";
  const iconButtonClasses = "app-header-icon-button";
  const userMenuClasses = "app-header-user-menu";

  const handleUserProfileClick = () => {
    navigate("/settings");
  };

  // Efecto para cerrar el panel si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(event.target) &&
        notificationTriggerRef.current && // También verifica que no se haya hecho clic en el botón de la campana
        !notificationTriggerRef.current.contains(event.target)
      ) {
        setShowNotificationPanel(false);
      }
    };

    if (showNotificationPanel) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotificationPanel]);

  return (
    <header className={headerContainerClasses}>
      <div className={leftSectionClasses}>
        {/* Logo y título de la aplicación (puedes ocultar el logo si el sidebar ya lo tiene) */}
        <Link
          to="/dashboard"
          className={logoLinkClasses}
          style={{ display: "none" }}
        >
          {" "}
          {/* Oculto por defecto */}
          <span className={logoTextClasses}>SmartTime</span>
        </Link>
        {/* Título de la página actual */}
        {pageTitle && <h1 className={pageTitleClasses}>{pageTitle}</h1>}
      </div>

      <div className={rightSectionClasses}>
        {/* Contenedor de la campana de notificación */}

        {/* Menú de Usuario */}
        <div className={userMenuClasses}>
          <button
            type="button"
            className={iconButtonClasses}
            aria-label="Menú de usuario"
            onClick={handleUserProfileClick}
          >
            <img src={UserIconSVG} alt="Usuario" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
