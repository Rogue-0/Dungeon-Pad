import type { SQLiteDatabase } from 'expo-sqlite';

import {
  MOCK_CAMPAIGNS,
  MOCK_HEROES,
  MOCK_SESSIONS,
  MOCK_STORY_BEATS,
  MOCK_NPCS,
  MOCK_COMBAT_MODULES,
  MOCK_COMBAT_MONSTERS,
  MOCK_MAPS,
  MOCK_COMPENDIUM_ITEMS,
  SESSION_1_NPC_IDS,
  SESSION_1_MAP_IDS,
  SESSION_1_COMBAT_IDS,
} from '@/utils/mock-data';

/**
 * Seed the database with the Phase 1 mock content (Strahd + Icewind Dale) so
 * users have familiar data to edit on first launch. Called exactly once, when
 * the schema_version row is being inserted for the first time.
 */
export async function seedDatabase(db: SQLiteDatabase): Promise<void> {
  await db.withTransactionAsync(async () => {
    for (const c of MOCK_CAMPAIGNS) {
      await db.runAsync(
        `INSERT INTO campaigns (id, name, image_uri, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?)`,
        c.id,
        c.name,
        c.imageUri,
        c.createdAt,
        c.updatedAt,
      );
    }

    for (const h of MOCK_HEROES) {
      await db.runAsync(
        `INSERT INTO heroes (
          id, campaign_id, name, image_uri, player_name, race, class, level,
          hp, ac, speed, stats, backstory, notable_abilities,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        h.id,
        h.campaignId,
        h.name,
        h.imageUri,
        h.playerName,
        h.race,
        h.class,
        h.level,
        h.hp,
        h.ac,
        h.speed,
        h.stats ? JSON.stringify(h.stats) : null,
        h.backstory,
        h.notableAbilities,
        h.createdAt,
        h.updatedAt,
      );
    }

    for (const s of MOCK_SESSIONS) {
      await db.runAsync(
        `INSERT INTO sessions (
          id, campaign_id, title, description, image_uri,
          session_number, played_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        s.id,
        s.campaignId,
        s.title,
        s.description,
        s.imageUri,
        s.sessionNumber,
        s.playedAt,
        s.createdAt,
        s.updatedAt,
      );
    }

    for (const b of MOCK_STORY_BEATS) {
      await db.runAsync(
        `INSERT INTO story_beats (
          id, session_id, title, body, sort_order, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        b.id,
        b.sessionId,
        b.title,
        b.body,
        b.sortOrder,
        b.createdAt,
        b.updatedAt,
      );
    }

    for (const n of MOCK_NPCS) {
      await db.runAsync(
        `INSERT INTO npcs (
          id, campaign_id, name, image_uri, description, notable_abilities,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        n.id,
        n.campaignId,
        n.name,
        n.imageUri,
        n.description,
        n.notableAbilities,
        n.createdAt,
        n.updatedAt,
      );
    }

    for (const cm of MOCK_COMBAT_MODULES) {
      await db.runAsync(
        `INSERT INTO combat_modules (
          id, campaign_id, title, description, image_uri, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        cm.id,
        cm.campaignId,
        cm.title,
        cm.description,
        cm.imageUri,
        cm.createdAt,
        cm.updatedAt,
      );
    }

    for (const m of MOCK_COMBAT_MONSTERS) {
      await db.runAsync(
        `INSERT INTO combat_monsters (
          id, combat_module_id, name, hp, ac, speed, stat_block,
          srd_index, sort_order, image_uri
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        m.id,
        m.combatModuleId,
        m.name,
        m.hp,
        m.ac,
        m.speed,
        m.statBlock,
        m.srdIndex,
        m.sortOrder,
        m.imageUri,
      );
    }

    for (const map of MOCK_MAPS) {
      await db.runAsync(
        `INSERT INTO maps (id, campaign_id, name, image_uri, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        map.id,
        map.campaignId,
        map.name,
        map.imageUri,
        map.createdAt,
        map.updatedAt,
      );
    }

    for (const item of MOCK_COMPENDIUM_ITEMS) {
      await db.runAsync(
        `INSERT INTO compendium_items (
          id, campaign_id, title, type, summary, source, source_url,
          entity_id, body, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        item.id,
        item.campaignId,
        item.title,
        item.type,
        item.summary,
        item.source,
        item.sourceUrl ?? null,
        item.entityId ?? null,
        item.body ?? null,
        item.createdAt,
        item.updatedAt,
      );
    }

    for (const npcId of SESSION_1_NPC_IDS) {
      await db.runAsync(
        `INSERT INTO session_npcs (session_id, npc_id) VALUES (?, ?)`,
        'session-1',
        npcId,
      );
    }
    for (const mapId of SESSION_1_MAP_IDS) {
      await db.runAsync(
        `INSERT INTO session_maps (session_id, map_id) VALUES (?, ?)`,
        'session-1',
        mapId,
      );
    }
    for (const combatId of SESSION_1_COMBAT_IDS) {
      await db.runAsync(
        `INSERT INTO session_combat_modules (session_id, combat_module_id) VALUES (?, ?)`,
        'session-1',
        combatId,
      );
    }
  });
}
