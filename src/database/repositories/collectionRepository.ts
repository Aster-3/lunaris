import { queryAllAsync, executeSqlAsync } from '../utils/executeSqlAsync';
import { getDBConnection } from '../connection';
import { SQLiteDatabase } from 'expo-sqlite';
import { useCollectionStore } from '@/store/collectionStore';

let dbInstance: SQLiteDatabase | null = null;

const getDBInstance = async () => {
  if (!dbInstance) {
    dbInstance = await getDBConnection();
  }
  return dbInstance;
};

export const getAllCollections = async () => {
  const db = await getDBInstance();
  const collections = await queryAllAsync(db, 'SELECT * FROM collections');
  return collections;
};

export const getCollectionByTitle = async (title: string) => {
  const db = await getDBInstance();
  const collection = await queryAllAsync(db, 'SELECT * FROM collections where title = ?', [title]);
  return collection;
};

export const getCollectionById = async (id: number) => {
  const db = await getDBInstance();
  const collection = await queryAllAsync(db, 'SELECT * FROM collections where id = ?', [id]);
  return collection;
};

export const addCollection = async (title: string, imgPath: string) => {
  const db = await getDBInstance();
  const now = Math.floor(Date.now() / 1000);
  const collection = await executeSqlAsync(
    db,
    'INSERT INTO collections (title, imgPath, createdAt) VALUES (?, ?, ?)',
    [title, imgPath, now]
  );
  const result = await getCollectionById(collection.lastInsertRowId);
  return result;
};

export const updateCollectionLastReading = async (collectionId: number) => {
  try {
    const db = await getDBInstance();

    const now = Date.now();

    const sql = `
      UPDATE collections
      SET lastReadingAt = ?
      WHERE id = ?;
    `;
    useCollectionStore.getState().updateCollectionLastReadingAt(collectionId, now);

    const params = [now, collectionId];

    await executeSqlAsync(db, sql, params);
    console.log(`Collection #${collectionId} updated at ${now}`);
  } catch (error) {
    console.error('Error updating last_reading_at:', error);
  }
};

export const deleteCollection = async (collectionId: number) => {
  try {
    const db = await getDBConnection();

    if (!collectionId) {
      throw new Error('Silinecek collection IDsi gerekli.');
    }

    const result = await executeSqlAsync(
      db,
      `
      DELETE FROM collections
      WHERE id = ?;
      `,
      [collectionId]
    );

    return result.changes > 0;
  } catch (error: any) {
    console.error('Collection silinirken hata oluştu:', error);
    return false;
  }
};
