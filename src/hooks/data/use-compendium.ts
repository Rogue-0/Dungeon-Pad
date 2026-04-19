import { compendiumRepo } from '@/db/repos';
import type { CompendiumItem } from '@/types';

import { useAsyncData, type AsyncDataResult } from './useAsyncData';

export function useCompendium(): AsyncDataResult<CompendiumItem[]> {
  return useAsyncData((db) => compendiumRepo.listAll(db), []);
}

export function useCampaignCompendium(
  campaignId: string | undefined,
): AsyncDataResult<CompendiumItem[]> {
  return useAsyncData(
    (db) =>
      campaignId ? compendiumRepo.listByCampaign(db, campaignId) : Promise.resolve([]),
    [campaignId],
  );
}

export function useCompendiumItem(
  id: string | undefined,
): AsyncDataResult<CompendiumItem | null> {
  return useAsyncData(
    (db) => (id ? compendiumRepo.getById(db, id) : Promise.resolve(null)),
    [id],
  );
}
