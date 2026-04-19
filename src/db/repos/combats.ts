import type { SQLiteDatabase } from 'expo-sqlite';

import type { CombatModule, CombatMonster, InitiativeEntry } from '@/types';
import { generateId } from '@/utils/ids';

import { nowIso } from './shared';

interface CombatModuleRow {
  id: string;
  campaign_id: string;
  title: string;
  description: string | null;
  image_uri: string | null;
  created_at: string;
  updated_at: string;
}

interface CombatMonsterRow {
  id: string;
  combat_module_id: string;
  name: string;
  hp: number | null;
  ac: number | null;
  speed: string | null;
  stat_block: string | null;
  srd_index: string | null;
  sort_order: number;
  image_uri: string | null;
}

interface InitiativeRow {
  id: string;
  combat_module_id: string;
  entity_type: string;
  entity_id: string;
  initiative_value: number | null;
  sort_order: number;
}

function rowToCombatModule(row: CombatModuleRow): CombatModule {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    title: row.title,
    description: row.description,
    imageUri: row.image_uri,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToMonster(row: CombatMonsterRow): CombatMonster {
  return {
    id: row.id,
    combatModuleId: row.combat_module_id,
    name: row.name,
    hp: row.hp,
    ac: row.ac,
    speed: row.speed,
    statBlock: row.stat_block,
    srdIndex: row.srd_index,
    sortOrder: row.sort_order,
    imageUri: row.image_uri,
  };
}

function rowToInitiative(row: InitiativeRow): InitiativeEntry {
  return {
    id: row.id,
    combatModuleId: row.combat_module_id,
    entityType: row.entity_type === 'hero' ? 'hero' : 'monster',
    entityId: row.entity_id,
    initiativeValue: row.initiative_value,
    sortOrder: row.sort_order,
  };
}

// ─── Combat modules ─────────────────────────────────────────────────────────

export async function listByCampaign(
  db: SQLiteDatabase,
  campaignId: string,
): Promise<CombatModule[]> {
  const rows = await db.getAllAsync<CombatModuleRow>(
    `SELECT * FROM combat_modules WHERE campaign_id = ? ORDER BY updated_at DESC`,
    campaignId,
  );
  return rows.map(rowToCombatModule);
}

export async function getById(
  db: SQLiteDatabase,
  id: string,
): Promise<CombatModule | null> {
  const row = await db.getFirstAsync<CombatModuleRow>(
    `SELECT * FROM combat_modules WHERE id = ?`,
    id,
  );
  return row ? rowToCombatModule(row) : null;
}

export interface CreateCombatModuleInput {
  campaignId: string;
  title: string;
  description?: string | null;
  imageUri?: string | null;
}

export async function create(
  db: SQLiteDatabase,
  input: CreateCombatModuleInput,
): Promise<CombatModule> {
  const id = generateId();
  const now = nowIso();

  await db.runAsync(
    `INSERT INTO combat_modules (
      id, campaign_id, title, description, image_uri, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.campaignId,
    input.title,
    input.description ?? null,
    input.imageUri ?? null,
    now,
    now,
  );

  return {
    id,
    campaignId: input.campaignId,
    title: input.title,
    description: input.description ?? null,
    imageUri: input.imageUri ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

export type UpdateCombatModuleInput = Partial<Omit<CreateCombatModuleInput, 'campaignId'>>;

export async function update(
  db: SQLiteDatabase,
  id: string,
  patch: UpdateCombatModuleInput,
): Promise<void> {
  const fields: string[] = [];
  const values: (string | null)[] = [];

  const setField = (column: string, value: string | null | undefined) => {
    if (value === undefined) return;
    fields.push(`${column} = ?`);
    values.push(value);
  };

  setField('title', patch.title);
  setField('description', patch.description);
  setField('image_uri', patch.imageUri);

  if (fields.length === 0) return;

  fields.push('updated_at = ?');
  values.push(nowIso());
  values.push(id);

  await db.runAsync(
    `UPDATE combat_modules SET ${fields.join(', ')} WHERE id = ?`,
    ...values,
  );
}

export async function remove(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync(`DELETE FROM combat_modules WHERE id = ?`, id);
}

// ─── Monsters ───────────────────────────────────────────────────────────────

export async function listMonsters(
  db: SQLiteDatabase,
  combatModuleId: string,
): Promise<CombatMonster[]> {
  const rows = await db.getAllAsync<CombatMonsterRow>(
    `SELECT * FROM combat_monsters WHERE combat_module_id = ? ORDER BY sort_order ASC`,
    combatModuleId,
  );
  return rows.map(rowToMonster);
}

export interface CreateMonsterInput {
  combatModuleId: string;
  name: string;
  hp?: number | null;
  ac?: number | null;
  speed?: string | null;
  statBlock?: string | null;
  srdIndex?: string | null;
  sortOrder?: number;
  imageUri?: string | null;
}

export async function createMonster(
  db: SQLiteDatabase,
  input: CreateMonsterInput,
): Promise<CombatMonster> {
  const id = generateId();

  let sortOrder = input.sortOrder;
  if (sortOrder === undefined) {
    const row = await db.getFirstAsync<{ max_order: number | null }>(
      `SELECT MAX(sort_order) AS max_order FROM combat_monsters WHERE combat_module_id = ?`,
      input.combatModuleId,
    );
    sortOrder = (row?.max_order ?? -1) + 1;
  }

  await db.runAsync(
    `INSERT INTO combat_monsters (
      id, combat_module_id, name, hp, ac, speed, stat_block,
      srd_index, sort_order, image_uri
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.combatModuleId,
    input.name,
    input.hp ?? null,
    input.ac ?? null,
    input.speed ?? null,
    input.statBlock ?? null,
    input.srdIndex ?? null,
    sortOrder,
    input.imageUri ?? null,
  );

  return {
    id,
    combatModuleId: input.combatModuleId,
    name: input.name,
    hp: input.hp ?? null,
    ac: input.ac ?? null,
    speed: input.speed ?? null,
    statBlock: input.statBlock ?? null,
    srdIndex: input.srdIndex ?? null,
    sortOrder,
    imageUri: input.imageUri ?? null,
  };
}

export type UpdateMonsterInput = Partial<Omit<CreateMonsterInput, 'combatModuleId'>>;

export async function updateMonster(
  db: SQLiteDatabase,
  id: string,
  patch: UpdateMonsterInput,
): Promise<void> {
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  const setField = (column: string, value: string | number | null | undefined) => {
    if (value === undefined) return;
    fields.push(`${column} = ?`);
    values.push(value);
  };

  setField('name', patch.name);
  setField('hp', patch.hp);
  setField('ac', patch.ac);
  setField('speed', patch.speed);
  setField('stat_block', patch.statBlock);
  setField('srd_index', patch.srdIndex);
  setField('sort_order', patch.sortOrder);
  setField('image_uri', patch.imageUri);

  if (fields.length === 0) return;
  values.push(id);

  await db.runAsync(
    `UPDATE combat_monsters SET ${fields.join(', ')} WHERE id = ?`,
    ...values,
  );
}

export async function removeMonster(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync(`DELETE FROM combat_monsters WHERE id = ?`, id);
}

// ─── Initiative ─────────────────────────────────────────────────────────────

export async function listInitiative(
  db: SQLiteDatabase,
  combatModuleId: string,
): Promise<InitiativeEntry[]> {
  const rows = await db.getAllAsync<InitiativeRow>(
    `SELECT * FROM initiative_entries WHERE combat_module_id = ? ORDER BY sort_order ASC`,
    combatModuleId,
  );
  return rows.map(rowToInitiative);
}

export interface CreateInitiativeInput {
  combatModuleId: string;
  entityType: 'hero' | 'monster';
  entityId: string;
  initiativeValue?: number | null;
  sortOrder?: number;
}

export async function createInitiative(
  db: SQLiteDatabase,
  input: CreateInitiativeInput,
): Promise<InitiativeEntry> {
  const id = generateId();

  let sortOrder = input.sortOrder;
  if (sortOrder === undefined) {
    const row = await db.getFirstAsync<{ max_order: number | null }>(
      `SELECT MAX(sort_order) AS max_order FROM initiative_entries WHERE combat_module_id = ?`,
      input.combatModuleId,
    );
    sortOrder = (row?.max_order ?? -1) + 1;
  }

  await db.runAsync(
    `INSERT INTO initiative_entries (
      id, combat_module_id, entity_type, entity_id, initiative_value, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    id,
    input.combatModuleId,
    input.entityType,
    input.entityId,
    input.initiativeValue ?? null,
    sortOrder,
  );

  return {
    id,
    combatModuleId: input.combatModuleId,
    entityType: input.entityType,
    entityId: input.entityId,
    initiativeValue: input.initiativeValue ?? null,
    sortOrder,
  };
}

export async function updateInitiativeValue(
  db: SQLiteDatabase,
  id: string,
  value: number | null,
): Promise<void> {
  await db.runAsync(
    `UPDATE initiative_entries SET initiative_value = ? WHERE id = ?`,
    value,
    id,
  );
}

export async function removeInitiative(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync(`DELETE FROM initiative_entries WHERE id = ?`, id);
}
