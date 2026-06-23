import { DatabaseSync } from 'node:sqlite';

// abre (ou cria) o arquivo do banco na raiz do projeto
export const db = new DatabaseSync('banco.db');

// integridade referencial: SQLite exige ligar explicitamente
db.exec('PRAGMA foreign_keys = ON;');

// cria as tabelas se ainda não existirem
db.exec(`
  CREATE TABLE IF NOT EXISTS cantores (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nome        TEXT NOT NULL,
    sexo        TEXT,
    criada_em   TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS musicas (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    nome                TEXT NOT NULL,
    bpm                 INTEGER,
    tonalidade_original TEXT,
    criada_em           TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS repertorios (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo       TEXT NOT NULL,
    data_execucao TEXT,
    criada_em    TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS itens_repertorio (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    ordem          INTEGER NOT NULL,
    musica_id      INTEGER NOT NULL,
    cantor_id      INTEGER,
    tom_execucao   TEXT,
    repertorio_id  INTEGER NOT NULL,
    criado_em      TEXT NOT NULL,
    FOREIGN KEY (musica_id) REFERENCES musicas(id) ON DELETE CASCADE,
    FOREIGN KEY (cantor_id) REFERENCES cantores(id) ON DELETE SET NULL,
    FOREIGN KEY (repertorio_id) REFERENCES repertorios(id) ON DELETE CASCADE
  );
`);