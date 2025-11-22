import { SQLiteDatabase, SQLiteRunResult } from 'expo-sqlite';

export const executeSqlAsync = async (
  db: SQLiteDatabase,
  query: string,
  params: any[] = []
): Promise<SQLiteRunResult> => {
  try {
    const result = await db.runAsync(query, params);
    return result;
  } catch (error) {
    console.error('SQL error:', error);
    throw error;
  }
};

export const queryAllAsync = async (
  db: SQLiteDatabase,
  query: string,
  params: any[] = []
): Promise<any[]> => {
  try {
    const rows = await db.getAllAsync(query, params);
    return rows;
  } catch (error) {
    console.error('SQL error:', error);
    throw error;
  }
};
