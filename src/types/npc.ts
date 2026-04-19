export interface NPC {
  id: string;
  campaignId: string;
  name: string;
  imageUri: string | null;
  description: string | null;
  notableAbilities: string | null;
  createdAt: string;
  updatedAt: string;
}
