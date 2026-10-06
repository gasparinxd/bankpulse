import { useState } from 'react';

const INICIAL = { emisor: '', receptor: '', monto: '', moneda: 'USD' };

export default function PagoForm({ onSubmit, enviando }) {
  const [form, setForm] = useState(INICIAL);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    const ok = await onSubmit({ ...form, monto: Number(form.monto) });
    if (ok) setForm(INICIAL);
  };

  return (
    <form className="card" onSubmit={enviar}>
      <h2>Nuevo pago</h2>
      <input name="emisor" placeholder="Emisor" value={form.emisor} onChange={cambiar} required />
      <input name="receptor" placeholder="Receptor" value={form.receptor} onChange={cambiar} required />
      <input name="monto" type="number" min="0.01" step="0.01" placeholder="Monto" value={form.monto} onChange={cambiar} required />
      <select name="moneda" value={form.moneda} onChange={cambiar}>
        <option>USD</option>
        <option>EUR</option>
        <option>CLP</option>
      </select>
      <button type="submit" disabled={enviando}>{enviando ? 'Enviando…' : 'Pagar'}</button>
    </form>
  );
}
