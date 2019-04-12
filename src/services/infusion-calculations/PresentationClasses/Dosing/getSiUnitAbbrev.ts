import { siUnit } from '@/services/db';

const unitAbbreviations: string[] = [
  'g', 'unit', 'mol', 'J', 'L',
];

export function getSiUnitAbbrev(unit: siUnit): string {
  return unitAbbreviations[unit - siUnit.gram];
}
