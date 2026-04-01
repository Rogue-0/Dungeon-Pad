export interface Hero {
  id: string;
  campaignId: string;
  name: string;
  imageUri: string | null;
  playerName: string | null;
  class: string | null;
  level: number | null;
  createdAt: string;
  updatedAt: string;
}
