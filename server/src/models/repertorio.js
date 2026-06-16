let repertorios = [];
let nextRepertorioId = 1;

export const repertorioModel = {
  listarTodas() {
    return repertorios;
  },

  buscarPorId(id) {
    return repertorios.find(r => r.id === id) || null;
  },

  inserir({ titulo, dataExecucao }) {
    const nova = {
      id: nextRepertorioId++,
      titulo,
      dataExecucao,
      criadaEm: new Date().toISOString(),
    };
    repertorios.push(nova);
    return nova;
  },

  atualizar(id, dados) {
    const idx = repertorios.findIndex(r => r.id === id);
    if (idx === -1) return null;
    repertorios[idx] = { ...repertorios[idx], ...dados, id };
    return repertorios[idx];
  },

  remover(id) {
    const len = repertorios.length;
    repertorios = repertorios.filter(r => r.id !== id);
    return repertorios.length < len;
  },
};