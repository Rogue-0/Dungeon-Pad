import { campaignsRepo } from '@/db/repos';
import type { Campaign, CampaignWithStats } from '@/types';

import { useAsyncData, type AsyncDataResult } from './useAsyncData';

export function useCampaigns(): AsyncDataResult<CampaignWithStats[]> {
  return useAsyncData((db) => campaignsRepo.listWithStats(db), []);
}

export function useCampaign(id: string | undefined): AsyncDataResult<Campaign | null> {
  return useAsyncData(
    (db) => (id ? campaignsRepo.getById(db, id) : Promise.resolve(null)),
    [id],
  );
}
