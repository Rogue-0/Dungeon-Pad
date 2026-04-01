/** Response from dnd5eapi.co monster list */
export interface SRDMonsterListItem {
  index: string;
  name: string;
  url: string;
}

/** Full monster detail from dnd5eapi.co */
export interface SRDMonster {
  index: string;
  name: string;
  size: string;
  type: string;
  alignment: string;
  armor_class: Array<{ type: string; value: number }>;
  hit_points: number;
  hit_dice: string;
  speed: Record<string, string>;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  actions: Array<{
    name: string;
    desc: string;
    attack_bonus?: number;
    damage?: Array<{ damage_type: { name: string }; damage_dice: string }>;
  }>;
  special_abilities?: Array<{ name: string; desc: string }>;
  legendary_actions?: Array<{ name: string; desc: string }>;
  challenge_rating: number;
  xp: number;
}

/** Cached SRD data stored in local DB */
export interface SRDCacheEntry {
  indexKey: string;
  resourceType: 'monster' | 'spell' | 'item';
  data: string; // JSON string
  cachedAt: string;
}
