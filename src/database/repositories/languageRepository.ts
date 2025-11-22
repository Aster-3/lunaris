import { executeSqlAsync, queryAllAsync } from '../utils/executeSqlAsync';
import { getDBConnection } from '../connection';
import { SQLiteDatabase } from 'expo-sqlite';

export interface Language {
  id: number;
  code: string;
}

let dbInstance: SQLiteDatabase | null = null;

const getDbInstance = async () => {
  if (!dbInstance) {
    dbInstance = await getDBConnection();
  }
  return dbInstance;
};

export const addLanguage = async (code: string): Promise<Language> => {
  const db = await getDbInstance();

  await executeSqlAsync(
    db,
    `
    INSERT OR IGNORE INTO languages (code) VALUES (?);
  `,
    [code]
  );

  const result = await queryAllAsync(
    db,
    `
    SELECT * FROM languages WHERE code = ?;
  `,
    [code]
  );

  return result[0];
};

export const getAllLanguages = async (): Promise<Language[]> => {
  const db = await getDbInstance();
  const result = await queryAllAsync(
    db,
    `
    SELECT * FROM languages ORDER BY code ASC;
  `
  );
  return result;
};

export const getLanguageById = async (id: number): Promise<Language | null> => {
  const db = await getDbInstance();
  const result = await queryAllAsync(
    db,
    `
    SELECT * FROM languages WHERE id = ?;
  `,
    [id]
  );
  return result[0] || null;
};

export const getLanguageByName = async (name: string): Promise<Language | null> => {
  const db = await getDbInstance();
  const result = await queryAllAsync(
    db,
    `
    SELECT * FROM languages WHERE code = ?;
  `,
    [name]
  );
  return result[0] || null;
};
