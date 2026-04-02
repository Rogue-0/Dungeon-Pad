export interface Session {
  id: string;
  campaignId: string;
  title: string;
  sessionNumber: number | null;
  playedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StoryBeat {
  id: string;
  sessionId: string;
  title: string;
  body: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
