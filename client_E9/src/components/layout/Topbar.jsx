import { useLocation } from "react-router";
const TITLES = { "/": "Dashboard", "/cantores": "Cantores", "/musicas": "Músicas", "/repertorios": "Repertórios" };
export default function Topbar({ busca, onBusca }) {
  const { pathname } = useLocation();
  const base = "/" + pathname.split("/")[1];
  const titulo = TITLES[base] || "M-hub";
  return (
    <header className="topbar">
      <span className="topbar-title">{titulo}</span>
      <div className="topbar-search">
        <span>🔍</span>
        <input placeholder="Buscar..." value={busca || ""} onChange={e => onBusca && onBusca(e.target.value)} />
      </div>
    </header>
  );
}
