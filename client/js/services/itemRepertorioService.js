import { api } from '../api.js';

export const itemRepertorioService = {
  listar() {
    return api.getItensRepertorio();
  },

  listarPorRepertorio(repertorioId) {
    return api.getItensPorRepertorio(repertorioId);
  },

  async criar({ ordem, musicaId, cantorId, tomExecucao, repertorioId }) {
    if (ordem === '' || ordem === null || isNaN(Number(ordem))) throw new Error('A ordem deve ser um número válido');
    if (!musicaId) throw new Error('Selecione uma música');
    if (!cantorId) throw new Error('Selecione um cantor');
    if (!repertorioId) throw new Error('Selecione um repertório');
    if (!tomExecucao || !tomExecucao.trim()) throw new Error('O tom de execução é obrigatório');

    return api.criarItemRepertorio({
      ordem: Number(ordem),
      musicaId: Number(musicaId),
      cantorId: Number(cantorId),
      tomExecucao: tomExecucao.trim(),
      repertorioId: Number(repertorioId),
    });
  },

  async atualizar(id, dados) {
    return api.atualizarItemRepertorio(id, dados);
  },

  remover(id) {
    return api.removerItemRepertorio(id);
  },
};