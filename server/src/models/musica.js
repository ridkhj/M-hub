import { db } from '../db.js';

export const musicaModel = {
  listarTodas() {
    return db.prepare('SELECT * FROM musicas').all();
  },

  buscarPorId(id) {
    return db.prepare('SELECT * FROM musicas WHERE id = ?').get(Number(id)) || null;
  },

  inserir({ nome, bpm, tonalidadeOriginal }) {
    const r = db.prepare(
      `INSERT INTO musicas (nome, bpm, tonalidade_original, criada_em)
       VALUES (?, ?, ?, ?)`
    ).run(nome, bpm ? Number(bpm) : null, tonalidadeOriginal, new Date().toISOString());
    return this.buscarPorId(r.lastInsertRowid);
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados, id };
    const tonalidade = novo.tonalidadeOriginal ?? novo.tonalidade_original ?? null;
    db.prepare('UPDATE musicas SET nome = ?, bpm = ?, tonalidade_original = ? WHERE id = ?')
      .run(novo.nome, novo.bpm ? Number(novo.bpm) : null, tonalidade, id);
    return this.buscarPorId(id);
  },

  remover(id) {
    return db.prepare('DELETE FROM musicas WHERE id = ?').run(id).changes > 0;
  },
};