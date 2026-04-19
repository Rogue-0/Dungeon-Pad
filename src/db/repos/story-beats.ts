import type { SQLiteDatabase } from 'expo-sqlite';

import type { StoryBeat } from '@/types';
import { generateId } from '@/utils/ids';

import { nowIso } from './shared';

interface StoryBeatRow {
  id: string;
  session_id: string;
  title: string;
  body: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

function rowToStoryBeat(row: StoryBeatRow): StoryBeat {
  return {
    id: row.id,
    sessionId: row.session_id,
    title: row.title,
    body: row.body,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listBySession(
  db: SQLiteDatabase,
  sessionId: string,
): Promise<StoryBeat[]> {
  const rows = await db.getAllAsync<StoryBeatRow>(
    `SELECT * FROM story_beats WHERE session_id = ? ORDER BY sort_order ASC`,
    sessionId,
  );
  return rows.map(rowToStoryBeat);
}

export async function getById(
  db: SQLiteDatabase,
  id: string,
): Promise<StoryBeat | null> {
  const row = await db.getFirstAsync<StoryBeatRow>(
    `SELECT * FROM story_beats WHERE id = ?`,
    id,
  );
  return row ? rowToStoryBeat(row) : null;
}

export interface CreateStoryBeatInput {
  sessionId: string;
  title: string;
  body?: string | null;
  sortOrder?: number;
}

export async function create(
  db: SQLiteDatabase,
  input: CreateStoryBeatInput,
): Promise<StoryBeat> {
  const id = generateId();
  const now = nowIso();

  let sortOrder = input.sortOrder;
  if (sortOrder === undefined) {
    const row = await db.getFirstAsync<{ max_order: number | null }>(
      `SELECT MAX(sort_order) AS max_order FROM story_beats WHERE session_id = ?`,
      input.sessionId,
    );
    sortOrder = (row?.max_order ?? -1) + 1;
  }

  await db.runAsync(
    `INSERT INTO story_beats (
      id, session_id, title, body, sort_order, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.sessionId,
    input.title,
    input.body ?? null,
    sortOrder,
    now,
    now,
  );

  return {
    id,
    sessionId: input.sessionId,
    title: input.title,
    body: input.body ?? null,
    sortOrder,
    createdAt: now,
    updatedAt: now,
  };
}

export interface UpdateStoryBeatInput {
  title?: string;
  body?: string | null;
  sortOrder?: number;
}

export async function update(
  db: SQLiteDatabase,
  id: string,
  patch: UpdateStoryBeatInput,
): Promise<void> {
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (patch.title !== undefined) {
    fields.push('title = ?');
    values.push(patch.title);
  }
  if (patch.body !== undefined) {
    fields.push('body = ?');
    values.push(patch.body);
  }
  if (patch.sortOrder !== undefined) {
    fields.push('sort_order = ?');
    values.push(patch.sortOrder);
  }
  if (fields.length === 0) return;

  fields.push('updated_at = ?');
  values.push(nowIso());
  values.push(id);

  await db.runAsync(
    `UPDATE story_beats SET ${fields.join(', ')} WHERE id = ?`,
    ...values,
  );
}

export async function remove(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync(`DELETE FROM story_beats WHERE id = ?`, id);
}

/**
 * Rewrite sort_order for all beats in a session. Caller supplies the ids in
 * the order they should appear. Used after drag-reordering.
 */
export async function reorder(
  db: SQLiteDatabase,
  sessionId: string,
  orderedIds: string[],
): Promise<void> {
  const now = nowIso();
  await db.withTransactionAsync(async () => {
    for (let i = 0; i < orderedIds.length; i++) {
      await db.runAsync(
        `UPDATE story_beats SET sort_order = ?, updated_at = ?
         WHERE id = ? AND session_id = ?`,
        i,
        now,
        orderedIds[i],
        sessionId,
      );
    }
  });
}
