export interface CombatModule {
  id: string;
  campaignId: string;
  title: string;
  description: string | null;
  imageUri: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CombatMonster {
  id: string;
  combatModuleId: string;
  name: string;
  hp: number | null;
  ac: number | null;
  speed: string | null;
  statBlock: string | null;
  srdIndex: string | null;
  sortOrder: number;
  imageUri: string | null;
}

export interface InitiativeEntry {
  id: string;
  combatModuleId: string;
  entityType: 'hero' | 'monster';
  entityId: string;
  initiativeValue: number | null;
  sortOrder: number;
}
