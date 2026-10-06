const Pago = require('../models/pagoModel');
const pagoView = require('../views/pagoView');

async function crear(req, res, next) {
  try {
    const errores = Pago.validar(req.body);
    if (errores.length) return res.status(400).json({ errores });
    const pago = await Pago.crear(req.body);
    res.status(201).json(pagoView.render(pago));
  } catch (err) {
    next(err);
  }
}

async function listar(req, res, next) {
  try {
    res.json(pagoView.renderMany(await Pago.listar()));
  } catch (err) {
    next(err);
  }
}

async function obtener(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'id inválido' });
    const pago = await Pago.buscarPorId(id);
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
    res.json(pagoView.render(pago));
  } catch (err) {
    next(err);
  }
}

module.exports = { crear, listar, obtener };
