import { sessionsRepo, storyBeatsRepo } from '@/db/repos';
import type { Session, StoryBeat } from '@/types';

import { useAsyncData, type AsyncDataResult } from './useAsyncData';

export function useSessions(
  campaignId: string | undefined,
): AsyncDataResult<Session[]> {
  return useAsyncData(
    (db) =>
      campaignId ? sessionsRepo.listByCampaign(db, campaignId) : Promise.resolve([]),
    [campaignId],
  );
}

export function useSession(id: string | undefined): AsyncDataResult<Session | null> {
  return useAsyncData(
    (db) => (id ? sessionsRepo.getById(db, id) : Promise.resolve(null)),
    [id],
  );
}

export function useStoryBeats(
  sessionId: string | undefined,
): AsyncDataResult<StoryBeat[]> {
  return useAsyncData(
    (db) =>
      sessionId ? storyBeatsRepo.listBySession(db, sessionId) : Promise.resolve([]),
    [sessionId],
  );
}

export interface SessionLinkedIds {
  heroIds: string[];
  npcIds: string[];
  combatModuleIds: string[];
  mapIds: string[];
}

export function useSessionLinks(
  sessionId: string | undefined,
): AsyncDataResult<SessionLinkedIds> {
  return useAsyncData(
    async (db): Promise<SessionLinkedIds> => {
      if (!sessionId) {
        return { heroIds: [], npcIds: [], combatModuleIds: [], mapIds: [] };
      }
      const [heroIds, npcIds, combatModuleIds, mapIds] = await Promise.all([
        sessionsRepo.listHeroIds(db, sessionId),
        sessionsRepo.listNpcIds(db, sessionId),
        sessionsRepo.listCombatModuleIds(db, sessionId),
        sessionsRepo.listMapIds(db, sessionId),
      ]);
      return { heroIds, npcIds, combatModuleIds, mapIds };
    },
    [sessionId],
  );
}
