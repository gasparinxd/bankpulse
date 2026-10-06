import { usePagosController } from './controllers/usePagosController';
import HealthBadge from './views/HealthBadge';
import PagoForm from './views/PagoForm';
import PagoList from './views/PagoList';

export default function App() {
  const { pagos, health, error, enviando, crearPago } = usePagosController();

  return (
    <main className="container">
      <header>
        <h1>BankPulse</h1>
        <HealthBadge health={health} />
      </header>
      <PagoForm onSubmit={crearPago} enviando={enviando} />
      {error && <p className="error">{error}</p>}
      <PagoList pagos={pagos} />
    </main>
  );
}
