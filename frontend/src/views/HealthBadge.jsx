export default function HealthBadge({ health }) {
  if (!health) return <span className="badge">Comprobando…</span>;
  const ok = health.status === 'UP';
  return <span className={`badge ${ok ? 'up' : 'down'}`}>API {ok ? 'operativa' : 'no disponible'}</span>;
}
