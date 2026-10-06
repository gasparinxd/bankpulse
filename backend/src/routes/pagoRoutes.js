const { Router } = require('express');
const pagoController = require('../controllers/pagoController');

const router = Router();
router.post('/', pagoController.crear);
router.get('/', pagoController.listar);
router.get('/:id', pagoController.obtener);

module.exports = router;
