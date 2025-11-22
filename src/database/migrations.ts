import { executeSqlAsync } from './utils/executeSqlAsync';
import { getDBConnection } from './connection';

export const createTables = async () => {
  const db = await getDBConnection();

  await executeSqlAsync(
    db,
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `
  );

  await executeSqlAsync(
    db,
    `
    CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT,
      image TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `
  );

  await executeSqlAsync(
    db,
    `
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      collection_id INTEGER,
      title TEXT,
      author TEXT,
      language TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(collection_id) REFERENCES collections(id)
    );
  `
  );
};
