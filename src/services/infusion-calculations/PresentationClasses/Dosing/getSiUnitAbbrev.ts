import { siUnit } from '@/services/drugDb'

const unitAbbreviations: string[] = [
  'g', 'unit', 'mol', 'J', 'L'
]

export function getSiUnitAbbrev (unit: siUnit): string {
  return unitAbbreviations[unit - siUnit.gram]
}
