import { useCallback, useEffect, useState } from 'react';
import { pagoModel } from '../models/pagoModel';

// Controlador: coordina el estado de la vista con el modelo.
export function usePagosController() {
  const [pagos, setPagos] = useState([]);
  const [health, setHealth] = useState(null);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cargar = useCallback(async () => {
    try {
      const [listado, estado] = await Promise.all([pagoModel.listar(), pagoModel.health()]);
      setPagos(listado);
      setHealth(estado);
      setError('');
    } catch (err) {
      setHealth({ status: 'DOWN' });
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const crearPago = async (pago) => {
    setEnviando(true);
    try {
      const nuevo = await pagoModel.crear(pago);
      setPagos((prev) => [nuevo, ...prev]);
      setError('');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setEnviando(false);
    }
  };

  return { pagos, health, error, enviando, crearPago };
}
