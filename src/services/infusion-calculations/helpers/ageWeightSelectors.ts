export interface IAgeWeightSelectable {
    ageMinMonths: number;
    ageMaxMonths: number;
    weightMin: number;
    weightMax: number;
}

export interface IAgeWeightDetails {
    ageMonths: number;
    weightKg: number;
}

export function filterByAgeWeight<T extends IAgeWeightSelectable> (ageWt: IAgeWeightDetails, items: T[]) {
  const selector = selectForAgeWeight.bind(null, ageWt)
  return items.filter(selector)
}

function selectForAgeWeight (ageWt: IAgeWeightDetails, selectable: IAgeWeightSelectable): boolean {
  return selectable.ageMinMonths <= ageWt.ageMonths && selectable.ageMaxMonths >= ageWt.ageMonths &&
                         selectable.weightMin < ageWt.weightKg && selectable.weightMax >= ageWt.weightKg
}
