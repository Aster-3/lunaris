import { getDBConnection } from '../connection';
import { executeSqlAsync, queryAllAsync } from '../utils/executeSqlAsync';
import { BookModel } from '../modelTypes';
import { useBookStore } from '@/store/booksStore';

let dbInstance: any = null;

const getDbInstance = async () => {
  if (!dbInstance) {
    dbInstance = await getDBConnection();
  }
  return dbInstance;
};

export const getAllBooks = async () => {
  const db = await getDbInstance();
  const books = await queryAllAsync(db, 'Select * from books');
  return books;
};

export const getAllBooksByLastReading = async () => {
  const db = await getDbInstance();
  const books = await queryAllAsync(
    db,
    'SELECT id, img, title FROM books ORDER BY createdAt DESC LIMIT 10;'
  );
  return books;
};

export const getBookById = async (id: number) => {
  const db = await getDbInstance();
  const book = await queryAllAsync(db, 'Select * from books where id  = ?', [id]);
  return book[0] || null;
};

export const getBookByName = async (title: string) => {
  const db = await getDbInstance();
  const book = await queryAllAsync(db, 'Select * from books where title  = ?', [title]);
  return book[0] || null;
};

export const addBook = async (book: BookModel) => {
  try {
    const db = await getDBConnection();

    if (!book?.title) {
      throw new Error('Kitap eklemek için title alanı zorunludur.');
    }
    if (!book?.url) {
      throw new Error('Kitap Yolu Seçilemedi!');
    }
    const now = Math.floor(Date.now() / 1000);
    const result = await executeSqlAsync(
      db,
      `
      INSERT INTO books 
        (title, url, img, author, type, createdAt)
      VALUES 
        (?, ?, ?, ?, ?, ?);
      `,
      [book.title, book.url, book.img || null, book.author || null, book.type || 'E-Pub', now]
    );
    console.log('Kitap başarıyla eklendi:', book.title);
    const newBook = await getBookById(result.lastInsertRowId);
    return newBook;
  } catch (error: any) {
    console.error('Kitap eklenirken hata oluştu:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const updateBookLastReading = async (bookId: number) => {
  try {
    const db = await getDbInstance();

    const now = Date.now();

    const sql = `
      UPDATE books
      SET lastReadingAt = ?
      WHERE id = ?;
    `;

    const params = [now, bookId];

    await executeSqlAsync(db, sql, params);
    useBookStore.getState().updateBookLastReadingAt(bookId, now);
  } catch (error) {
    console.error('Error updating last_reading_at:', error);
  }
};

export const getBookLastPage = async (bookId: number) => {
  const db = await getDbInstance();
  const result = await queryAllAsync(db, 'SELECT lastReadPage FROM books WHERE id = ?', [bookId]);

  if (result.length === 0) {
    return null;
  }
  console.log('Result:', result[0].lastReadPage);
  return result[0];
};

export const updateBookLastPage = async (bookId: number, lastPage: number) => {
  const db = await getDbInstance();

  const result = await executeSqlAsync(db, 'UPDATE books SET lastReadPage = ? WHERE id = ?', [
    lastPage,
    bookId,
  ]);

  return result.changes > 0;
};

export const deleteBook = async (bookId: number) => {
  try {
    const db = await getDBConnection();

    if (!bookId) {
      throw new Error('Silinecek kitabın IDsi gerekli.');
    }

    const result = await executeSqlAsync(
      db,
      `
      DELETE FROM books
      WHERE id = ?;
      `,
      [bookId]
    );

    return result.changes > 0;
  } catch (error: any) {
    console.error('Kitap silinirken hata oluştu:', error);
    return false;
  }
};
