import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { NavLink } from "react-router";
const MOB = [
  { to: "/",            icon: "🏠", label: "Home"       },
  { to: "/cantores",    icon: "🎤", label: "Cantores"   },
  { to: "/musicas",     icon: "🎵", label: "Músicas"    },
  { to: "/repertorios", icon: "📋", label: "Repertórios" },
];
export default function Layout({ usuario, onSair, children, busca, onBusca }) {
  return (
    <div className="app-layout">
      <Sidebar usuario={usuario} onSair={onSair} />
      <div className="app-content">
        <Topbar busca={busca} onBusca={onBusca} />
        <main className="page-body">{children}</main>
      </div>
      <nav className="mobile-nav">
        {MOB.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => `mobile-nav-item${isActive ? " active" : ""}`}>
            <span className="mobile-nav-icon">{item.icon}</span>{item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
