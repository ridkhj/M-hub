import { Router } from 'express';
import { repertorioController } from '../controllers/repertorioController.js';

const router = Router();

router.get('/',    repertorioController.listarTodos);
router.get('/:id', repertorioController.buscarPorId);
router.post('/',   repertorioController.criar);
router.put('/:id', repertorioController.atualizar);
router.delete('/:id', repertorioController.remover);

export default router;