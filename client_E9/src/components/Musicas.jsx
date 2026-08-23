import { useState, useEffect, useMemo } from "react";
import { getMusicas, criarMusica, atualizarMusica, removerMusica } from "../services/api";
import { useToast } from "../contexts/ToastContext";
import Modal from "./ui/Modal";
import ConfirmDialog from "./ui/ConfirmDialog";
import { SkeletonTable } from "./ui/Skeleton";
import EmptyState from "./ui/EmptyState";

const NOTAS = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B","Db","Eb","Gb","Ab","Bb"];

function FormMusica({ inicial, onSalvar, onCancelar, carregando }) {
  const [nome, setNome] = useState(inicial?.nome || "");
  const [tom, setTom]   = useState(inicial?.tonalidade_original || "");
  const [bpm, setBpm]   = useState(inicial?.bpm || "");
  return (
    <>
      <div className="field">
        <label htmlFor="m-nome">Título *</label>
        <input id="m-nome" className="input" placeholder="Nome da música" value={nome} onChange={e => setNome(e.target.value)} autoFocus />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="field">
          <label htmlFor="m-tom">Tom Original *</label>
          <select id="m-tom" className="input select-input" value={tom} onChange={e => setTom(e.target.value)}>
            <option value="">Selecione...</option>
            {NOTAS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="m-bpm">BPM (opcional)</label>
          <input id="m-bpm" className="input" type="number" placeholder="ex: 120" min="0" value={bpm} onChange={e => setBpm(e.target.value)} />
        </div>
      </div>
      <div className="modal-footer" style={{ border: "none", padding: 0, marginTop: 4 }}>
        <button className="btn btn-secondary btn-sm" onClick={onCancelar}>Cancelar</button>
        <button className="btn btn-primary btn-sm" onClick={() => onSalvar({ nome, tonalidadeOriginal: tom, bpm: bpm || null })} disabled={!nome.trim() || !tom || carregando}>
          {carregando ? "Salvando..." : "Salvar →"}
        </button>
      </div>
    </>
  );
}

export default function Musicas() {
  const [musicas, setMusicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca]     = useState("");
  const [modal, setModal]     = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [salvando, setSalvando]   = useState(false);
  const [removendo, setRemovendo] = useState(false);
  const { toast } = useToast();

  async function carregar() {
    setLoading(true);
    try { setMusicas(await getMusicas()); }
    catch { toast.error("Erro ao carregar músicas."); }
    finally { setLoading(false); }
  }
  useEffect(() => { carregar(); }, []);

  const filtradas = useMemo(() =>
    musicas.filter(m => m.nome.toLowerCase().includes(busca.toLowerCase())),
    [musicas, busca]
  );

  async function salvar(dados) {
    setSalvando(true);
    try {
      if (modal === "nova") await criarMusica(dados);
      else await atualizarMusica(modal.id, dados);
      toast.success(modal === "nova" ? "Música criada!" : "Música atualizada!");
      setModal(null);
      await carregar();
    } catch (err) { toast.error(err.message); }
    finally { setSalvando(false); }
  }

  async function confirmarRemocao() {
    setRemovendo(true);
    try {
      await removerMusica(confirm);
      toast.success("Música removida.");
      setConfirm(null);
      await carregar();
    } catch (err) { toast.error(err.message); }
    finally { setRemovendo(false); }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>🎵 Músicas</h1>
          <p>{musicas.length} música(s) cadastrada(s)</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setModal("nova")}>+ Nova Música</button>
        </div>
      </div>

      <div className="page-controls">
        <input className="input" placeholder="🔍 Buscar música..." value={busca} onChange={e => setBusca(e.target.value)} />
      </div>

      {loading ? <SkeletonTable rows={5} cols={4} /> : filtradas.length === 0 ? (
        <EmptyState icone="🎵" titulo="Nenhuma música encontrada"
          descricao={busca ? "Tente outro título." : "Adicione a primeira música!"}
          acao={!busca && <button className="btn btn-primary" onClick={() => setModal("nova")}>+ Nova Música</button>} />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Título</th>
                <th>Tom</th>
                <th>BPM</th>
                <th style={{ width: 80 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((m, idx) => (
                <tr key={m.id}>
                  <td style={{ color: "var(--text-muted)" }}>{idx + 1}</td>
                  <td><strong>{m.nome}</strong></td>
                  <td><span className="badge badge-green">{m.tonalidade_original || "—"}</span></td>
                  <td style={{ color: "var(--text-muted)" }}>{m.bpm || "—"}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon" title="Editar" onClick={() => setModal(m)}>✏️</button>
                      <button className="btn-icon danger" title="Remover" onClick={() => setConfirm(m.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal titulo={modal === "nova" ? "Nova Música" : "Editar Música"} onClose={() => setModal(null)}>
          <FormMusica inicial={modal !== "nova" ? modal : null} onSalvar={salvar} onCancelar={() => setModal(null)} carregando={salvando} />
        </Modal>
      )}
      {confirm && (
        <ConfirmDialog mensagem="Deseja remover esta música?" onConfirmar={confirmarRemocao} onCancelar={() => setConfirm(null)} carregando={removendo} />
      )}
    </div>
  );
}
