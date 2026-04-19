export type CompendiumItemType = 'Notes' | 'NPC' | 'Combat' | 'Map' | 'Hero';
export type CompendiumSource = 'Created in app' | 'Link';

export interface CompendiumItem {
  id: string;
  campaignId: string;
  title: string;
  type: CompendiumItemType;
  summary: string;
  source: CompendiumSource;
  /** URL for linked external resources */
  sourceUrl?: string;
  /** ID of the linked entity (npc-1, combat-1, etc.) */
  entityId?: string;
  /** Full document body for Notes-type items */
  body?: string;
  createdAt: string;
  updatedAt: string;
}
