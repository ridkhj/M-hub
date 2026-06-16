import { cantorService } from '../services/cantorService.js';

export const cantorController = {
  listarTodos(req, res) {
    const cantores = cantorService.listarTodos();
    res.json(cantores);
  },

  buscarPorId(req, res) {
    const cantor = cantorService.buscarPorId(Number(req.params.id));
    res.json(cantor);
  },

  criar(req, res) {
    const novo = cantorService.criar(req.body);
    res.status(201).json(novo);
  },

  atualizar(req, res) {
    const atualizado = cantorService.atualizar(Number(req.params.id), req.body);
    res.json(atualizado);
  },

  remover(req, res) {
    cantorService.remover(Number(req.params.id));
    res.status(204).end();
  },
};