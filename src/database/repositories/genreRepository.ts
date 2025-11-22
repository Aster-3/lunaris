import { executeSqlAsync, queryAllAsync } from '../utils/executeSqlAsync';
import { getDBConnection } from '../connection';
import { SQLiteDatabase } from 'expo-sqlite';

export interface Genre {
  id: number;
  name: string;
}

let dbInstance: SQLiteDatabase | null = null;

const getDbInstance = async () => {
  if (!dbInstance) {
    dbInstance = await getDBConnection();
  }
  return dbInstance;
};

export const addGenre = async (name: string): Promise<Genre> => {
  const db = await getDbInstance();
  await executeSqlAsync(
    db,
    `
    INSERT OR IGNORE INTO genres (name) VALUES (?);
  `,
    [name]
  );

  const result = await queryAllAsync(
    db,
    `
    SELECT * FROM genres WHERE name = ?;
  `,
    [name]
  );

  return result[0];
};

export const getAllGenres = async (): Promise<Genre[]> => {
  const db = await getDbInstance();
  const result = await queryAllAsync(
    db,
    `
    SELECT * FROM genres ORDER BY name ASC;
  `
  );
  return result;
};

export const getGenreById = async (id: number): Promise<Genre | null> => {
  const db = await getDbInstance();

  const result = await queryAllAsync(
    db,
    `
    SELECT * FROM genres WHERE id = ?;
  `,
    [id]
  );
  return result[0] || null;
};

export const getGenreByName = async (name: string): Promise<Genre | null> => {
  const db = await getDbInstance();

  const result = await queryAllAsync(
    db,
    `
    SELECT * FROM genres WHERE name = ?;
  `,
    [name]
  );
  return result[0] || null;
};
