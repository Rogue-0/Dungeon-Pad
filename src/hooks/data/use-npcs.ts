import { npcsRepo } from '@/db/repos';
import type { NPC } from '@/types';

import { useAsyncData, type AsyncDataResult } from './useAsyncData';

export function useNpcs(campaignId: string | undefined): AsyncDataResult<NPC[]> {
  return useAsyncData(
    (db) => (campaignId ? npcsRepo.listByCampaign(db, campaignId) : Promise.resolve([])),
    [campaignId],
  );
}

export function useNpc(id: string | undefined): AsyncDataResult<NPC | null> {
  return useAsyncData(
    (db) => (id ? npcsRepo.getById(db, id) : Promise.resolve(null)),
    [id],
  );
}
