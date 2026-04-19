import type { SQLiteDatabase } from 'expo-sqlite';

/** Current schema version — increment when adding migrations */
const SCHEMA_VERSION = 1;

/** All table creation statements for the initial schema */
const TABLES = [
  // ─── Core Entities ───────────────────────────────────────────────────────

  `CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS heroes (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    image_uri TEXT,
    player_name TEXT,
    class TEXT,
    level INTEGER,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    session_number INTEGER,
    played_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS story_beats (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT,
    sort_order INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS npcs (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    image_uri TEXT,
    description TEXT,
    notable_abilities TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS combat_modules (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS combat_monsters (
    id TEXT PRIMARY KEY,
    combat_module_id TEXT NOT NULL REFERENCES combat_modules(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    hp INTEGER,
    ac INTEGER,
    speed TEXT,
    stat_block TEXT,
    srd_index TEXT,
    sort_order INTEGER NOT NULL,
    image_uri TEXT
  )`,

  `CREATE TABLE IF NOT EXISTS initiative_entries (
    id TEXT PRIMARY KEY,
    combat_module_id TEXT NOT NULL REFERENCES combat_modules(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    initiative_value INTEGER,
    sort_order INTEGER NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS maps (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    image_uri TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,

  // ─── Junction Tables ─────────────────────────────────────────────────────

  `CREATE TABLE IF NOT EXISTS session_heroes (
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    hero_id TEXT NOT NULL REFERENCES heroes(id) ON DELETE CASCADE,
    PRIMARY KEY (session_id, hero_id)
  )`,

  `CREATE TABLE IF NOT EXISTS session_npcs (
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    npc_id TEXT NOT NULL REFERENCES npcs(id) ON DELETE CASCADE,
    PRIMARY KEY (session_id, npc_id)
  )`,

  `CREATE TABLE IF NOT EXISTS session_combat_modules (
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    combat_module_id TEXT NOT NULL REFERENCES combat_modules(id) ON DELETE CASCADE,
    PRIMARY KEY (session_id, combat_module_id)
  )`,

  `CREATE TABLE IF NOT EXISTS session_maps (
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    map_id TEXT NOT NULL REFERENCES maps(id) ON DELETE CASCADE,
    PRIMARY KEY (session_id, map_id)
  )`,

  // ─── SRD Cache ───────────────────────────────────────────────────────────

  `CREATE TABLE IF NOT EXISTS srd_cache (
    index_key TEXT PRIMARY KEY,
    resource_type TEXT NOT NULL,
    data TEXT NOT NULL,
    cached_at TEXT NOT NULL
  )`,
];

/**
 * Initialize the database: enable WAL mode, foreign keys, and create all tables.
 * Called once on app startup from the root layout.
 */
export async function initializeDatabase(db: SQLiteDatabase): Promise<void> {
  // Enable WAL mode for better concurrent read performance
  await db.execAsync('PRAGMA journal_mode = WAL');
  // Enable foreign key enforcement
  await db.execAsync('PRAGMA foreign_keys = ON');

  // Create all tables
  for (const table of TABLES) {
    await db.execAsync(table);
  }

  // Store schema version for future migrations
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER NOT NULL
    )`
  );

  const result = await db.getFirstAsync<{ version: number }>(
    'SELECT version FROM schema_version LIMIT 1'
  );

  if (!result) {
    await db.runAsync(
      'INSERT INTO schema_version (version) VALUES (?)',
      SCHEMA_VERSION
    );
  }
}
