import { itemRepertorioModel } from '../models/itemRepertorio.js';

export const itemRepertorioService = {
  listarTodos() {
    return itemRepertorioModel.listarTodas();
  },

  listarPorRepertorio(repertorioId) {
    return itemRepertorioModel.listarPorRepertorio(Number(repertorioId));
  },

  buscarPorId(id) {
    const item = itemRepertorioModel.buscarPorId(Number(id));
    if (!item) {
      const err = new Error('Item do repertório não encontrado');
      err.status = 404;
      throw err;
    }
    return item;
  },

  criar({ ordem, musicaId, cantorId, tomExecucao, repertorioId }) {
    if (ordem === undefined || !musicaId || !cantorId || !repertorioId || !tomExecucao) {
      const err = new Error('Os campos "ordem", "musicaId", "cantorId", "tomExecucao" e "repertorioId" são obrigatórios');
      err.status = 400;
      throw err;
    }

    return itemRepertorioModel.inserir({ ordem, musicaId, cantorId, tomExecucao, repertorioId });
  },

  atualizar(id, dados) {
    const atualizado = itemRepertorioModel.atualizar(Number(id), dados);
    if (!atualizado) {
      const err = new Error('Item do repertório não encontrado');
      err.status = 404;
      throw err;
    }
    return atualizado;
  },

  remover(id) {
    const removido = itemRepertorioModel.remover(Number(id));
    if (!removido) {
      const err = new Error('Item do repertório não encontrado');
      err.status = 404;
      throw err;
    }
  },
};