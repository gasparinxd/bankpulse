const { pool } = require('../config/db');
const { version } = require('../../package.json');

async function health(req, res) {
  let database = 'UP';
  try {
    await pool.query('SELECT 1');
  } catch {
    database = 'DOWN';
  }
  res.status(200).json({
    status: 'UP',
    service: 'bankpulse-backend',
    version,
    database,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}

module.exports = { health };
