export interface HeroStats {
  strength: number | null;
  dexterity: number | null;
  constitution: number | null;
  intelligence: number | null;
  wisdom: number | null;
  charisma: number | null;
}

export interface Hero {
  id: string;
  campaignId: string;
  name: string;
  imageUri: string | null;
  playerName: string | null;
  race: string | null;
  class: string | null;
  level: number | null;
  hp: number | null;
  ac: number | null;
  speed: string | null;
  stats: HeroStats | null;
  backstory: string | null;
  notableAbilities: string | null;
  createdAt: string;
  updatedAt: string;
}
