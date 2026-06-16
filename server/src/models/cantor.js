let cantores = [];
let nextCantorId = 1;

export const cantorModel = {
  listarTodas() {
    return cantores;
  },

  buscarPorId(id) {
    return cantores.find(c => c.id === id) || null;
  },

  inserir({ nome, sexo }) {
    const nova = {
      id: nextCantorId++,
      nome,
      sexo,
      criadaEm: new Date().toISOString(),
    };
    cantores.push(nova);
    return nova;
  },

  atualizar(id, dados) {
    const idx = cantores.findIndex(c => c.id === id);
    if (idx === -1) return null;
    cantores[idx] = { ...cantores[idx], ...dados, id };
    return cantores[idx];
  },

  remover(id) {
    const len = cantores.length;
    cantores = cantores.filter(c => c.id !== id);
    return cantores.length < len;
  },
};