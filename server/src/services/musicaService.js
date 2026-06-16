
import { musicaModel } from '../models/musica.js';

export const musicaService = {
  listarTodas() {
    return musicaModel.listarTodas();
  },

  buscarPorId(id) {
    const musica = musicaModel.buscarPorId(Number(id));
    if (!musica) {
      const err = new Error('Música não encontrada');
      err.status = 404;
      throw err;
    }
    return musica;
  },

  criar({ nome, bpm, tonalidadeOriginal }) {
    if (!nome) {
      const err = new Error('O campo "nome" é obrigatório');
      err.status = 400;
      throw err;
    }

    return musicaModel.inserir({ nome, bpm, tonalidadeOriginal });
  },

  atualizar(id, dados) {
    const atualizado = musicaModel.atualizar(Number(id), dados);
    if (!atualizado) {
      const err = new Error('Música não encontrada');
      err.status = 404;
      throw err;
    }
    return atualizado;
  },

  remover(id) {
    const removido = musicaModel.remover(Number(id));
    if (!removido) {
      const err = new Error('Música não encontrada');
      err.status = 404;
      throw err;
    }
  },
};