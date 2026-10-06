const app = require('./app');
const { waitForDatabase } = require('./config/db');
const Pago = require('./models/pagoModel');

const PORT = Number(process.env.PORT || 3000);

async function start() {
  await waitForDatabase();
  await Pago.init();
  app.listen(PORT, () => console.log(`[api] BankPulse escuchando en el puerto ${PORT}`));
}

start().catch((err) => {
  console.error('[api] Error al iniciar:', err.message);
  process.exit(1);
});
