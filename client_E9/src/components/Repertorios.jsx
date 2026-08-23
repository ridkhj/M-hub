import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { getRepertorios, criarRepertorio, atualizarRepertorio, removerRepertorio } from "../services/api";
import { useToast } from "../contexts/ToastContext";
import Modal from "./ui/Modal";
import ConfirmDialog from "./ui/ConfirmDialog";
import { SkeletonLine } from "./ui/Skeleton";
import EmptyState from "./ui/EmptyState";

function fmt(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d) ? iso : d.toLocaleDateString("pt-BR");
}

function FormRepertorio({ inicial, onSalvar, onCancelar, carregando }) {
  const [titulo, setTitulo] = useState(inicial?.titulo || "");
  const [data, setData]     = useState((inicial?.data_execucao || "").split("T")[0]);
  return (
    <>
      <div className="field">
        <label htmlFor="r-titulo">Título *</label>
        <input id="r-titulo" className="input" placeholder="ex: Culto de Domingo" value={titulo} onChange={e => setTitulo(e.target.value)} autoFocus />
      </div>
      <div className="field">
        <label htmlFor="r-data">Data de execução</label>
        <input id="r-data" className="input" type="date" value={data} onChange={e => setData(e.target.value)} />
      </div>
      <div className="modal-footer" style={{ border: "none", padding: 0, marginTop: 4 }}>
        <button className="btn btn-secondary btn-sm" onClick={onCancelar}>Cancelar</button>
        <button className="btn btn-primary btn-sm" onClick={() => onSalvar({ titulo, dataExecucao: data || null })} disabled={!titulo.trim() || carregando}>
          {carregando ? "Salvando..." : "Salvar →"}
        </button>
      </div>
    </>
  );
}

export default function Repertorios() {
  const [repertorios, setRepertorios] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [busca, setBusca]       = useState("");
  const [modal, setModal]       = useState(null);
  const [confirm, setConfirm]   = useState(null);
  const [salvando, setSalvando]   = useState(false);
  const [removendo, setRemovendo] = useState(false);
  const { toast } = useToast();
  const navigate  = useNavigate();

  async function carregar() {
    setLoading(true);
    try { setRepertorios(await getRepertorios()); }
    catch { toast.error("Erro ao carregar repertórios."); }
    finally { setLoading(false); }
  }
  useEffect(() => { carregar(); }, []);

  const filtrados = useMemo(() =>
    repertorios.filter(r => r.titulo.toLowerCase().includes(busca.toLowerCase())),
    [repertorios, busca]
  );

  async function salvar(dados) {
    setSalvando(true);
    try {
      if (modal === "novo") await criarRepertorio(dados);
      else await atualizarRepertorio(modal.id, dados);
      toast.success(modal === "novo" ? "Repertório criado!" : "Repertório atualizado!");
      setModal(null);
      await carregar();
    } catch (err) { toast.error(err.message); }
    finally { setSalvando(false); }
  }

  async function confirmarRemocao() {
    setRemovendo(true);
    try {
      await removerRepertorio(confirm);
      toast.success("Repertório removido.");
      setConfirm(null);
      await carregar();
    } catch (err) { toast.error(err.message); }
    finally { setRemovendo(false); }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>📋 Repertórios</h1>
          <p>{repertorios.length} repertório(s) cadastrado(s)</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setModal("novo")}>+ Novo Repertório</button>
        </div>
      </div>

      <div className="page-controls">
        <input className="input" placeholder="🔍 Buscar repertório..." value={busca} onChange={e => setBusca(e.target.value)} />
      </div>

      {loading ? (
        <div className="table-wrap" style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {[1,2,3].map(i => <SkeletonLine key={i} h={24} />)}
        </div>
      ) : filtrados.length === 0 ? (
        <EmptyState icone="📋" titulo="Nenhum repertório encontrado"
          descricao={busca ? "Tente outro título." : "Crie o primeiro repertório!"}
          acao={!busca && <button className="btn btn-primary" onClick={() => setModal("novo")}>+ Novo Repertório</button>} />
      ) : (
        <div className="table-wrap">
          {filtrados.map(r => (
            <div key={r.id} className="rep-row" onClick={() => navigate(`/repertorios/${r.id}`)}>
              <span className="rep-row-icon">🎼</span>
              <div className="rep-row-info">
                <div className="rep-row-title">{r.titulo}</div>
                {r.data_execucao && <div className="rep-row-meta">📅 {fmt(r.data_execucao)}</div>}
              </div>
              <div className="rep-row-actions" onClick={e => e.stopPropagation()}>
                <button className="btn-icon" title="Editar" onClick={() => setModal(r)}>✏️</button>
                <button className="btn-icon danger" title="Remover" onClick={() => setConfirm(r.id)}>🗑️</button>
              </div>
              <span style={{ color: "var(--text-muted)" }}>→</span>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal titulo={modal === "novo" ? "Novo Repertório" : "Editar Repertório"} onClose={() => setModal(null)}>
          <FormRepertorio inicial={modal !== "novo" ? modal : null} onSalvar={salvar} onCancelar={() => setModal(null)} carregando={salvando} />
        </Modal>
      )}
      {confirm && (
        <ConfirmDialog mensagem="Deseja remover este repertório e todos os seus itens?" onConfirmar={confirmarRemocao} onCancelar={() => setConfirm(null)} carregando={removendo} />
      )}
    </div>
  );
}
