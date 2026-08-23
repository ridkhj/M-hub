import { NavLink, useNavigate } from "react-router";
import { useTema } from "../../contexts/ThemeContext";
const NAV = [
  { to: "/",            icon: "🏠", label: "Dashboard"  },
  { to: "/cantores",    icon: "🎤", label: "Cantores"   },
  { to: "/musicas",     icon: "🎵", label: "Músicas"    },
  { to: "/repertorios", icon: "📋", label: "Repertórios" },
];
export default function Sidebar({ usuario, onSair }) {
  const { tema, toggleTema } = useTema();
  const navigate = useNavigate();
  return (
    <nav className="sidebar">
      <NavLink to="/" className="sidebar-logo" end>
        <span className="sidebar-logo-icon">🎵</span>
        <span className="sidebar-logo-text">M-hub</span>
      </NavLink>
      <div className="sidebar-nav">
        {NAV.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}>
            <span className="nav-icon">{item.icon}</span>{item.label}
          </NavLink>
        ))}
      </div>
      <div className="sidebar-divider" />
      <div className="sidebar-bottom">
        <button className="nav-item" onClick={toggleTema}>
          <span className="nav-icon">{tema === "dark" ? "☀️" : "🌙"}</span>
          {tema === "dark" ? "Tema Claro" : "Tema Escuro"}
        </button>
        {usuario && (
          <div className="sidebar-user">
            <div className="avatar" style={{ width: 28, height: 28, fontSize: "0.72rem" }}>
              {usuario.nome?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <span className="sidebar-user-name">{usuario.nome}</span>
              {usuario.email}
            </div>
          </div>
        )}
        <button className="nav-item" onClick={() => { onSair(); navigate("/login"); }}>
          <span className="nav-icon">🚪</span>Sair
        </button>
      </div>
    </nav>
  );
}
