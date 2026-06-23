
import { api } from '../api.js';

export const musicaService = {
  listar() {
    return api.getMusicas();
  },

  async criar({ nome, bpm, tonalidadeOriginal }) {
    if (!nome || !nome.trim()) throw new Error('O nome da música é obrigatório');
    if (!tonalidadeOriginal || !tonalidadeOriginal.trim()) throw new Error('A tonalidade original é obrigatória');

    return api.criarMusica({
      nome: nome.trim(),
      bpm: bpm ? Number(bpm) : null,
      tonalidadeOriginal: tonalidadeOriginal.trim(),
    });
  },

  async atualizar(id, dados) {
    return api.atualizarMusica(id, dados);
  },

  remover(id) {
    return api.removerMusica(id);
  },
};