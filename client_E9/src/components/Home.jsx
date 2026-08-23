import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getCantores, getMusicas, getRepertorios } from "../services/api";
import { SkeletonLine } from "./ui/Skeleton";

function formatarData(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d) ? iso : d.toLocaleDateString("pt-BR");
}

export default function Home({ usuario }) {
  const [dados, setDados] = useState({ cantores: [], musicas: [], repertorios: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCantores(), getMusicas(), getRepertorios()])
      .then(([cantores, musicas, repertorios]) => setDados({ cantores, musicas, repertorios }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const recentes = [...dados.repertorios].reverse().slice(0, 5);
  const destaque = dados.cantores.slice(0, 6);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Olá, {usuario?.nome?.split(" ")[0] || "Músico"}! 👋</h1>
          <p>Aqui está um resumo do seu hub musical</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-row">
        <Link to="/cantores" className="kpi-card">
          {loading ? <SkeletonLine h={40} w="60px" /> : <div className="kpi-number">{dados.cantores.length}</div>}
          <div className="kpi-label">🎤 Cantores</div>
        </Link>
        <Link to="/musicas" className="kpi-card">
          {loading ? <SkeletonLine h={40} w="60px" /> : <div className="kpi-number">{dados.musicas.length}</div>}
          <div className="kpi-label">🎵 Músicas</div>
        </Link>
        <Link to="/repertorios" className="kpi-card">
          {loading ? <SkeletonLine h={40} w="60px" /> : <div className="kpi-number">{dados.repertorios.length}</div>}
          <div className="kpi-label">📋 Repertórios</div>
        </Link>
      </div>

      {/* Repertórios Recentes */}
      <div style={{ marginBottom: 32 }}>
        <div className="section-header">
          <h2>📋 Repertórios Recentes</h2>
          <Link to="/repertorios" className="section-link">Ver todos →</Link>
        </div>
        <div className="table-wrap">
          {loading ? (
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
              {[1,2,3].map(i => <SkeletonLine key={i} h={20} />)}
            </div>
          ) : recentes.length === 0 ? (
            <div className="empty-state" style={{ padding: "32px" }}>
              <p>Nenhum repertório ainda.</p>
            </div>
          ) : (
            recentes.map(r => (
              <Link key={r.id} to={`/repertorios/${r.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="rep-row">
                  <span className="rep-row-icon">🎼</span>
                  <div className="rep-row-info">
                    <div className="rep-row-title">{r.titulo}</div>
                    {r.data_execucao && <div className="rep-row-meta">📅 {formatarData(r.data_execucao)}</div>}
                  </div>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>→</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Cantores em Destaque */}
      <div>
        <div className="section-header">
          <h2>🎤 Cantores em Destaque</h2>
          <Link to="/cantores" className="section-link">Ver todos →</Link>
        </div>
        {loading ? (
          <div style={{ display: "flex", gap: 16 }}>
            {[1,2,3,4].map(i => <SkeletonLine key={i} h={56} w="68px" />)}
          </div>
        ) : (
          <div className="singers-row">
            {destaque.map(c => (
              <Link key={c.id} to="/cantores" className="singer-card">
                <div className="avatar avatar-lg">{c.nome[0].toUpperCase()}</div>
                <span className="singer-card-name">{c.nome.split(" ")[0]}</span>
              </Link>
            ))}
            {dados.cantores.length > 6 && (
              <Link to="/cantores" className="singer-card">
                <div className="avatar avatar-lg" style={{ background: "var(--bg-highlight)", color: "var(--text-muted)" }}>+</div>
                <span className="singer-card-name">Ver todos</span>
              </Link>
            )}
            {destaque.length === 0 && <p>Nenhum cantor cadastrado ainda.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
