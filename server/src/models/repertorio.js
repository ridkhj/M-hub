import { db } from '../db.js';

export const repertorioModel = {
  listarTodas() {
    return db.prepare('SELECT * FROM repertorios').all();
  },

  buscarPorId(id) {
    return db.prepare('SELECT * FROM repertorios WHERE id = ?').get(Number(id)) || null;
  },

  inserir({ titulo, dataExecucao }) {
    const r = db.prepare(
      `INSERT INTO repertorios (titulo, data_execucao, criada_em)
       VALUES (?, ?, ?)`
    ).run(titulo, dataExecucao ?? null, new Date().toISOString());
    return this.buscarPorId(r.lastInsertRowid);
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados, id };
    const dataExec = novo.dataExecucao ?? novo.data_execucao ?? null;
    db.prepare('UPDATE repertorios SET titulo = ?, data_execucao = ? WHERE id = ?')
      .run(novo.titulo, dataExec, id);
    return this.buscarPorId(id);
  },

  remover(id) {
    return db.prepare('DELETE FROM repertorios WHERE id = ?').run(id).changes > 0;
  },
};