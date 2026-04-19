import type { SQLiteDatabase } from 'expo-sqlite';

import type { Hero, HeroStats } from '@/types';
import { generateId } from '@/utils/ids';

import { nowIso } from './shared';

interface HeroRow {
  id: string;
  campaign_id: string;
  name: string;
  image_uri: string | null;
  player_name: string | null;
  race: string | null;
  class: string | null;
  level: number | null;
  hp: number | null;
  ac: number | null;
  speed: string | null;
  stats: string | null;
  backstory: string | null;
  notable_abilities: string | null;
  created_at: string;
  updated_at: string;
}

function parseStats(raw: string | null): HeroStats | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as HeroStats;
  } catch {
    return null;
  }
}

function rowToHero(row: HeroRow): Hero {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    name: row.name,
    imageUri: row.image_uri,
    playerName: row.player_name,
    race: row.race,
    class: row.class,
    level: row.level,
    hp: row.hp,
    ac: row.ac,
    speed: row.speed,
    stats: parseStats(row.stats),
    backstory: row.backstory,
    notableAbilities: row.notable_abilities,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listByCampaign(
  db: SQLiteDatabase,
  campaignId: string,
): Promise<Hero[]> {
  const rows = await db.getAllAsync<HeroRow>(
    `SELECT * FROM heroes WHERE campaign_id = ? ORDER BY name ASC`,
    campaignId,
  );
  return rows.map(rowToHero);
}

export async function getById(db: SQLiteDatabase, id: string): Promise<Hero | null> {
  const row = await db.getFirstAsync<HeroRow>(
    `SELECT * FROM heroes WHERE id = ?`,
    id,
  );
  return row ? rowToHero(row) : null;
}

export interface CreateHeroInput {
  campaignId: string;
  name: string;
  playerName?: string | null;
  race?: string | null;
  class?: string | null;
  level?: number | null;
  hp?: number | null;
  ac?: number | null;
  speed?: string | null;
  stats?: HeroStats | null;
  backstory?: string | null;
  notableAbilities?: string | null;
  imageUri?: string | null;
}

export async function create(
  db: SQLiteDatabase,
  input: CreateHeroInput,
): Promise<Hero> {
  const id = generateId();
  const now = nowIso();
  const stats = input.stats ? JSON.stringify(input.stats) : null;

  await db.runAsync(
    `INSERT INTO heroes (
      id, campaign_id, name, image_uri, player_name, race, class, level,
      hp, ac, speed, stats, backstory, notable_abilities,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.campaignId,
    input.name,
    input.imageUri ?? null,
    input.playerName ?? null,
    input.race ?? null,
    input.class ?? null,
    input.level ?? null,
    input.hp ?? null,
    input.ac ?? null,
    input.speed ?? null,
    stats,
    input.backstory ?? null,
    input.notableAbilities ?? null,
    now,
    now,
  );

  return {
    id,
    campaignId: input.campaignId,
    name: input.name,
    imageUri: input.imageUri ?? null,
    playerName: input.playerName ?? null,
    race: input.race ?? null,
    class: input.class ?? null,
    level: input.level ?? null,
    hp: input.hp ?? null,
    ac: input.ac ?? null,
    speed: input.speed ?? null,
    stats: input.stats ?? null,
    backstory: input.backstory ?? null,
    notableAbilities: input.notableAbilities ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

export type UpdateHeroInput = Partial<Omit<CreateHeroInput, 'campaignId'>>;

export async function update(
  db: SQLiteDatabase,
  id: string,
  patch: UpdateHeroInput,
): Promise<void> {
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  const setField = (column: string, value: string | number | null | undefined) => {
    if (value === undefined) return;
    fields.push(`${column} = ?`);
    values.push(value);
  };

  setField('name', patch.name);
  setField('image_uri', patch.imageUri);
  setField('player_name', patch.playerName);
  setField('race', patch.race);
  setField('class', patch.class);
  setField('level', patch.level);
  setField('hp', patch.hp);
  setField('ac', patch.ac);
  setField('speed', patch.speed);
  setField('backstory', patch.backstory);
  setField('notable_abilities', patch.notableAbilities);

  if (patch.stats !== undefined) {
    fields.push('stats = ?');
    values.push(patch.stats ? JSON.stringify(patch.stats) : null);
  }

  if (fields.length === 0) return;

  fields.push('updated_at = ?');
  values.push(nowIso());
  values.push(id);

  await db.runAsync(
    `UPDATE heroes SET ${fields.join(', ')} WHERE id = ?`,
    ...values,
  );
}

export async function remove(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync(`DELETE FROM heroes WHERE id = ?`, id);
}
