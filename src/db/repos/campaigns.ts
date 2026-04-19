import type { SQLiteDatabase } from 'expo-sqlite';

import type { Campaign, CampaignWithStats } from '@/types';
import { generateId } from '@/utils/ids';

import { nowIso } from './shared';

interface CampaignRow {
  id: string;
  name: string;
  description: string | null;
  image_uri: string | null;
  created_at: string;
  updated_at: string;
}

interface CampaignWithStatsRow extends CampaignRow {
  session_count: number;
  combat_module_count: number;
  npc_count: number;
  hero_count: number;
  map_count: number;
}

function rowToCampaign(row: CampaignRow): Campaign {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    imageUri: row.image_uri,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToCampaignWithStats(row: CampaignWithStatsRow): CampaignWithStats {
  return {
    ...rowToCampaign(row),
    sessionCount: row.session_count,
    combatModuleCount: row.combat_module_count,
    npcCount: row.npc_count,
    heroCount: row.hero_count,
    mapCount: row.map_count,
  };
}

export async function listWithStats(db: SQLiteDatabase): Promise<CampaignWithStats[]> {
  const rows = await db.getAllAsync<CampaignWithStatsRow>(
    `SELECT
       c.*,
       (SELECT COUNT(*) FROM sessions WHERE campaign_id = c.id) AS session_count,
       (SELECT COUNT(*) FROM combat_modules WHERE campaign_id = c.id) AS combat_module_count,
       (SELECT COUNT(*) FROM npcs WHERE campaign_id = c.id) AS npc_count,
       (SELECT COUNT(*) FROM heroes WHERE campaign_id = c.id) AS hero_count,
       (SELECT COUNT(*) FROM maps WHERE campaign_id = c.id) AS map_count
     FROM campaigns c
     ORDER BY c.updated_at DESC`,
  );
  return rows.map(rowToCampaignWithStats);
}

export async function getById(
  db: SQLiteDatabase,
  id: string,
): Promise<Campaign | null> {
  const row = await db.getFirstAsync<CampaignRow>(
    `SELECT * FROM campaigns WHERE id = ?`,
    id,
  );
  return row ? rowToCampaign(row) : null;
}

export interface CreateCampaignInput {
  name: string;
  description?: string | null;
  imageUri?: string | null;
}

export async function create(
  db: SQLiteDatabase,
  input: CreateCampaignInput,
): Promise<Campaign> {
  const id = generateId();
  const now = nowIso();
  await db.runAsync(
    `INSERT INTO campaigns (id, name, description, image_uri, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    id,
    input.name,
    input.description ?? null,
    input.imageUri ?? null,
    now,
    now,
  );
  return {
    id,
    name: input.name,
    description: input.description ?? null,
    imageUri: input.imageUri ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

export interface UpdateCampaignInput {
  name?: string;
  description?: string | null;
  imageUri?: string | null;
}

export async function update(
  db: SQLiteDatabase,
  id: string,
  patch: UpdateCampaignInput,
): Promise<void> {
  const fields: string[] = [];
  const values: (string | null)[] = [];

  if (patch.name !== undefined) {
    fields.push('name = ?');
    values.push(patch.name);
  }
  if (patch.description !== undefined) {
    fields.push('description = ?');
    values.push(patch.description);
  }
  if (patch.imageUri !== undefined) {
    fields.push('image_uri = ?');
    values.push(patch.imageUri);
  }
  if (fields.length === 0) return;

  fields.push('updated_at = ?');
  values.push(nowIso());
  values.push(id);

  await db.runAsync(
    `UPDATE campaigns SET ${fields.join(', ')} WHERE id = ?`,
    ...values,
  );
}

export async function remove(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync(`DELETE FROM campaigns WHERE id = ?`, id);
}
