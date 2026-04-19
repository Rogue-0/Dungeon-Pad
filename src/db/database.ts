import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

import { initializeDatabase } from './schema';

const DB_NAME = 'dungeonpad.db';

const ALL_TABLES = [
  'session_heroes',
  'session_npcs',
  'session_combat_modules',
  'session_maps',
  'story_beats',
  'heroes',
  'sessions',
  'npcs',
  'combat_monsters',
  'initiative_entries',
  'combat_modules',
  'maps',
  'compendium_items',
  'campaigns',
  'srd_cache',
  'schema_version',
];

let dbInstance: SQLiteDatabase | null = null;

/** Get or create the database singleton */
export async function getDatabase(): Promise<SQLiteDatabase> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDatabaseAsync(DB_NAME);
  await initializeDatabase(dbInstance);
  return dbInstance;
}

/**
 * Drop every table and re-run initialization (which recreates tables and
 * seeds default content). Keeps the existing connection alive — on iOS the
 * file handle lingers after closeAsync(), so deleteDatabaseAsync fails.
 */
export async function resetDatabase(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync('PRAGMA foreign_keys = OFF');
  try {
    for (const table of ALL_TABLES) {
      await db.execAsync(`DROP TABLE IF EXISTS ${table}`);
    }
  } finally {
    await db.execAsync('PRAGMA foreign_keys = ON');
  }
  await initializeDatabase(db);
}
