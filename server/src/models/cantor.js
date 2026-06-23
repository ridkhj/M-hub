import { db } from '../db.js';

export const cantorModel = {
  listarTodas() {
    return db.prepare('SELECT * FROM cantores').all();
  },

  buscarPorId(id) {
    return db.prepare('SELECT * FROM cantores WHERE id = ?').get(Number(id)) || null;
  },

  inserir({ nome, sexo }) {
    const r = db.prepare(
      `INSERT INTO cantores (nome, sexo, criada_em)
       VALUES (?, ?, ?)`
    ).run(nome, sexo, new Date().toISOString());
    return this.buscarPorId(r.lastInsertRowid);
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados, id };
    db.prepare('UPDATE cantores SET nome = ?, sexo = ? WHERE id = ?')
      .run(novo.nome, novo.sexo, id);
    return this.buscarPorId(id);
  },

  remover(id) {
    return db.prepare('DELETE FROM cantores WHERE id = ?').run(id).changes > 0;
  },
};