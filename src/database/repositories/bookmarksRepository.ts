import { SQLiteDatabase } from 'expo-sqlite';
import { getDBConnection } from '../connection';
import { queryAllAsync, executeSqlAsync } from '../utils/executeSqlAsync';

let dbInstance: SQLiteDatabase | null = null;

const getDBInstance = async () => {
  if (!dbInstance) {
    dbInstance = await getDBConnection();
  }
  return dbInstance;
};

export const getAllBookMarks = async () => {
  const db = await getDBInstance();
  const bookmarks = await queryAllAsync(db, 'SELECT * FROM bookmarks ORDER BY id DESC');
  return bookmarks;
};

const findBookMarkByBookId = async (bookId: number) => {
  const db = await getDBInstance();
  const bookmark = await queryAllAsync(db, 'Select * from bookmarks where book_id = ?', [bookId]);
  return bookmark[0];
};

const findBookMarkById = async (id: number) => {
  const db = await getDBInstance();
  const bookmark = await queryAllAsync(db, 'Select * from bookmarks where id = ?', [id]);
  return bookmark[0];
};

export const addBookMark = async (bookId: number) => {
  try {
    const db = await getDBInstance();

    const isAvailable = await findBookMarkByBookId(bookId);
    if (isAvailable) {
      console.log('BookMark is already available for this book!');
      return null;
    }

    const addedBookMark = await executeSqlAsync(db, 'INSERT INTO bookmarks (book_id) VALUES (?)', [
      bookId,
    ]);

    if (!addedBookMark?.lastInsertRowId) {
      console.log('Bookmark successfully added with ID:', addedBookMark.lastInsertRowId);
      return null;
    }
    const bookmark = await findBookMarkById(addedBookMark.lastInsertRowId);
    if (!bookmark) {
      return null;
    }
    console.log(bookmark);
    return bookmark;
  } catch (err) {
    console.error('Error while adding bookmark:', err);
    throw new Error('DB_INSERT_FAILED');
  }
};

export const removeBookMark = async (bookId: number) => {
  try {
    const db = await getDBInstance();

    const isAvailable = await findBookMarkByBookId(bookId);

    if (!isAvailable) {
      console.log('BookMark is not available for this book!');
      return null;
    }
    const deletedBookMark = await executeSqlAsync(db, 'DELETE FROM bookmarks WHERE book_id = ?', [
      bookId,
    ]);
    return deletedBookMark;
  } catch (err) {
    console.error('Error while removing bookmark:', err);
    throw new Error('DB_INSERT_FAILED');
  }
};
