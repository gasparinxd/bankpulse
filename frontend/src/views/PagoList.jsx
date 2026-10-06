export default function PagoList({ pagos }) {
  return (
    <section className="card">
      <h2>Historial de pagos</h2>
      {pagos.length === 0 ? (
        <p>No hay pagos registrados.</p>
      ) : (
        <table>
          <thead>
            <tr><th>#</th><th>Emisor</th><th>Receptor</th><th>Monto</th><th>Estado</th><th>Fecha</th></tr>
          </thead>
          <tbody>
            {pagos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.emisor}</td>
                <td>{p.receptor}</td>
                <td>{p.monto.toFixed(2)} {p.moneda}</td>
                <td>{p.estado}</td>
                <td>{new Date(p.creadoEn).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
