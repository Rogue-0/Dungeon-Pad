import type {
  CampaignWithStats,
  Session,
  StoryBeat,
  Hero,
  NPC,
  CombatModule,
  CombatMonster,
  GameMap,
  CompendiumItem,
} from '@/types';

// ─── Campaigns ───────────────────────────────────────────────────────────────

export const MOCK_CAMPAIGNS: CampaignWithStats[] = [
  {
    id: 'campaign-1',
    name: 'Curse of Strahd',
    description: null,
    imageUri: null,
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
    description: null,
    imageUri: null,
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
  {
    id: 'hero-1', campaignId: 'campaign-1', name: 'Lil Red Softclaw', imageUri: null,
    playerName: 'Alex', race: 'Kobold', class: 'Rogue', level: 7,
    hp: 52, ac: 16, speed: '30 ft.',
    stats: { strength: 8, dexterity: 18, constitution: 14, intelligence: 12, wisdom: 10, charisma: 14 },
    backstory: 'A scrappy kobold who escaped the mines of Krezk after a cave-in killed his clutch. Adopted by a traveling merchant, Red learned to pick pockets before he learned to read. He joined the party after trying to steal from them — and failing spectacularly.',
    notableAbilities: 'Sneak Attack (4d6), Cunning Action, Uncanny Dodge, Expertise (Stealth, Sleight of Hand), Evasion',
    createdAt: '2025-09-01T00:00:00Z', updatedAt: '2025-09-01T00:00:00Z',
  },
  {
    id: 'hero-2', campaignId: 'campaign-1', name: 'Pluto Avenforth', imageUri: null,
    playerName: 'Sam', race: 'Aasimar', class: 'Warlock', level: 7,
    hp: 45, ac: 14, speed: '30 ft.',
    stats: { strength: 10, dexterity: 14, constitution: 12, intelligence: 13, wisdom: 11, charisma: 20 },
    backstory: 'Born under a solar eclipse, Pluto always heard whispers from a celestial patron. After being exiled from his temple for dabbling in forbidden pacts, he now walks the line between light and shadow, seeking redemption through unlikely alliances.',
    notableAbilities: 'Eldritch Blast (2 beams), Pact of the Tome, Radiant Soul, Agonizing Blast, Repelling Blast, Hunger of Hadar',
    createdAt: '2025-09-01T00:00:00Z', updatedAt: '2025-09-01T00:00:00Z',
  },
  {
    id: 'hero-3', campaignId: 'campaign-1', name: 'Sherizod Duskrin', imageUri: null,
    playerName: 'Jordan', race: 'Drow', class: 'Paladin', level: 7,
    hp: 67, ac: 19, speed: '30 ft.',
    stats: { strength: 18, dexterity: 12, constitution: 14, intelligence: 10, wisdom: 13, charisma: 16 },
    backstory: 'A drow paladin who rejected Lolth and fled the Underdark with his twin sister Solenzira. He swore an Oath of Vengeance against the cult that destroyed their house, and now fights to prove that darkness does not define destiny.',
    notableAbilities: 'Divine Smite, Lay on Hands (35 HP), Aura of Protection, Vow of Enmity, Relentless Avenger, Extra Attack',
    createdAt: '2025-09-01T00:00:00Z', updatedAt: '2025-09-01T00:00:00Z',
  },
  {
    id: 'hero-4', campaignId: 'campaign-1', name: 'Solenzira Duskrin', imageUri: null,
    playerName: 'Morgan', race: 'Drow', class: 'Cleric', level: 7,
    hp: 55, ac: 18, speed: '30 ft.',
    stats: { strength: 14, dexterity: 10, constitution: 14, intelligence: 12, wisdom: 19, charisma: 13 },
    backstory: 'Twin sister to Sherizod, Solenzira found faith in Eilistraee after their escape from the Underdark. She serves as the party\'s healer and moral compass, though she harbors guilt over those they left behind.',
    notableAbilities: 'Spirit Guardians, Spiritual Weapon, Preserve Life, Blessed Healer, Warding Bond, Beacon of Hope',
    createdAt: '2025-09-01T00:00:00Z', updatedAt: '2025-09-01T00:00:00Z',
  },
];

// ─── Sessions (Curse of Strahd) ──────────────────────────────────────────────

export const MOCK_SESSIONS: Session[] = [
  { id: 'session-1', campaignId: 'campaign-1', title: 'Into the Death House', description: 'The party arrives in Barovia and explores the mysterious Death House.', imageUri: null, sessionNumber: 1, playedAt: '2025-09-15T00:00:00Z', createdAt: '2025-09-15T00:00:00Z', updatedAt: '2025-09-15T00:00:00Z' },
  { id: 'session-2', campaignId: 'campaign-1', title: 'Village of Barovia', description: 'Exploring the village, meeting locals, and uncovering dark secrets.', imageUri: null, sessionNumber: 2, playedAt: '2025-09-22T00:00:00Z', createdAt: '2025-09-22T00:00:00Z', updatedAt: '2025-09-22T00:00:00Z' },
  { id: 'session-3', campaignId: 'campaign-1', title: 'Tser Pool Vistani', description: 'A fortune reading with Madam Eva reveals the path ahead.', imageUri: null, sessionNumber: 4, playedAt: '2025-10-06T00:00:00Z', createdAt: '2025-10-06T00:00:00Z', updatedAt: '2025-10-06T00:00:00Z' },
  { id: 'session-10', campaignId: 'campaign-1', title: 'Castle Ravenloft', description: 'The final confrontation with Strahd in his dark castle.', imageUri: null, sessionNumber: 10, playedAt: '2026-03-28T00:00:00Z', createdAt: '2026-03-28T00:00:00Z', updatedAt: '2026-03-28T00:00:00Z' },
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
  { id: 'combat-1', campaignId: 'campaign-1', title: 'Combat in the Alleyway', description: 'A surprise ambush by dire wolves in the narrow streets of Barovia.', imageUri: null, createdAt: '2025-09-15T00:00:00Z', updatedAt: '2025-09-15T00:00:00Z' },
  { id: 'combat-2', campaignId: 'campaign-1', title: 'Fight at the Tavern', description: 'Bar brawl turns deadly when vampire spawn crash the party.', imageUri: null, createdAt: '2025-09-22T00:00:00Z', updatedAt: '2025-09-22T00:00:00Z' },
  { id: 'combat-3', campaignId: 'campaign-1', title: 'Combat on the Bridge', description: 'A tense standoff on the old stone bridge over the river.', imageUri: null, createdAt: '2025-10-06T00:00:00Z', updatedAt: '2025-10-06T00:00:00Z' },
  { id: 'combat-4', campaignId: 'campaign-1', title: 'Sneaking into the Castle', description: 'Stealth mission through the castle grounds under moonlight.', imageUri: null, createdAt: '2026-03-28T00:00:00Z', updatedAt: '2026-03-28T00:00:00Z' },
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
  { id: 'map-1', campaignId: 'campaign-1', name: 'Barovia', description: null, imageUri: null, createdAt: '2025-09-01T00:00:00Z', updatedAt: '2025-09-01T00:00:00Z' },
  { id: 'map-2', campaignId: 'campaign-1', name: 'Vallaki', description: null, imageUri: null, createdAt: '2025-09-01T00:00:00Z', updatedAt: '2025-09-01T00:00:00Z' },
  { id: 'map-3', campaignId: 'campaign-1', name: 'Kresk', description: null, imageUri: null, createdAt: '2025-09-01T00:00:00Z', updatedAt: '2025-09-01T00:00:00Z' },
];

// ─── Compendium Items ───────────────────────────────────────────────────────

export const MOCK_COMPENDIUM_ITEMS: CompendiumItem[] = [
  {
    id: 'comp-1',
    campaignId: 'campaign-1',
    title: 'Potion Brewing',
    type: 'Notes',
    summary: 'Homebrew set of potion brewing rules',
    source: 'Link',
    sourceUrl: 'https://example.com/potion-brewing',
    body: `# Potion Brewing

Lorem ipsum dolor sit amet consectetur. Ac felis id amet adipiscing senectus nisl sit. Etiam hac enim id hac libero magna sagittis. Pellentesque est praesent amet senectus bibendum ac.

Dui eros velit nulla vitae. Suscipit platea volutpat blandit sit odio id euismod. Urna elementum sed in proin ultricies integer id consequat pharetra. Gravida sit integer turpis iaculis. Amet id accumsan sagittis sagittis. Malesuada at sed velit turpis hendrerit vestibulum ornare scelerisque. Vulputate varius enim varius quam amet porttitor viverra leo. Elementum egestas dictum fringilla dictum id accumsan tortor metus.

## Materials

Lorem ipsum dolor sit amet consectetur. Ac felis id amet adipiscing senectus nisl sit. Etiam hac enim id hac libero magna sagittis. Pellentesque est praesent amet senectus bibendum ac. Dui eros velit nulla vitae. Suscipit platea volutpat blandit sit odio id euismod. Urna elementum sed in proin ultricies integer id consequat pharetra. Gravida sit integer turpis iaculis.

Amet id accumsan sagittis sagittis. Malesuada at sed velit turpis hendrerit vestibulum ornare scelerisque. Vulputate varius enim varius quam amet porttitor viverra leo. Elementum egestas dictum fringilla dictum id accumsan tortor metus.

## The Process

Lorem ipsum dolor sit amet consectetur. Ac felis id amet adipiscing senectus nisl sit. Etiam hac enim id hac libero magna sagittis. Pellentesque est praesent amet senectus bibendum ac. Dui eros velit nulla vitae. Suscipit platea volutpat blandit sit odio id euismod. Urna elementum sed in proin ultricies integer id consequat pharetra. Gravida sit integer turpis iaculis. Amet id accumsan sagittis sagittis. Malesuada at sed velit turpis hendrerit vestibulum ornare scelerisque. Vulputate varius enim varius quam amet porttitor viverra leo. Elementum egestas dictum fringilla dictum id accumsan tortor metus.`,
    createdAt: '2025-10-01T00:00:00Z',
    updatedAt: '2025-10-01T00:00:00Z',
  },
  {
    id: 'comp-2',
    campaignId: 'campaign-1',
    title: 'Random Magic Items',
    type: 'Notes',
    summary: 'Official random magic item generation table',
    source: 'Link',
    sourceUrl: 'https://example.com/magic-items',
    body: `# Random Magic Items

A comprehensive table for generating random magic items during gameplay. Roll on the appropriate table based on the rarity tier.

## Common Items (d20)

1-5: Potion of Healing
6-8: Scroll of a 1st-level spell
9-11: Ammunition +1 (single piece)
12-14: Driftglobe
15-17: Goggles of Night
18-19: Bag of Holding
20: Cloak of Protection

## Uncommon Items (d12)

1-3: Weapon +1
4-5: Shield +1
6-7: Boots of Elvenkind
8-9: Cloak of Elvenkind
10-11: Gauntlets of Ogre Power
12: Ring of Protection`,
    createdAt: '2025-10-15T00:00:00Z',
    updatedAt: '2025-10-15T00:00:00Z',
  },
  {
    id: 'comp-3',
    campaignId: 'campaign-1',
    title: 'King Reginald Rigalsby',
    type: 'NPC',
    summary: 'King of Rigalfield',
    source: 'Created in app',
    entityId: 'npc-2',
    createdAt: '2025-09-01T00:00:00Z',
    updatedAt: '2025-09-01T00:00:00Z',
  },
  {
    id: 'comp-4',
    campaignId: 'campaign-1',
    title: 'Combat in the Alleyway',
    type: 'Combat',
    summary: 'The party faces off against thieves in the alleyway',
    source: 'Created in app',
    entityId: 'combat-1',
    createdAt: '2025-09-15T00:00:00Z',
    updatedAt: '2025-09-15T00:00:00Z',
  },
  {
    id: 'comp-5',
    campaignId: 'campaign-1',
    title: 'Strahd Von Zarovich',
    type: 'NPC',
    summary: 'The vampire lord of Barovia',
    source: 'Created in app',
    entityId: 'npc-1',
    createdAt: '2025-09-01T00:00:00Z',
    updatedAt: '2025-09-01T00:00:00Z',
  },
  {
    id: 'comp-6',
    campaignId: 'campaign-1',
    title: 'Barovia Region Map',
    type: 'Map',
    summary: 'Overview map of the Barovia region',
    source: 'Created in app',
    entityId: 'map-1',
    createdAt: '2025-09-01T00:00:00Z',
    updatedAt: '2025-09-01T00:00:00Z',
  },
  {
    id: 'comp-7',
    campaignId: 'campaign-1',
    title: 'Fight at the Tavern',
    type: 'Combat',
    summary: 'Bar fight escalates when bandits arrive',
    source: 'Created in app',
    entityId: 'combat-2',
    createdAt: '2025-09-22T00:00:00Z',
    updatedAt: '2025-09-22T00:00:00Z',
  },
  {
    id: 'comp-8',
    campaignId: 'campaign-1',
    title: 'Barovian Lore Compendium',
    type: 'Notes',
    summary: 'Collected lore and history of the Barovia setting',
    source: 'Created in app',
    body: `# Barovian Lore Compendium

## The Land of Barovia

Barovia is a demiplane of dread, a pocket dimension shrouded in perpetual mist. The land is ruled by Count Strahd von Zarovich, a vampire who has existed for centuries.

## History

The land was once part of a larger world, but Strahd's pact with dark powers sealed it away. The mists surrounding Barovia prevent anyone from leaving without Strahd's permission.

## Notable Locations

### Village of Barovia
The first settlement travelers encounter. The village is downtrodden and its people live in constant fear.

### Vallaki
A larger town that maintains a semblance of normalcy through the Baron's strict rule and mandatory festivals.

### Kresk
A walled town on the western edge of Barovia, known for its abbey and the Abbot who resides there.`,
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-01T00:00:00Z',
  },
  // Icewind Dale items
  {
    id: 'comp-9',
    campaignId: 'campaign-2',
    title: 'Ten-Towns Trade Routes',
    type: 'Notes',
    summary: 'Map and notes on trade between the Ten-Towns',
    source: 'Created in app',
    body: '# Ten-Towns Trade Routes\n\nDetailed notes on the trade routes connecting the settlements of Icewind Dale.',
    createdAt: '2025-06-20T00:00:00Z',
    updatedAt: '2025-06-20T00:00:00Z',
  },
  {
    id: 'comp-10',
    campaignId: 'campaign-2',
    title: 'Coldlight Walker Tactics',
    type: 'Combat',
    summary: 'Strategy guide for running Coldlight Walker encounters',
    source: 'Created in app',
    createdAt: '2025-07-01T00:00:00Z',
    updatedAt: '2025-07-01T00:00:00Z',
  },
];

// ─── Session-linked resources (for Session 1) ───────────────────────────────

export const SESSION_1_NPC_IDS = ['npc-1'];
export const SESSION_1_MAP_IDS = ['map-1', 'map-2'];
export const SESSION_1_COMBAT_IDS = ['combat-1', 'combat-4'];
