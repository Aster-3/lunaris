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

export const createUser = async (name: string | null, imgPath: string | null) => {
  const db = await getDBInstance();

  await executeSqlAsync(db, `DELETE FROM user`);

  const created = await executeSqlAsync(
    db,
    `INSERT INTO user (id, name, imgPath) VALUES (1, ?, ?)`,
    [name, imgPath]
  );

  return created.changes > 0;
};

export const getUser = async () => {
  const db = await getDBInstance();
  const user = await queryAllAsync(
    db,
    `
    SELECT * FROM user
  `
  );
  if (user.length > 0) return user[0];
  else return null;
};

export const updateUserCover = async (imgPath: string) => {
  const db = await getDBInstance();

  const result = await executeSqlAsync(
    db,
    `
    UPDATE user
    SET imgPath = ?
    WHERE id = 1
    `,
    [imgPath]
  );

  return result.changes > 0;
};

export const updateUserName = async (name: string) => {
  const db = await getDBInstance();

  const result = await executeSqlAsync(
    db,
    `
    UPDATE user
    SET name = ?
    WHERE id = 1
    `,
    [name]
  );

  return result.changes > 0;
};

export const updateUser = async (name: string | null, imgPath: string | null) => {
  const db = await getDBInstance();
  const result = await executeSqlAsync(
    db,
    `
    UPDATE user
    SET name = ?,
    imgPath = ?
    WHERE id = 1
    `,
    [name, imgPath]
  );

  return result.changes > 0;
};
