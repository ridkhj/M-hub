import { Router } from 'express';
import { itemRepertorioController } from '../controllers/itemRepertorioController.js';

const router = Router();

router.get('/',    itemRepertorioController.listarTodos);
router.get('/repertorio/:repertorioId', itemRepertorioController.listarPorRepertorio);
router.get('/:id', itemRepertorioController.buscarPorId);
router.post('/',   itemRepertorioController.criar);
router.put('/:id', itemRepertorioController.atualizar);
router.delete('/:id', itemRepertorioController.remover);

export default router;