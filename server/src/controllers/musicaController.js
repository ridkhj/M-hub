import { musicaService } from '../services/musicaService.js';

export const musicaController = {
  listarTodas(req, res) {
    const musicas = musicaService.listarTodas();
    res.json(musicas);
  },

  buscarPorId(req, res) {
    const musica = musicaService.buscarPorId(Number(req.params.id));
    res.json(musica);
  },

  criar(req, res) {
    const nova = musicaService.criar(req.body);
    res.status(201).json(nova);
  },

  atualizar(req, res) {
    const atualizada = musicaService.atualizar(Number(req.params.id), req.body);
    res.json(atualizada);
  },

  remover(req, res) {
    musicaService.remover(Number(req.params.id));
    res.status(204).end();
  },
};