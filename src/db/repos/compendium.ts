import type { SQLiteDatabase } from 'expo-sqlite';

import type { CompendiumItem, CompendiumItemType, CompendiumSource } from '@/types';
import { generateId } from '@/utils/ids';

import { nowIso } from './shared';

interface CompendiumRow {
  id: string;
  campaign_id: string | null;
  title: string;
  type: string;
  summary: string;
  source: string;
  source_url: string | null;
  entity_id: string | null;
  body: string | null;
  created_at: string;
  updated_at: string;
}

function rowToCompendium(row: CompendiumRow): CompendiumItem {
  return {
    id: row.id,
    campaignId: row.campaign_id ?? '',
    title: row.title,
    type: row.type as CompendiumItemType,
    summary: row.summary,
    source: row.source as CompendiumSource,
    sourceUrl: row.source_url ?? undefined,
    entityId: row.entity_id ?? undefined,
    body: row.body ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listAll(db: SQLiteDatabase): Promise<CompendiumItem[]> {
  const rows = await db.getAllAsync<CompendiumRow>(
    `SELECT * FROM compendium_items ORDER BY updated_at DESC`,
  );
  return rows.map(rowToCompendium);
}

export async function listByCampaign(
  db: SQLiteDatabase,
  campaignId: string,
): Promise<CompendiumItem[]> {
  const rows = await db.getAllAsync<CompendiumRow>(
    `SELECT * FROM compendium_items WHERE campaign_id = ? ORDER BY updated_at DESC`,
    campaignId,
  );
  return rows.map(rowToCompendium);
}

export async function getById(
  db: SQLiteDatabase,
  id: string,
): Promise<CompendiumItem | null> {
  const row = await db.getFirstAsync<CompendiumRow>(
    `SELECT * FROM compendium_items WHERE id = ?`,
    id,
  );
  return row ? rowToCompendium(row) : null;
}

export interface CreateCompendiumInput {
  campaignId: string;
  title: string;
  type: CompendiumItemType;
  summary?: string;
  source?: CompendiumSource;
  sourceUrl?: string | null;
  entityId?: string | null;
  body?: string | null;
}

export async function create(
  db: SQLiteDatabase,
  input: CreateCompendiumInput,
): Promise<CompendiumItem> {
  const id = generateId();
  const now = nowIso();
  const summary = input.summary ?? '';
  const source = input.source ?? 'Created in app';

  await db.runAsync(
    `INSERT INTO compendium_items (
      id, campaign_id, title, type, summary, source, source_url,
      entity_id, body, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.campaignId,
    input.title,
    input.type,
    summary,
    source,
    input.sourceUrl ?? null,
    input.entityId ?? null,
    input.body ?? null,
    now,
    now,
  );

  return {
    id,
    campaignId: input.campaignId,
    title: input.title,
    type: input.type,
    summary,
    source,
    sourceUrl: input.sourceUrl ?? undefined,
    entityId: input.entityId ?? undefined,
    body: input.body ?? undefined,
    createdAt: now,
    updatedAt: now,
  };
}

export type UpdateCompendiumInput = Partial<Omit<CreateCompendiumInput, 'campaignId'>>;

export async function update(
  db: SQLiteDatabase,
  id: string,
  patch: UpdateCompendiumInput,
): Promise<void> {
  const fields: string[] = [];
  const values: (string | null)[] = [];

  const setField = (column: string, value: string | null | undefined) => {
    if (value === undefined) return;
    fields.push(`${column} = ?`);
    values.push(value);
  };

  setField('title', patch.title);
  setField('type', patch.type);
  setField('summary', patch.summary);
  setField('source', patch.source);
  setField('source_url', patch.sourceUrl);
  setField('entity_id', patch.entityId);
  setField('body', patch.body);

  if (fields.length === 0) return;

  fields.push('updated_at = ?');
  values.push(nowIso());
  values.push(id);

  await db.runAsync(
    `UPDATE compendium_items SET ${fields.join(', ')} WHERE id = ?`,
    ...values,
  );
}

export async function remove(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync(`DELETE FROM compendium_items WHERE id = ?`, id);
}
