import type {
  CampaignWithStats,
  Session,
  StoryBeat,
  Hero,
  NPC,
  CombatModule,
  CombatMonster,
  GameMap,
} from '@/types';

// ─── Campaigns ───────────────────────────────────────────────────────────────

export const MOCK_CAMPAIGNS: CampaignWithStats[] = [
  {
    id: 'campaign-1',
    name: 'Curse of Strahd',
    createdAt: '2025-09-01T00:00:00Z',
    updatedAt: '2026-03-28T00:00:00Z',
    sessionCount: 10,
    combatModuleCount: 16,
    npcCount: 24,
    heroCount: 4,
    mapCount: 3,
  },
  {
    id: 'campaign-2',
    name: 'Icewind Dale',
    createdAt: '2025-06-15T00:00:00Z',
    updatedAt: '2026-03-20T00:00:00Z',
    sessionCount: 24,
    combatModuleCount: 32,
    npcCount: 20,
    heroCount: 5,
    mapCount: 10,
  },
];

// ─── Heroes (Curse of Strahd) ────────────────────────────────────────────────

export const MOCK_HEROES: Hero[] = [
  { id: 'hero-1', campaignId: 'campaign-1', name: 'Player 1', imageUri: null, playerName: 'Alex', class: 'Fighter', level: 7, createdAt: '2025-09-01T00:00:00Z', updatedAt: '2025-09-01T00:00:00Z' },
  { id: 'hero-2', campaignId: 'campaign-1', name: 'Player 2', imageUri: null, playerName: 'Sam', class: 'Wizard', level: 7, createdAt: '2025-09-01T00:00:00Z', updatedAt: '2025-09-01T00:00:00Z' },
  { id: 'hero-3', campaignId: 'campaign-1', name: 'Player 3', imageUri: null, playerName: 'Jordan', class: 'Cleric', level: 7, createdAt: '2025-09-01T00:00:00Z', updatedAt: '2025-09-01T00:00:00Z' },
  { id: 'hero-4', campaignId: 'campaign-1', name: 'Player 4', imageUri: null, playerName: 'Morgan', class: 'Rogue', level: 7, createdAt: '2025-09-01T00:00:00Z', updatedAt: '2025-09-01T00:00:00Z' },
];

// ─── Sessions (Curse of Strahd) ──────────────────────────────────────────────

export const MOCK_SESSIONS: Session[] = [
  { id: 'session-1', campaignId: 'campaign-1', title: 'Into the Death House', sessionNumber: 1, playedAt: '2025-09-15T00:00:00Z', createdAt: '2025-09-15T00:00:00Z', updatedAt: '2025-09-15T00:00:00Z' },
  { id: 'session-2', campaignId: 'campaign-1', title: 'Village of Barovia', sessionNumber: 2, playedAt: '2025-09-22T00:00:00Z', createdAt: '2025-09-22T00:00:00Z', updatedAt: '2025-09-22T00:00:00Z' },
  { id: 'session-3', campaignId: 'campaign-1', title: 'Tser Pool Vistani', sessionNumber: 4, playedAt: '2025-10-06T00:00:00Z', createdAt: '2025-10-06T00:00:00Z', updatedAt: '2025-10-06T00:00:00Z' },
  { id: 'session-10', campaignId: 'campaign-1', title: 'Castle Ravenloft', sessionNumber: 10, playedAt: '2026-03-28T00:00:00Z', createdAt: '2026-03-28T00:00:00Z', updatedAt: '2026-03-28T00:00:00Z' },
];

// ─── Story Beats (Session 1 — Into the Death House) ──────────────────────────

export const MOCK_STORY_BEATS: StoryBeat[] = [
  {
    id: 'beat-1',
    sessionId: 'session-1',
    title: 'Party Appears on the Road',
    body: 'Surrounded by dense fog, the party finds themselves standing on a dirt road. Unfamiliar surroundings, ominous noises moan from behind the canopy of mist. Shades of trees reach out grasping like crooked fingers, the air smells of iron and rain. Along the road sits a house, looming over the surrounding farmland, standing guard over its land.',
    sortOrder: 0,
    createdAt: '2025-09-15T00:00:00Z',
    updatedAt: '2025-09-15T00:00:00Z',
  },
  {
    id: 'beat-2',
    sessionId: 'session-1',
    title: 'Approaching the House',
    body: 'Lorem ipsum dolor sit amet consectetur. Cum sed hendrerit nibh fusce mattis. Ut lectus dictumst at elementum pellentesque consectetur in. Penatibus pellentesque posuere in bibendum. Ac iaculis neque senectus facilisi risus cum ut.\n\n• Trap on the door: DC 15 to identify, 2d6 to disarm\n• If the party breaks the door down, trigger combat module 2',
    sortOrder: 1,
    createdAt: '2025-09-15T00:00:00Z',
    updatedAt: '2025-09-15T00:00:00Z',
  },
  {
    id: 'beat-3',
    sessionId: 'session-1',
    title: 'The Foyer',
    body: null,
    sortOrder: 2,
    createdAt: '2025-09-15T00:00:00Z',
    updatedAt: '2025-09-15T00:00:00Z',
  },
  {
    id: 'beat-4',
    sessionId: 'session-1',
    title: 'The Living Room',
    body: null,
    sortOrder: 3,
    createdAt: '2025-09-15T00:00:00Z',
    updatedAt: '2025-09-15T00:00:00Z',
  },
  {
    id: 'beat-5',
    sessionId: 'session-1',
    title: 'The Kitchen',
    body: null,
    sortOrder: 4,
    createdAt: '2025-09-15T00:00:00Z',
    updatedAt: '2025-09-15T00:00:00Z',
  },
];

// ─── NPCs (Curse of Strahd) ─────────────────────────────────────────────────

export const MOCK_NPCS: NPC[] = [
  {
    id: 'npc-1',
    campaignId: 'campaign-1',
    name: 'Strahd Von Zarovich',
    imageUri: null,
    description: 'The vampire lord of Barovia. Ancient, cunning, and utterly ruthless. He rules Castle Ravenloft and all the land around it with an iron fist, eternally seeking to reclaim his lost love.',
    notableAbilities: 'Vampire abilities: shapechange, charm, regeneration, wall climbing. Spellcaster (9th level). Lair actions in Castle Ravenloft. Cannot enter a residence without invitation.',
    createdAt: '2025-09-01T00:00:00Z',
    updatedAt: '2025-09-01T00:00:00Z',
  },
  {
    id: 'npc-2',
    campaignId: 'campaign-1',
    name: 'King Reginald Rigalsby',
    imageUri: null,
    description: 'A once-proud ruler now reduced to a shadow of his former self under the curse of Barovia.',
    notableAbilities: 'Royal decree authority. Knowledge of Barovian history and hidden passages.',
    createdAt: '2025-09-01T00:00:00Z',
    updatedAt: '2025-09-01T00:00:00Z',
  },
  {
    id: 'npc-3',
    campaignId: 'campaign-1',
    name: 'Sheldon the Pedler',
    imageUri: null,
    description: 'A traveling merchant who appears at the most unexpected times, offering wares of questionable origin.',
    notableAbilities: 'Seemingly infinite inventory. Knows secret paths through the mists.',
    createdAt: '2025-09-01T00:00:00Z',
    updatedAt: '2025-09-01T00:00:00Z',
  },
  {
    id: 'npc-4',
    campaignId: 'campaign-1',
    name: 'Richter Van Virke Charleston III',
    imageUri: null,
    description: 'A nobleman with a long family history tied to the dark secrets of Barovia.',
    notableAbilities: 'Extensive knowledge of vampire lore. Wealthy patron.',
    createdAt: '2025-09-01T00:00:00Z',
    updatedAt: '2025-09-01T00:00:00Z',
  },
];

// ─── Combat Modules (Curse of Strahd) ────────────────────────────────────────

export const MOCK_COMBAT_MODULES: CombatModule[] = [
  { id: 'combat-1', campaignId: 'campaign-1', title: 'Combat in the Alleyway', createdAt: '2025-09-15T00:00:00Z', updatedAt: '2025-09-15T00:00:00Z' },
  { id: 'combat-2', campaignId: 'campaign-1', title: 'Fight at the Tavern', createdAt: '2025-09-22T00:00:00Z', updatedAt: '2025-09-22T00:00:00Z' },
  { id: 'combat-3', campaignId: 'campaign-1', title: 'Combat on the Bridge', createdAt: '2025-10-06T00:00:00Z', updatedAt: '2025-10-06T00:00:00Z' },
  { id: 'combat-4', campaignId: 'campaign-1', title: 'Sneaking into the Castle', createdAt: '2026-03-28T00:00:00Z', updatedAt: '2026-03-28T00:00:00Z' },
];

// ─── Combat Monsters (for "Combat in the Alleyway") ──────────────────────────

export const MOCK_COMBAT_MONSTERS: CombatMonster[] = [
  {
    id: 'monster-1',
    combatModuleId: 'combat-1',
    name: 'Dire Wolf',
    hp: 32,
    ac: 16,
    speed: '30',
    statBlock: 'STR 17 (+3) DEX 15 (+2) CON 15 (+2) INT 3 (-4) WIS 12 (+1) CHA 7 (-2)\n\nSkills: Perception +3, Stealth +4\nSenses: passive Perception 13\n\nBite: +5 to hit, 2d6+3 piercing. Target must succeed DC 13 STR save or be knocked prone.\n\nPack Tactics: Advantage on attack rolls against a creature if at least one ally is within 5 ft.',
    srdIndex: 'dire-wolf',
    sortOrder: 0,
    imageUri: null,
  },
];

// ─── Maps (Curse of Strahd) ─────────────────────────────────────────────────

export const MOCK_MAPS: GameMap[] = [
  { id: 'map-1', campaignId: 'campaign-1', name: 'Barovia', imageUri: null, createdAt: '2025-09-01T00:00:00Z', updatedAt: '2025-09-01T00:00:00Z' },
  { id: 'map-2', campaignId: 'campaign-1', name: 'Vallaki', imageUri: null, createdAt: '2025-09-01T00:00:00Z', updatedAt: '2025-09-01T00:00:00Z' },
  { id: 'map-3', campaignId: 'campaign-1', name: 'Kresk', imageUri: null, createdAt: '2025-09-01T00:00:00Z', updatedAt: '2025-09-01T00:00:00Z' },
];

// ─── Session-linked resources (for Session 1) ───────────────────────────────

export const SESSION_1_NPC_IDS = ['npc-1'];
export const SESSION_1_MAP_IDS = ['map-1', 'map-2'];
export const SESSION_1_COMBAT_IDS = ['combat-1', 'combat-4'];
