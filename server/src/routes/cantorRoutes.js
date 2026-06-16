import { Router } from 'express';
import { cantorController } from '../controllers/cantorController.js';

const router = Router();

router.get('/',    cantorController.listarTodos);
router.get('/:id', cantorController.buscarPorId);
router.post('/',   cantorController.criar);
router.put('/:id', cantorController.atualizar);
router.delete('/:id', cantorController.remover);

export default router;