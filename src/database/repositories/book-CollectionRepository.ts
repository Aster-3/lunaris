import { SQLiteDatabase } from 'expo-sqlite';
import { getDBConnection } from '../connection';
import { executeSqlAsync, queryAllAsync } from '../utils/executeSqlAsync';

let dbInstance: SQLiteDatabase | null = null;

const getDBInstance = async () => {
  if (!dbInstance) {
    dbInstance = await getDBConnection();
  }
  return dbInstance;
};

export const getBookCollectionsByColId = async (collection_id: number) => {
  const db = await getDBInstance();
  const bookCollection = await queryAllAsync(
    db,
    'Select book_id from book_collections where collection_id = ?',
    [collection_id]
  );
  return bookCollection;
};

export const getAllBookCollections = async () => {
  const db = await getDBInstance();
  const bookCollection = await queryAllAsync(db, 'Select * from book_collections');
  return bookCollection;
};

export const toggleBooksToCollection = async (collectionId: number, bookIds: number[]) => {
  try {
    const db = await getDBInstance();

    const availableList = await (
      await getBookCollectionsByColId(collectionId)
    ).map((b) => b.book_id);

    if (!bookIds || bookIds.length === 0) {
      const result = await executeSqlAsync(
        db,
        `DELETE FROM book_collections WHERE collection_id = ?`,
        [collectionId]
      );
      return result;
    }

    const newAddedList = bookIds.filter((b) => !availableList.includes(b));

    const removedList = availableList.filter((b) => !bookIds.includes(b));

    if (removedList.length > 0) {
      const placeholdersForDelete = removedList.map(() => '?').join(', ');

      const sqlForDelete = `
    DELETE FROM book_collections
    WHERE collection_id = ?
    AND book_id IN (${placeholdersForDelete})
  `;

      await executeSqlAsync(db, sqlForDelete, [collectionId, ...removedList]);
    }

    if (newAddedList.length > 0) {
      const placeholdersForInsert = newAddedList.map(() => `(?, ?)`).join(', ');
      const paramsForInsert: any[] = [];

      for (const bookId of newAddedList) {
        paramsForInsert.push(collectionId, bookId);
      }

      const sql = `INSERT INTO book_collections (collection_id, book_id) VALUES ${placeholdersForInsert}`;
      const result = await executeSqlAsync(db, sql, paramsForInsert);

      return result;
    }
  } catch (err) {
    console.error('addBooksToCollection error:', err);
    throw err;
  }
};

export const getBooksByCollectionId = async (collectionId: number) => {
  try {
    const db = await getDBInstance();

    const query = `
      SELECT b.*
      FROM books b
      JOIN book_collections bc ON b.id = bc.book_id
      WHERE bc.collection_id = ?;
    `;

    const result = await queryAllAsync(db, query, [collectionId]);
    return result;
  } catch (error) {
    console.error('getBooksByCollectionId error:', error);
    return [];
  }
};

export const getCollectionsByBookId = async (bookId: number) => {
  try {
    const db = await getDBInstance();

    const query = `
      SELECT c.*
      FROM collections c
      JOIN book_collections bc ON c.id = bc.collection_id
      WHERE bc.book_id = ?;
    `;

    const result = await queryAllAsync(db, query, [bookId]);
    return result;
  } catch (error) {
    console.error('getCollectionsByBookId error:', error);
    return [];
  }
};
