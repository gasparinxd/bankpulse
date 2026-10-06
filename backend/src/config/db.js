const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Reintenta la conexión hasta que PostgreSQL esté disponible.
async function waitForDatabase(retries = 15, delayMs = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await pool.query('SELECT 1');
      console.log('[db] Conexión a PostgreSQL establecida');
      return;
    } catch (err) {
      console.log(`[db] PostgreSQL no disponible (intento ${attempt}/${retries}): ${err.message}`);
      await sleep(delayMs);
    }
  }
  throw new Error('No se pudo conectar a PostgreSQL');
}

module.exports = { pool, waitForDatabase };
