import { useState, useEffect, useMemo } from "react";
import { getCantores, criarCantor, atualizarCantor, removerCantor } from "../services/api";
import { useToast } from "../contexts/ToastContext";
import Modal from "./ui/Modal";
import ConfirmDialog from "./ui/ConfirmDialog";
import { SkeletonTable } from "./ui/Skeleton";
import EmptyState from "./ui/EmptyState";

const SEXO = { M: "Masculino", F: "Feminino" };

function FormCantor({ inicial, onSalvar, onCancelar, carregando }) {
  const [nome, setNome] = useState(inicial?.nome || "");
  const [sexo, setSexo] = useState(inicial?.sexo || "");
  return (
    <>
      <div className="field">
        <label htmlFor="c-nome">Nome *</label>
        <input id="c-nome" className="input" placeholder="Nome do cantor" value={nome} onChange={e => setNome(e.target.value)} autoFocus />
      </div>
      <div className="field">
        <label htmlFor="c-sexo">Sexo</label>
        <select id="c-sexo" className="input select-input" value={sexo} onChange={e => setSexo(e.target.value)}>
          <option value="">Selecione...</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
        </select>
      </div>
      <div className="modal-footer" style={{ border: "none", padding: 0, marginTop: 4 }}>
        <button className="btn btn-secondary btn-sm" onClick={onCancelar}>Cancelar</button>
        <button className="btn btn-primary btn-sm" onClick={() => onSalvar({ nome, sexo })} disabled={!nome.trim() || carregando}>
          {carregando ? "Salvando..." : "Salvar →"}
        </button>
      </div>
    </>
  );
}

export default function Cantores() {
  const [cantores, setCantores] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [busca, setBusca]       = useState("");
  const [modal, setModal]       = useState(null); // null | "novo" | cantor
  const [confirm, setConfirm]   = useState(null); // id a remover
  const [salvando, setSalvando] = useState(false);
  const [removendo, setRemovendo] = useState(false);
  const { toast } = useToast();

  async function carregar() {
    setLoading(true);
    try { setCantores(await getCantores()); }
    catch { toast.error("Erro ao carregar cantores."); }
    finally { setLoading(false); }
  }
  useEffect(() => { carregar(); }, []);

  const filtrados = useMemo(() =>
    cantores.filter(c => c.nome.toLowerCase().includes(busca.toLowerCase())),
    [cantores, busca]
  );

  async function salvar(dados) {
    setSalvando(true);
    try {
      if (modal === "novo") await criarCantor(dados);
      else await atualizarCantor(modal.id, dados);
      toast.success(modal === "novo" ? "Cantor criado!" : "Cantor atualizado!");
      setModal(null);
      await carregar();
    } catch (err) { toast.error(err.message); }
    finally { setSalvando(false); }
  }

  async function confirmarRemocao() {
    setRemovendo(true);
    try {
      await removerCantor(confirm);
      toast.success("Cantor removido.");
      setConfirm(null);
      await carregar();
    } catch (err) { toast.error(err.message); }
    finally { setRemovendo(false); }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>🎤 Cantores</h1>
          <p>{cantores.length} cantor(es) cadastrado(s)</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setModal("novo")}>+ Novo Cantor</button>
        </div>
      </div>

      <div className="page-controls">
        <input className="input" placeholder="🔍 Buscar cantor..." value={busca} onChange={e => setBusca(e.target.value)} />
      </div>

      {loading ? <SkeletonTable rows={4} cols={3} /> : filtrados.length === 0 ? (
        <EmptyState icone="🎤" titulo="Nenhum cantor encontrado"
          descricao={busca ? "Tente um nome diferente." : "Adicione o primeiro cantor!"}
          acao={!busca && <button className="btn btn-primary" onClick={() => setModal("novo")}>+ Novo Cantor</button>} />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Cantor</th>
                <th>Sexo</th>
                <th style={{ width: 80 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="avatar">{c.nome[0].toUpperCase()}</div>
                      <strong>{c.nome}</strong>
                    </div>
                  </td>
                  <td>{SEXO[c.sexo] || "—"}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon" title="Editar" onClick={() => setModal(c)}>✏️</button>
                      <button className="btn-icon danger" title="Remover" onClick={() => setConfirm(c.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal titulo={modal === "novo" ? "Novo Cantor" : "Editar Cantor"} onClose={() => setModal(null)}>
          <FormCantor inicial={modal !== "novo" ? modal : null} onSalvar={salvar} onCancelar={() => setModal(null)} carregando={salvando} />
        </Modal>
      )}
      {confirm && (
        <ConfirmDialog mensagem="Deseja remover este cantor?" onConfirmar={confirmarRemocao} onCancelar={() => setConfirm(null)} carregando={removendo} />
      )}
    </div>
  );
}
