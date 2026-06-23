import { db } from '../db.js';

export const itemRepertorioModel = {
  listarTodas() {
    return db.prepare('SELECT * FROM itens_repertorio ORDER BY ordem ASC').all();
  },

  listarPorRepertorio(repertorioId) {
    return db.prepare('SELECT * FROM itens_repertorio WHERE repertorio_id = ? ORDER BY ordem ASC')
      .all(Number(repertorioId));
  },

  buscarPorId(id) {
    return db.prepare('SELECT * FROM itens_repertorio WHERE id = ?').get(Number(id)) || null;
  },

  inserir({ ordem, musicaId, cantorId, tomExecucao, repertorioId }) {
    const r = db.prepare(
      `INSERT INTO itens_repertorio (ordem, musica_id, cantor_id, tom_execucao, repertorio_id, criado_em)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      Number(ordem),
      Number(musicaId),
      cantorId ? Number(cantorId) : null,
      tomExecucao ?? null,
      Number(repertorioId),
      new Date().toISOString()
    );
    return this.buscarPorId(r.lastInsertRowid);
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados, id };
    db.prepare(
      'UPDATE itens_repertorio SET ordem = ?, musica_id = ?, cantor_id = ?, tom_execucao = ?, repertorio_id = ? WHERE id = ?'
    ).run(Number(novo.ordem), Number(novo.musica_id ?? novo.musicaId), novo.cantor_id ? Number(novo.cantor_id) : (novo.cantorId ? Number(novo.cantorId) : null), novo.tom_execucao ?? novo.tomExecucao ?? null, Number(novo.repertorio_id ?? novo.repertorioId), id);
    return this.buscarPorId(id);
  },

  remover(id) {
    return db.prepare('DELETE FROM itens_repertorio WHERE id = ?').run(id).changes > 0;
  },
};