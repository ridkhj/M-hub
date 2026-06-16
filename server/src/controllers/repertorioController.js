import { repertorioService } from '../services/repertorioService.js';

export const repertorioController = {
  listarTodos(req, res) {
    const repertorios = repertorioService.listarTodos();
    res.json(repertorios);
  },

  buscarPorId(req, res) {
    const repertorio = repertorioService.buscarPorId(Number(req.params.id));
    res.json(repertorio);
  },

  criar(req, res) {
    const novo = repertorioService.criar(req.body);
    res.status(201).json(novo);
  },

  atualizar(req, res) {
    const atualizado = repertorioService.atualizar(Number(req.params.id), req.body);
    res.json(atualizado);
  },

  remover(req, res) {
    repertorioService.remover(Number(req.params.id));
    res.status(204).end();
  },
};