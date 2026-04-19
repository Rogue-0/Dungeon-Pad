export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  imageUri: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Campaign with computed stats from related tables */
export interface CampaignWithStats extends Campaign {
  sessionCount: number;
  combatModuleCount: number;
  npcCount: number;
  heroCount: number;
  mapCount: number;
}
