const { pool } = require('../config/db');

const ESTADOS = ['PENDIENTE', 'COMPLETADO', 'RECHAZADO'];

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pagos (
      id SERIAL PRIMARY KEY,
      emisor VARCHAR(100) NOT NULL,
      receptor VARCHAR(100) NOT NULL,
      monto NUMERIC(12, 2) NOT NULL CHECK (monto > 0),
      moneda CHAR(3) NOT NULL DEFAULT 'USD',
      estado VARCHAR(20) NOT NULL DEFAULT 'COMPLETADO',
      creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function validar({ emisor, receptor, monto, moneda }) {
  const errores = [];
  if (!emisor || typeof emisor !== 'string') errores.push('emisor es obligatorio');
  if (!receptor || typeof receptor !== 'string') errores.push('receptor es obligatorio');
  if (emisor && receptor && emisor === receptor) errores.push('emisor y receptor deben ser distintos');
  if (!(Number(monto) > 0)) errores.push('monto debe ser un número mayor que 0');
  if (moneda !== undefined && !/^[A-Z]{3}$/.test(moneda)) errores.push('moneda debe ser un código ISO de 3 letras');
  return errores;
}

async function crear({ emisor, receptor, monto, moneda = 'USD' }) {
  const { rows } = await pool.query(
    `INSERT INTO pagos (emisor, receptor, monto, moneda)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [emisor, receptor, monto, moneda]
  );
  return rows[0];
}

async function listar() {
  const { rows } = await pool.query('SELECT * FROM pagos ORDER BY creado_en DESC');
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query('SELECT * FROM pagos WHERE id = $1', [id]);
  return rows[0] || null;
}

module.exports = { ESTADOS, init, validar, crear, listar, buscarPorId };
