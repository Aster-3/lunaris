import { executeSqlAsync, queryAllAsync } from '../utils/executeSqlAsync';
import { getDBConnection } from '../connection';
import { SQLiteDatabase } from 'expo-sqlite';

export interface BookLanguages {
  bookId: number;
  languageId: number;
}

let dbInstance: SQLiteDatabase | null = null;

const getDbInstance = async () => {
  if (!dbInstance) {
    dbInstance = await getDBConnection();
  }
  return dbInstance;
};

export const addBookLanguage = async (bookId: number, languageId: number): Promise<void> => {
  const db = await getDbInstance();

  await executeSqlAsync(db, `INSERT INTO book_languages (book_id, language_id) VALUES (?, ?)`, [
    bookId,
    languageId,
  ]);
};

export const getLanguageToBookId = async (bookId: number): Promise<BookLanguages[]> => {
  const db = await getDbInstance();
  const result = await queryAllAsync(db, `Select * from book_languages where book_id  = ?`, [
    bookId,
  ]);
  return result;
};

export const getAllLanguagesToBookId = async (bookId: number) => {
  const db = await getDbInstance();
  const languages = await queryAllAsync(
    db,
    `SELECT l.* FROM languages l
   JOIN book_languages bl ON l.id = bl.language_id
   WHERE bl.book_id = ?`,
    [bookId]
  );
  return languages;
};
