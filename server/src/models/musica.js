let musicas = [];
let nextMusicaId = 1;

export const musicaModel = {
  listarTodas() {
    return musicas;
  },

  buscarPorId(id) {
    return musicas.find(m => m.id === id) || null;
  },

  inserir({ nome, bpm, tonalidadeOriginal }) {
    const nova = {
      id: nextMusicaId++,
      nome,
      bpm: Number(bpm),
      tonalidadeOriginal,
      criadaEm: new Date().toISOString(),
    };
    musicas.push(nova);
    return nova;
  },

  atualizar(id, dados) {
    const idx = musicas.findIndex(m => m.id === id);
    if (idx === -1) return null;
    musicas[idx] = { ...musicas[idx], ...dados, id };
    return musicas[idx];
  },

  remover(id) {
    const len = musicas.length;
    musicas = musicas.filter(m => m.id !== id);
    return musicas.length < len;
  },
};