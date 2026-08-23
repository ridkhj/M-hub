import Modal from "./Modal";
export default function ConfirmDialog({ mensagem, onConfirmar, onCancelar, carregando }) {
  return (
    <Modal
      titulo="Confirmar exclusão"
      onClose={onCancelar}
      footer={
        <>
          <button className="btn btn-secondary btn-sm" onClick={onCancelar}>Cancelar</button>
          <button className="btn btn-danger btn-sm" onClick={onConfirmar} disabled={carregando}>
            {carregando ? "Removendo..." : "🗑️ Remover"}
          </button>
        </>
      }
    >
      <div className="confirm-body">
        <div className="confirm-icon">🗑️</div>
        <p className="confirm-msg">{mensagem}</p>
        <p className="confirm-msg" style={{ fontSize: "0.78rem", opacity: 0.7 }}>Esta ação não pode ser desfeita.</p>
      </div>
    </Modal>
  );
}
