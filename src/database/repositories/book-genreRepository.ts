import { executeSqlAsync, queryAllAsync } from '../utils/executeSqlAsync';
import { getDBConnection } from '../connection';
import { SQLiteDatabase } from 'expo-sqlite';

export interface BookLanguages {
  bookId: number;
  genreId: number;
}

let dbInstance: SQLiteDatabase | null = null;

const getDbInstance = async () => {
  if (!dbInstance) {
    dbInstance = await getDBConnection();
  }
  return dbInstance;
};

export const addBookGenre = async (bookId: number, genreId: number): Promise<void> => {
  const db = await getDbInstance();

  await executeSqlAsync(db, `INSERT INTO book_genres (book_id, genre_id) VALUES (?, ?)`, [
    bookId,
    genreId,
  ]);
};

export const getGenreToBookId = async (bookId: number): Promise<BookLanguages> => {
  const db = await getDbInstance();
  const result = await queryAllAsync(db, `Select * from book_genres where book_id = ?`, [bookId]);
  return result[0];
};

export const getAllGenresToBookId = async (bookId: number) => {
  const db = await getDbInstance();
  const genres = await queryAllAsync(
    db,
    `SELECT g.* 
     FROM genres g
     JOIN book_genres bg ON g.id = bg.genre_id
     WHERE bg.book_id = ?`,
    [bookId]
  );
  return genres;
};
