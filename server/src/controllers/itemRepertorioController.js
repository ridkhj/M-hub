import { itemRepertorioService } from '../services/itemRepertorioService.js';

export const itemRepertorioController = {
  listarTodos(req, res) {
    const itens = itemRepertorioService.listarTodos();
    res.json(itens);
  },

  listarPorRepertorio(req, res) {
    const itens = itemRepertorioService.listarPorRepertorio(Number(req.params.repertorioId));
    res.json(itens);
  },

  buscarPorId(req, res) {
    const item = itemRepertorioService.buscarPorId(Number(req.params.id));
    res.json(item);
  },

  criar(req, res) {
    const novo = itemRepertorioService.criar(req.body);
    res.status(201).json(novo);
  },

  atualizar(req, res) {
    const atualizado = itemRepertorioService.atualizar(Number(req.params.id), req.body);
    res.json(atualizado);
  },

  remover(req, res) {
    itemRepertorioService.remover(Number(req.params.id));
    res.status(204).end();
  },
};