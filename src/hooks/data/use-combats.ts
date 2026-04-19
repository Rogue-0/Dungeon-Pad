import { combatsRepo } from '@/db/repos';
import type { CombatModule, CombatMonster, InitiativeEntry } from '@/types';

import { useAsyncData, type AsyncDataResult } from './useAsyncData';

export function useCombats(
  campaignId: string | undefined,
): AsyncDataResult<CombatModule[]> {
  return useAsyncData(
    (db) =>
      campaignId ? combatsRepo.listByCampaign(db, campaignId) : Promise.resolve([]),
    [campaignId],
  );
}

export function useCombat(id: string | undefined): AsyncDataResult<CombatModule | null> {
  return useAsyncData(
    (db) => (id ? combatsRepo.getById(db, id) : Promise.resolve(null)),
    [id],
  );
}

export function useMonsters(
  combatModuleId: string | undefined,
): AsyncDataResult<CombatMonster[]> {
  return useAsyncData(
    (db) =>
      combatModuleId ? combatsRepo.listMonsters(db, combatModuleId) : Promise.resolve([]),
    [combatModuleId],
  );
}

export function useInitiative(
  combatModuleId: string | undefined,
): AsyncDataResult<InitiativeEntry[]> {
  return useAsyncData(
    (db) =>
      combatModuleId
        ? combatsRepo.listInitiative(db, combatModuleId)
        : Promise.resolve([]),
    [combatModuleId],
  );
}
