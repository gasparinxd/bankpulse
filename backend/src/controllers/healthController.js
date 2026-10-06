const { pool } = require('../config/db');

async function health(req, res) {
  let database = 'UP';
  try {
    await pool.query('SELECT 1');
  } catch {
    database = 'DOWN';
  }
  res.status(200).json({ status: 'UP', database, timestamp: new Date().toISOString() });
}

module.exports = { health };
