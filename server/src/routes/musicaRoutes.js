import { Router } from 'express';
import { musicaController } from '../controllers/musicaController.js';

const router = Router();

router.get('/',    musicaController.listarTodas);
router.get('/:id', musicaController.buscarPorId);
router.post('/',   musicaController.criar);
router.put('/:id', musicaController.atualizar);
router.delete('/:id', musicaController.remover);

export default router;