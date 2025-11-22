import { SQLiteDatabase } from 'expo-sqlite';
import { executeSqlAsync } from './executeSqlAsync';

export const resetDatabase = async (db: SQLiteDatabase) => {
  // Tabloları sil (drop)
  const tables = [
    'book_languages',
    'book_genres',
    'book_collections',
    'books',
    'collections',
    'genres',
    'languages',
    'bookmarks',
  ];

  for (const table of tables) {
    await executeSqlAsync(db, `DROP TABLE IF EXISTS ${table};`);
  }
};
