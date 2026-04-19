import type { SQLiteDatabase } from 'expo-sqlite';

import { seedDatabase } from './seed';

/** Current schema version — increment when adding migrations below. */
const SCHEMA_VERSION = 3;

/** Initial schema (v1). Runs only on a fresh database. */
const V1_TABLES = [
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

  `CREATE TABLE IF NOT EXISTS srd_cache (
    index_key TEXT PRIMARY KEY,
    resource_type TEXT NOT NULL,
    data TEXT NOT NULL,
    cached_at TEXT NOT NULL
  )`,
];

/**
 * v2: fill in the fields the domain types already expect (hero full sheet,
 * campaign/session/combat images, session+combat descriptions), and add the
 * compendium_items table.
 */
async function migrateToV2(db: SQLiteDatabase): Promise<void> {
  const alters = [
    `ALTER TABLE campaigns ADD COLUMN image_uri TEXT`,

    `ALTER TABLE heroes ADD COLUMN race TEXT`,
    `ALTER TABLE heroes ADD COLUMN hp INTEGER`,
    `ALTER TABLE heroes ADD COLUMN ac INTEGER`,
    `ALTER TABLE heroes ADD COLUMN speed TEXT`,
    `ALTER TABLE heroes ADD COLUMN stats TEXT`,
    `ALTER TABLE heroes ADD COLUMN backstory TEXT`,
    `ALTER TABLE heroes ADD COLUMN notable_abilities TEXT`,

    `ALTER TABLE sessions ADD COLUMN description TEXT`,
    `ALTER TABLE sessions ADD COLUMN image_uri TEXT`,

    `ALTER TABLE combat_modules ADD COLUMN description TEXT`,
    `ALTER TABLE combat_modules ADD COLUMN image_uri TEXT`,
  ];

  for (const sql of alters) {
    try {
      await db.execAsync(sql);
    } catch (err) {
      // SQLite doesn't have IF NOT EXISTS for ADD COLUMN; swallow "duplicate column" so
      // this migration is idempotent if partially applied on an earlier crash.
      const msg = String(err);
      if (!msg.includes('duplicate column')) throw err;
    }
  }

  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS compendium_items (
      id TEXT PRIMARY KEY,
      campaign_id TEXT REFERENCES campaigns(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      summary TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL DEFAULT 'Created in app',
      source_url TEXT,
      entity_id TEXT,
      body TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
  );
}

/** v3: give campaigns + maps a description so every entity can be created with
 * two data points (name/title + description). */
async function migrateToV3(db: SQLiteDatabase): Promise<void> {
  const alters = [
    `ALTER TABLE campaigns ADD COLUMN description TEXT`,
    `ALTER TABLE maps ADD COLUMN description TEXT`,
  ];
  for (const sql of alters) {
    try {
      await db.execAsync(sql);
    } catch (err) {
      const msg = String(err);
      if (!msg.includes('duplicate column')) throw err;
    }
  }
}

/**
 * Initialize the database and run any pending migrations. Called once on app
 * startup from the root layout via useDatabase().
 */
export async function initializeDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL');
  await db.execAsync('PRAGMA foreign_keys = ON');

  for (const table of V1_TABLES) {
    await db.execAsync(table);
  }

  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER NOT NULL
    )`,
  );

  const row = await db.getFirstAsync<{ version: number }>(
    'SELECT version FROM schema_version LIMIT 1',
  );
  const currentVersion = row?.version ?? 0;

  if (currentVersion < 2) {
    await migrateToV2(db);
  }
  if (currentVersion < 3) {
    await migrateToV3(db);
  }

  if (!row) {
    await seedDatabase(db);
    await db.runAsync(
      'INSERT INTO schema_version (version) VALUES (?)',
      SCHEMA_VERSION,
    );
  } else if (currentVersion !== SCHEMA_VERSION) {
    await db.runAsync(
      'UPDATE schema_version SET version = ?',
      SCHEMA_VERSION,
    );
  }
}
