// Capa de Vista del backend: define cómo se representa un pago en la respuesta JSON.
function render(pago) {
  return {
    id: pago.id,
    emisor: pago.emisor,
    receptor: pago.receptor,
    monto: Number(pago.monto),
    moneda: pago.moneda,
    estado: pago.estado,
    creadoEn: pago.creado_en,
  };
}

function renderMany(pagos) {
  return pagos.map(render);
}

module.exports = { render, renderMany };
