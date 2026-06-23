import { api } from '../api.js';

export const repertorioService = {
  listar() {
    return api.getRepertorios();
  },

  async criar({ titulo, dataExecucao }) {
    if (!titulo || !titulo.trim()) throw new Error('O título do repertório é obrigatório');
    if (!dataExecucao) throw new Error('A data de execução é obrigatória');

    return api.criarRepertorio({
      titulo: titulo.trim(),
      dataExecucao,
    });
  },

  async atualizar(id, dados) {
    return api.atualizarRepertorio(id, dados);
  },

  remover(id) {
    return api.removerRepertorio(id);
  },
};