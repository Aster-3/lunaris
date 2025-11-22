import * as SQLite from 'expo-sqlite';
import { createTables } from './schema';

let dbInstance: SQLite.SQLiteDatabase | null = null;
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const getDBConnection = async () => {
  if (dbInstance) return dbInstance;
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('library.db');
      await createTables(db);
      dbInstance = db;
      console.log('Database Connected Successfully!');
      return db;
    })();
  }
  return dbPromise;
};
