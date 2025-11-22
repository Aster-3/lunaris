import { SQLiteDatabase } from 'expo-sqlite';
import { executeSqlAsync } from './utils/executeSqlAsync';

export const createTables = async (db: SQLiteDatabase) => {
  await executeSqlAsync(
    db,
    `
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      imgPath TEXT
    );
    `
  );

  await executeSqlAsync(
    db,
    `
    CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      imgPath TEXT,
      createdAt TEXT DEFAULT (datetime('now', 'localtime')),
      lastReadingAt INTEGER
    );
    `
  );

  await executeSqlAsync(
    db,
    `
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT UNIQUE NOT NULL,
      description TEXT,
      img TEXT,
      author TEXT,
      type TEXT,
      lastReadPage INTEGER DEFAULT (0),
      lastReadingAt INTEGER,
      createdAt INTEGER DEFAULT (strftime('%s','now'))
    );
    `
  );

  await executeSqlAsync(
    db,
    `
    CREATE TABLE IF NOT EXISTS book_collections (
      book_id INTEGER NOT NULL,
      collection_id INTEGER NOT NULL,
      FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE,
      FOREIGN KEY (collection_id) REFERENCES collections (id) ON DELETE CASCADE,
      PRIMARY KEY (book_id, collection_id)
    );
    `
  );

  await executeSqlAsync(
    db,
    `
    CREATE TABLE IF NOT EXISTS genres (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );
    `
  );

  await executeSqlAsync(
    db,
    `
    CREATE TABLE IF NOT EXISTS book_genres (
      book_id INTEGER NOT NULL,
      genre_id INTEGER NOT NULL,
      FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE,
      FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE CASCADE,
      PRIMARY KEY (book_id, genre_id)
    );
    `
  );

  await executeSqlAsync(
    db,
    `
    CREATE TABLE IF NOT EXISTS languages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL
    );
    `
  );

  await executeSqlAsync(
    db,
    `
    CREATE TABLE IF NOT EXISTS book_languages (
      book_id INTEGER NOT NULL,
      language_id INTEGER NOT NULL,
      FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE,
      FOREIGN KEY (language_id) REFERENCES languages (id) ON DELETE CASCADE,
      PRIMARY KEY (book_id, language_id)
    );
    `
  );

  await executeSqlAsync(
    db,
    `
    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER UNIQUE NOT NULL,
      FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE
    );
    `
  );
};
