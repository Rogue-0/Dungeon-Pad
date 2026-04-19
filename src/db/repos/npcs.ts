import type { SQLiteDatabase } from 'expo-sqlite';

import type { NPC } from '@/types';
import { generateId } from '@/utils/ids';

import { nowIso } from './shared';

interface NpcRow {
  id: string;
  campaign_id: string;
  name: string;
  image_uri: string | null;
  description: string | null;
  notable_abilities: string | null;
  created_at: string;
  updated_at: string;
}

function rowToNpc(row: NpcRow): NPC {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    name: row.name,
    imageUri: row.image_uri,
    description: row.description,
    notableAbilities: row.notable_abilities,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listByCampaign(
  db: SQLiteDatabase,
  campaignId: string,
): Promise<NPC[]> {
  const rows = await db.getAllAsync<NpcRow>(
    `SELECT * FROM npcs WHERE campaign_id = ? ORDER BY name ASC`,
    campaignId,
  );
  return rows.map(rowToNpc);
}

export async function getById(db: SQLiteDatabase, id: string): Promise<NPC | null> {
  const row = await db.getFirstAsync<NpcRow>(
    `SELECT * FROM npcs WHERE id = ?`,
    id,
  );
  return row ? rowToNpc(row) : null;
}

export interface CreateNpcInput {
  campaignId: string;
  name: string;
  description?: string | null;
  notableAbilities?: string | null;
  imageUri?: string | null;
}

export async function create(
  db: SQLiteDatabase,
  input: CreateNpcInput,
): Promise<NPC> {
  const id = generateId();
  const now = nowIso();

  await db.runAsync(
    `INSERT INTO npcs (
      id, campaign_id, name, image_uri, description, notable_abilities,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.campaignId,
    input.name,
    input.imageUri ?? null,
    input.description ?? null,
    input.notableAbilities ?? null,
    now,
    now,
  );

  return {
    id,
    campaignId: input.campaignId,
    name: input.name,
    imageUri: input.imageUri ?? null,
    description: input.description ?? null,
    notableAbilities: input.notableAbilities ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

export type UpdateNpcInput = Partial<Omit<CreateNpcInput, 'campaignId'>>;

export async function update(
  db: SQLiteDatabase,
  id: string,
  patch: UpdateNpcInput,
): Promise<void> {
  const fields: string[] = [];
  const values: (string | null)[] = [];

  const setField = (column: string, value: string | null | undefined) => {
    if (value === undefined) return;
    fields.push(`${column} = ?`);
    values.push(value);
  };

  setField('name', patch.name);
  setField('image_uri', patch.imageUri);
  setField('description', patch.description);
  setField('notable_abilities', patch.notableAbilities);

  if (fields.length === 0) return;

  fields.push('updated_at = ?');
  values.push(nowIso());
  values.push(id);

  await db.runAsync(
    `UPDATE npcs SET ${fields.join(', ')} WHERE id = ?`,
    ...values,
  );
}

export async function remove(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync(`DELETE FROM npcs WHERE id = ?`, id);
}
