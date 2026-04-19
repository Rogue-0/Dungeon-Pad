import type { SQLiteDatabase } from 'expo-sqlite';

import type { GameMap } from '@/types';
import { generateId } from '@/utils/ids';

import { nowIso } from './shared';

interface MapRow {
  id: string;
  campaign_id: string;
  name: string;
  description: string | null;
  image_uri: string | null;
  created_at: string;
  updated_at: string;
}

function rowToMap(row: MapRow): GameMap {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    name: row.name,
    description: row.description,
    imageUri: row.image_uri,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listByCampaign(
  db: SQLiteDatabase,
  campaignId: string,
): Promise<GameMap[]> {
  const rows = await db.getAllAsync<MapRow>(
    `SELECT * FROM maps WHERE campaign_id = ? ORDER BY name ASC`,
    campaignId,
  );
  return rows.map(rowToMap);
}

export async function getById(
  db: SQLiteDatabase,
  id: string,
): Promise<GameMap | null> {
  const row = await db.getFirstAsync<MapRow>(
    `SELECT * FROM maps WHERE id = ?`,
    id,
  );
  return row ? rowToMap(row) : null;
}

export interface CreateMapInput {
  campaignId: string;
  name: string;
  description?: string | null;
  imageUri?: string | null;
}

export async function create(
  db: SQLiteDatabase,
  input: CreateMapInput,
): Promise<GameMap> {
  const id = generateId();
  const now = nowIso();

  await db.runAsync(
    `INSERT INTO maps (id, campaign_id, name, description, image_uri, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.campaignId,
    input.name,
    input.description ?? null,
    input.imageUri ?? null,
    now,
    now,
  );

  return {
    id,
    campaignId: input.campaignId,
    name: input.name,
    description: input.description ?? null,
    imageUri: input.imageUri ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

export type UpdateMapInput = Partial<Omit<CreateMapInput, 'campaignId'>>;

export async function update(
  db: SQLiteDatabase,
  id: string,
  patch: UpdateMapInput,
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
    `UPDATE maps SET ${fields.join(', ')} WHERE id = ?`,
    ...values,
  );
}

export async function remove(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync(`DELETE FROM maps WHERE id = ?`, id);
}
