export default function EmptyState({ icone, titulo, descricao, acao }) {
  return (
    <div className="table-wrap">
      <div className="empty-state">
        <div className="empty-state-icon">{icone}</div>
        <h3>{titulo}</h3>
        {descricao && <p>{descricao}</p>}
        {acao}
      </div>
    </div>
  );
}
