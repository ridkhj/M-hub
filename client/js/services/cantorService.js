import { api } from '../api.js';

const SEXOS_VALIDOS = ['M', 'F'];

export const cantorService = {
  listar() {
    return api.getCantores();
  },

  async criar({ nome, sexo }) {
    if (!nome || !nome.trim()) throw new Error('O nome do cantor é obrigatório');
    if (!sexo || !SEXOS_VALIDOS.includes(sexo)) throw new Error('Sexo inválido. Escolha M ou F');

    return api.criarCantor({
      nome: nome.trim(),
      sexo,
    });
  },

  async atualizar(id, dados) {
    return api.atualizarCantor(id, dados);
  },

  remover(id) {
    return api.removerCantor(id);
  },
};