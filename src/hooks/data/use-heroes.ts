import { heroesRepo } from '@/db/repos';
import type { Hero } from '@/types';

import { useAsyncData, type AsyncDataResult } from './useAsyncData';

export function useHeroes(campaignId: string | undefined): AsyncDataResult<Hero[]> {
  return useAsyncData(
    (db) => (campaignId ? heroesRepo.listByCampaign(db, campaignId) : Promise.resolve([])),
    [campaignId],
  );
}

export function useHero(id: string | undefined): AsyncDataResult<Hero | null> {
  return useAsyncData(
    (db) => (id ? heroesRepo.getById(db, id) : Promise.resolve(null)),
    [id],
  );
}
