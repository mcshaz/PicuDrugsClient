import { IEntityDrugAmpuleConcentration } from '@/services/drugDb';

export function singleConcentration(ampules: readonly IEntityDrugAmpuleConcentration[]) {
    return new Set<number>(ampules.map((a) => a.concentration)).size === 1;
}
