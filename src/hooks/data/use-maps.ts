import { mapsRepo } from '@/db/repos';
import type { GameMap } from '@/types';

import { useAsyncData, type AsyncDataResult } from './useAsyncData';

export function useMaps(campaignId: string | undefined): AsyncDataResult<GameMap[]> {
  return useAsyncData(
    (db) => (campaignId ? mapsRepo.listByCampaign(db, campaignId) : Promise.resolve([])),
    [campaignId],
  );
}

export function useMap(id: string | undefined): AsyncDataResult<GameMap | null> {
  return useAsyncData(
    (db) => (id ? mapsRepo.getById(db, id) : Promise.resolve(null)),
    [id],
  );
}
