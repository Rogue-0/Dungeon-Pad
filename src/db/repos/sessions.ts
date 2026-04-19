import type { SQLiteDatabase } from 'expo-sqlite';

import type { Session } from '@/types';
import { generateId } from '@/utils/ids';

import { nowIso } from './shared';

interface SessionRow {
  id: string;
  campaign_id: string;
  title: string;
  description: string | null;
  image_uri: string | null;
  session_number: number | null;
  played_at: string | null;
  created_at: string;
  updated_at: string;
}

function rowToSession(row: SessionRow): Session {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    title: row.title,
    description: row.description,
    imageUri: row.image_uri,
    sessionNumber: row.session_number,
    playedAt: row.played_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listByCampaign(
  db: SQLiteDatabase,
  campaignId: string,
): Promise<Session[]> {
  const rows = await db.getAllAsync<SessionRow>(
    `SELECT * FROM sessions WHERE campaign_id = ?
     ORDER BY session_number DESC, played_at DESC, created_at DESC`,
    campaignId,
  );
  return rows.map(rowToSession);
}

export async function getById(
  db: SQLiteDatabase,
  id: string,
): Promise<Session | null> {
  const row = await db.getFirstAsync<SessionRow>(
    `SELECT * FROM sessions WHERE id = ?`,
    id,
  );
  return row ? rowToSession(row) : null;
}

export interface CreateSessionInput {
  campaignId: string;
  title: string;
  description?: string | null;
  imageUri?: string | null;
  sessionNumber?: number | null;
  playedAt?: string | null;
}

export async function create(
  db: SQLiteDatabase,
  input: CreateSessionInput,
): Promise<Session> {
  const id = generateId();
  const now = nowIso();

  await db.runAsync(
    `INSERT INTO sessions (
      id, campaign_id, title, description, image_uri,
      session_number, played_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.campaignId,
    input.title,
    input.description ?? null,
    input.imageUri ?? null,
    input.sessionNumber ?? null,
    input.playedAt ?? null,
    now,
    now,
  );

  return {
    id,
    campaignId: input.campaignId,
    title: input.title,
    description: input.description ?? null,
    imageUri: input.imageUri ?? null,
    sessionNumber: input.sessionNumber ?? null,
    playedAt: input.playedAt ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

export type UpdateSessionInput = Partial<Omit<CreateSessionInput, 'campaignId'>>;

export async function update(
  db: SQLiteDatabase,
  id: string,
  patch: UpdateSessionInput,
): Promise<void> {
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  const setField = (column: string, value: string | number | null | undefined) => {
    if (value === undefined) return;
    fields.push(`${column} = ?`);
    values.push(value);
  };

  setField('title', patch.title);
  setField('description', patch.description);
  setField('image_uri', patch.imageUri);
  setField('session_number', patch.sessionNumber);
  setField('played_at', patch.playedAt);

  if (fields.length === 0) return;

  fields.push('updated_at = ?');
  values.push(nowIso());
  values.push(id);

  await db.runAsync(
    `UPDATE sessions SET ${fields.join(', ')} WHERE id = ?`,
    ...values,
  );
}

export async function remove(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync(`DELETE FROM sessions WHERE id = ?`, id);
}

// ─── session ⇄ entity links ─────────────────────────────────────────────────

export async function listHeroIds(
  db: SQLiteDatabase,
  sessionId: string,
): Promise<string[]> {
  const rows = await db.getAllAsync<{ hero_id: string }>(
    `SELECT hero_id FROM session_heroes WHERE session_id = ?`,
    sessionId,
  );
  return rows.map((r) => r.hero_id);
}

export async function listNpcIds(
  db: SQLiteDatabase,
  sessionId: string,
): Promise<string[]> {
  const rows = await db.getAllAsync<{ npc_id: string }>(
    `SELECT npc_id FROM session_npcs WHERE session_id = ?`,
    sessionId,
  );
  return rows.map((r) => r.npc_id);
}

export async function listCombatModuleIds(
  db: SQLiteDatabase,
  sessionId: string,
): Promise<string[]> {
  const rows = await db.getAllAsync<{ combat_module_id: string }>(
    `SELECT combat_module_id FROM session_combat_modules WHERE session_id = ?`,
    sessionId,
  );
  return rows.map((r) => r.combat_module_id);
}

export async function listMapIds(
  db: SQLiteDatabase,
  sessionId: string,
): Promise<string[]> {
  const rows = await db.getAllAsync<{ map_id: string }>(
    `SELECT map_id FROM session_maps WHERE session_id = ?`,
    sessionId,
  );
  return rows.map((r) => r.map_id);
}

export async function linkHero(
  db: SQLiteDatabase,
  sessionId: string,
  heroId: string,
): Promise<void> {
  await db.runAsync(
    `INSERT OR IGNORE INTO session_heroes (session_id, hero_id) VALUES (?, ?)`,
    sessionId,
    heroId,
  );
}

export async function unlinkHero(
  db: SQLiteDatabase,
  sessionId: string,
  heroId: string,
): Promise<void> {
  await db.runAsync(
    `DELETE FROM session_heroes WHERE session_id = ? AND hero_id = ?`,
    sessionId,
    heroId,
  );
}

export async function linkNpc(
  db: SQLiteDatabase,
  sessionId: string,
  npcId: string,
): Promise<void> {
  await db.runAsync(
    `INSERT OR IGNORE INTO session_npcs (session_id, npc_id) VALUES (?, ?)`,
    sessionId,
    npcId,
  );
}

export async function unlinkNpc(
  db: SQLiteDatabase,
  sessionId: string,
  npcId: string,
): Promise<void> {
  await db.runAsync(
    `DELETE FROM session_npcs WHERE session_id = ? AND npc_id = ?`,
    sessionId,
    npcId,
  );
}

export async function linkCombatModule(
  db: SQLiteDatabase,
  sessionId: string,
  combatModuleId: string,
): Promise<void> {
  await db.runAsync(
    `INSERT OR IGNORE INTO session_combat_modules (session_id, combat_module_id)
     VALUES (?, ?)`,
    sessionId,
    combatModuleId,
  );
}

export async function unlinkCombatModule(
  db: SQLiteDatabase,
  sessionId: string,
  combatModuleId: string,
): Promise<void> {
  await db.runAsync(
    `DELETE FROM session_combat_modules WHERE session_id = ? AND combat_module_id = ?`,
    sessionId,
    combatModuleId,
  );
}

export async function linkMap(
  db: SQLiteDatabase,
  sessionId: string,
  mapId: string,
): Promise<void> {
  await db.runAsync(
    `INSERT OR IGNORE INTO session_maps (session_id, map_id) VALUES (?, ?)`,
    sessionId,
    mapId,
  );
}

export async function unlinkMap(
  db: SQLiteDatabase,
  sessionId: string,
  mapId: string,
): Promise<void> {
  await db.runAsync(
    `DELETE FROM session_maps WHERE session_id = ? AND map_id = ?`,
    sessionId,
    mapId,
  );
}
