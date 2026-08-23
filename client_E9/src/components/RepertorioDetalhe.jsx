import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { getRepertorios, getItensPorRepertorio, getMusicas, getCantores,
         criarItem, atualizarItem, removerItem } from "../services/api";
import { useToast } from "../contexts/ToastContext";
import Modal from "./ui/Modal";
import ConfirmDialog from "./ui/ConfirmDialog";
import { SkeletonTable } from "./ui/Skeleton";

const NOTAS = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B","Db","Eb","Gb","Ab","Bb"];

function fmt(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d) ? iso : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

/* Modal de edição de item */
function FormItem({ item, cantores, onSalvar, onCancelar, carregando }) {
  const [cantorId, setCantorId] = useState(String(item.cantor_id || ""));
  const [tom, setTom]           = useState(item.tom_execucao || "");
  return (
    <>
      <div className="field">
        <label>Música</label>
        <input className="input" value={item._musicaNome || `#${item.musica_id}`} disabled style={{ opacity: 0.6 }} />
      </div>
      <div className="field">
        <label htmlFor="ei-cantor">Cantor</label>
        <select id="ei-cantor" className="input select-input" value={cantorId} onChange={e => setCantorId(e.target.value)}>
          <option value="">Sem cantor</option>
          {cantores.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="ei-tom">Tom de execução</label>
        <select id="ei-tom" className="input select-input" value={tom} onChange={e => setTom(e.target.value)}>
          <option value="">Mesmo do original</option>
          {NOTAS.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div className="modal-footer" style={{ border: "none", padding: 0 }}>
        <button className="btn btn-secondary btn-sm" onClick={onCancelar}>Cancelar</button>
        <button className="btn btn-primary btn-sm" onClick={() => onSalvar({ cantorId: cantorId || null, tomExecucao: tom || null })} disabled={carregando}>
          {carregando ? "Salvando..." : "Salvar →"}
        </button>
      </div>
    </>
  );
}

/* Modal de adicionar músicas */
function ModalAdicionarMusicas({ musicas, cantores, repertorioId, idsJaAdicionados, onSalvo, onFechar }) {
  const [busca, setBusca]     = useState("");
  const [selecionadas, setSelecionadas] = useState([]);
  const [cantoresMap, setCantoresMap] = useState({});
  const [salvando, setSalvando] = useState(false);
  const { toast } = useToast();

  const disponiveis = musicas.filter(m =>
    !idsJaAdicionados.includes(m.id) &&
    m.nome.toLowerCase().includes(busca.toLowerCase())
  );

  function toggle(id) {
    setSelecionadas(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
    setCantoresMap(prev => ({ ...prev, [id]: prev[id] || "" }));
  }

  async function adicionar() {
    setSalvando(true);
    try {
      const prox = idsJaAdicionados.length + 1;
      await Promise.all(selecionadas.map((musicaId, i) =>
        criarItem({ repertorioId, musicaId, cantorId: cantoresMap[musicaId] || null, tomExecucao: null, ordem: prox + i })
      ));
      toast.success(`${selecionadas.length} música(s) adicionada(s)!`);
      onSalvo();
    } catch (err) { toast.error(err.message); }
    finally { setSalvando(false); }
  }

  return (
    <Modal titulo="Adicionar Músicas" onClose={onFechar} wide
      footer={
        <>
          <button className="btn btn-secondary btn-sm" onClick={onFechar}>Cancelar</button>
          <button className="btn btn-primary btn-sm" onClick={adicionar} disabled={selecionadas.length === 0 || salvando}>
            {salvando ? "Adicionando..." : `Adicionar ${selecionadas.length > 0 ? `(${selecionadas.length})` : ""} →`}
          </button>
        </>
      }
    >
      <div className="field">
        <input className="input" placeholder="🔍 Buscar música..." value={busca} onChange={e => setBusca(e.target.value)} autoFocus />
      </div>
      <div className="music-select-list">
        {disponiveis.length === 0 && (
          <div style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
            {busca ? "Nenhuma música encontrada." : "Todas as músicas já foram adicionadas."}
          </div>
        )}
        {disponiveis.map(m => (
          <label key={m.id} className="music-select-item">
            <input type="checkbox" checked={selecionadas.includes(m.id)} onChange={() => toggle(m.id)} />
            <div className="music-select-item-info">
              <div className="music-select-item-name">{m.nome}</div>
              {m.tonalidade_original && <div className="music-select-item-tom">Tom: {m.tonalidade_original}</div>}
            </div>
            {selecionadas.includes(m.id) && (
              <select className="input select-input" style={{ maxWidth: 130 }}
                value={cantoresMap[m.id] || ""}
                onChange={e => setCantoresMap(prev => ({ ...prev, [m.id]: e.target.value }))}
                onClick={e => e.stopPropagation()}
              >
                <option value="">Cantor...</option>
                {cantores.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            )}
          </label>
        ))}
      </div>
    </Modal>
  );
}

export default function RepertorioDetalhe() {
  const { id } = useParams();
  const [repertorio, setRepertorio] = useState(null);
  const [itens, setItens]           = useState([]);
  const [musicas, setMusicas]       = useState([]);
  const [cantores, setCantores]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [confirm, setConfirm]       = useState(null);
  const [salvando, setSalvando]     = useState(false);
  const [removendo, setRemovendo]   = useState(false);
  const { toast } = useToast();

  /* Drag & Drop state */
  const dragIdx = useRef(null);

  async function carregar() {
    setLoading(true);
    try {
      const [reps, its, mus, cant] = await Promise.all([
        getRepertorios(), getItensPorRepertorio(id), getMusicas(), getCantores()
      ]);
      setRepertorio(reps.find(r => String(r.id) === String(id)) || null);
      setMusicas(mus);
      setCantores(cant);
      // Enriquecer itens com nomes
      const musicaMap  = Object.fromEntries(mus.map(m  => [m.id,  m.nome]));
      const cantorMap  = Object.fromEntries(cant.map(c => [c.id, c.nome]));
      setItens(its.map(i => ({ ...i, _musicaNome: musicaMap[i.musica_id] || `Música #${i.musica_id}`, _cantorNome: cantorMap[i.cantor_id] || "" })));
    } catch { toast.error("Erro ao carregar repertório."); }
    finally { setLoading(false); }
  }

  useEffect(() => { carregar(); }, [id]);

  /* Drag & drop handlers */
  function onDragStart(idx) { dragIdx.current = idx; }
  function onDragOver(e, idx) {
    e.preventDefault();
    setItens(prev => {
      if (dragIdx.current === null || dragIdx.current === idx) return prev;
      const arr = [...prev];
      const [moved] = arr.splice(dragIdx.current, 1);
      arr.splice(idx, 0, moved);
      dragIdx.current = idx;
      return arr;
    });
  }
  async function onDrop() {
    // Persiste nova ordem no backend
    try {
      await Promise.all(itens.map((item, i) => atualizarItem(item.id, { ordem: i + 1 })));
      toast.success("Ordem salva!");
    } catch { toast.error("Erro ao salvar ordem."); }
    dragIdx.current = null;
  }

  async function salvarEdicao(dados) {
    setSalvando(true);
    try {
      await atualizarItem(editItem.id, dados);
      toast.success("Item atualizado!");
      setEditItem(null);
      await carregar();
    } catch (err) { toast.error(err.message); }
    finally { setSalvando(false); }
  }

  async function confirmarRemocao() {
    setRemovendo(true);
    try {
      await removerItem(confirm);
      toast.success("Música removida da setlist.");
      setConfirm(null);
      await carregar();
    } catch (err) { toast.error(err.message); }
    finally { setRemovendo(false); }
  }

  const idsAdicionados = itens.map(i => i.musica_id);

  if (!loading && !repertorio) {
    return (
      <div>
        <p>Repertório não encontrado. <Link to="/repertorios">Voltar</Link></p>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 20 }}>
        <Link to="/repertorios" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>← Repertórios</Link>
        {repertorio && <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}> › {repertorio.titulo}</span>}
      </div>

      {loading ? (
        <SkeletonTable rows={5} cols={5} />
      ) : (
        <>
          <div className="page-header">
            <div>
              <h1>🎼 {repertorio.titulo}</h1>
              <div className="rep-detail-stats" style={{ marginTop: 8 }}>
                <span className="badge badge-green">🎵 {itens.length} músicas</span>
                <span className="badge">{[...new Set(itens.map(i => i.cantor_id).filter(Boolean))].length} cantores</span>
              </div>
              {repertorio.data_execucao && (
                <div className="rep-detail-date">📅 {fmt(repertorio.data_execucao)}</div>
              )}
            </div>
            <div className="page-header-actions">
              <button className="btn btn-primary" onClick={() => setModalAdicionar(true)}>+ Adicionar Música</button>
            </div>
          </div>

          {itens.length === 0 ? (
            <div className="table-wrap">
              <div className="empty-state">
                <div className="empty-state-icon">🎵</div>
                <h3>Setlist vazia</h3>
                <p>Adicione músicas para montar o repertório.</p>
                <button className="btn btn-primary" onClick={() => setModalAdicionar(true)}>+ Adicionar Música</button>
              </div>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: 32 }} />
                    <th style={{ width: 40 }}>#</th>
                    <th>Música</th>
                    <th>Cantor</th>
                    <th>Tom</th>
                    <th style={{ width: 80 }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((item, idx) => (
                    <tr key={item.id}
                      draggable
                      onDragStart={() => onDragStart(idx)}
                      onDragOver={e => onDragOver(e, idx)}
                      onDrop={onDrop}
                    >
                      <td><span className="drag-handle" title="Arrastar para reordenar">⠿</span></td>
                      <td style={{ color: "var(--text-muted)" }}>{idx + 1}</td>
                      <td><strong>{item._musicaNome}</strong></td>
                      <td>
                        {item._cantorNome ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div className="avatar" style={{ width: 22, height: 22, fontSize: "0.65rem" }}>
                              {item._cantorNome[0].toUpperCase()}
                            </div>
                            {item._cantorNome}
                          </div>
                        ) : <span style={{ color: "var(--text-muted)" }}>—</span>}
                      </td>
                      <td>
                        {item.tom_execucao
                          ? <span className="badge badge-green">{item.tom_execucao}</span>
                          : <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>original</span>}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="btn-icon" title="Editar" onClick={() => setEditItem(item)}>✏️</button>
                          <button className="btn-icon danger" title="Remover" onClick={() => setConfirm(item.id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {modalAdicionar && (
        <ModalAdicionarMusicas
          musicas={musicas} cantores={cantores}
          repertorioId={id} idsJaAdicionados={idsAdicionados}
          onSalvo={() => { setModalAdicionar(false); carregar(); }}
          onFechar={() => setModalAdicionar(false)}
        />
      )}
      {editItem && (
        <Modal titulo="Editar Item" onClose={() => setEditItem(null)}>
          <FormItem item={editItem} cantores={cantores} onSalvar={salvarEdicao} onCancelar={() => setEditItem(null)} carregando={salvando} />
        </Modal>
      )}
      {confirm && (
        <ConfirmDialog mensagem="Remover esta música da setlist?" onConfirmar={confirmarRemocao} onCancelar={() => setConfirm(null)} carregando={removendo} />
      )}
    </div>
  );
}
