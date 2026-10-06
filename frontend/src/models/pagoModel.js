// Modelo: acceso a datos de pagos a través de la API REST.
async function request(url, options) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.errores?.join(', ') || data.error || `Error HTTP ${res.status}`);
  }
  return data;
}

export const pagoModel = {
  listar: () => request('/api/pagos'),
  crear: (pago) =>
    request('/api/pagos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pago),
    }),
  health: () => request('/health'),
};
