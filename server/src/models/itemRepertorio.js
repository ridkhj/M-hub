let itensRepertorio = [];
let nextItemId = 1;

export const itemRepertorioModel = {
  listarTodas() {
    return itensRepertorio;
  },

  listarPorRepertorio(repertorioId) {
    return itensRepertorio.filter(i => i.repertorioId === repertorioId);
  },

  buscarPorId(id) {
    return itensRepertorio.find(i => i.id === id) || null;
  },

  inserir({ ordem, musicaId, cantorId, tomExecucao, repertorioId }) {
    const nova = {
      id: nextItemId++,
      ordem: Number(ordem),
      musicaId: Number(musicaId),
      cantorId: Number(cantorId),
      tomExecucao,
      repertorioId: Number(repertorioId),
      criadoEm: new Date().toISOString(),
    };
    itensRepertorio.push(nova);
    return nova;
  },

  atualizar(id, dados) {
    const idx = itensRepertorio.findIndex(i => i.id === id);
    if (idx === -1) return null;
    itensRepertorio[idx] = { ...itensRepertorio[idx], ...dados, id };
    return itensRepertorio[idx];
  },

  remover(id) {
    const len = itensRepertorio.length;
    itensRepertorio = itensRepertorio.filter(i => i.id !== id);
    return itensRepertorio.length < len;
  },
};