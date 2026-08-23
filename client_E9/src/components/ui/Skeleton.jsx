export function SkeletonLine({ h = 14, w = "100%" }) {
  return <div className="skeleton" style={{ height: h, width: w, marginBottom: 4 }} />;
}
export function SkeletonTable({ rows = 4, cols = 4 }) {
  return (
    <div className="table-wrap">
      <table className="table"><tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>{Array.from({ length: cols }).map((_, j) => <td key={j}><SkeletonLine /></td>)}</tr>
        ))}
      </tbody></table>
    </div>
  );
}
