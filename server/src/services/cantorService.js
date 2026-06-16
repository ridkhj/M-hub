import { cantorModel } from '../models/cantor.js';

export const cantorService = {
  listarTodos() {
    return cantorModel.listarTodas();
  },

  buscarPorId(id) {
    const cantor = cantorModel.buscarPorId(Number(id));
    if (!cantor) {
      const err = new Error('Cantor não encontrado');
      err.status = 404;
      throw err;
    }
    return cantor;
  },

  criar({ nome, sexo }) {
    if (!nome || !sexo) {
      const err = new Error('Os campos "nome" e "sexo" são obrigatórios');
      err.status = 400;
      throw err;
    }

    return cantorModel.inserir({ nome, sexo });
  },

  atualizar(id, dados) {
    const atualizado = cantorModel.atualizar(Number(id), dados);
    if (!atualizado) {
      const err = new Error('Cantor não encontrado');
      err.status = 404;
      throw err;
    }
    return atualizado;
  },

  remover(id) {
    const removido = cantorModel.remover(Number(id));
    if (!removido) {
      const err = new Error('Cantor não encontrado');
      err.status = 404;
      throw err;
    }
  },
};