import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

import { initializeDatabase } from './schema';

let dbInstance: SQLiteDatabase | null = null;

/** Get or create the database singleton */
export async function getDatabase(): Promise<SQLiteDatabase> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDatabaseAsync('dungeonpad.db');
  await initializeDatabase(dbInstance);
  return dbInstance;
}
