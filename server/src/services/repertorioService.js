import { repertorioModel } from '../models/repertorio.js';

export const repertorioService = {
  listarTodos() {
    return repertorioModel.listarTodas();
  },

  buscarPorId(id) {
    const repertorio = repertorioModel.buscarPorId(Number(id));
    if (!repertorio) {
      const err = new Error('Repertório não encontrado');
      err.status = 404;
      throw err;
    }
    return repertorio;
  },

  criar({ titulo, dataExecucao }) {
    if (!titulo || !dataExecucao) {
      const err = new Error('Os campos "titulo" e "dataExecucao" são obrigatórios');
      err.status = 400;
      throw err;
    }

    return repertorioModel.inserir({ titulo, dataExecucao });
  },

  atualizar(id, dados) {
    const atualizado = repertorioModel.atualizar(Number(id), dados);
    if (!atualizado) {
      const err = new Error('Repertório não encontrado');
      err.status = 404;
      throw err;
    }
    return atualizado;
  },

  remover(id) {
    const removido = repertorioModel.remover(Number(id));
    if (!removido) {
      const err = new Error('Repertório não encontrado');
      err.status = 404;
      throw err;
    }
  },
};