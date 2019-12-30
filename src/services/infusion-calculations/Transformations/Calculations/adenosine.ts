import { roundToFixed, syringeRounding } from './../../Utilities/rounding'

export interface IDoseInfo { dose: number; dosePerKg: number; doseMax: number; ampuleMl: number; }

const ampVolMl = 2
const ampDrugMg = 6
const ampConc = ampDrugMg / ampVolMl
// const adultMax = 18;
export const ampuleDescription = `${ampDrugMg} mg/${ampVolMl} mL`
export function getAdenosineDoses (wtKg: number) {
  return new Array(5).fill(0).map((x, indx) => adenosineDoseFactory(indx + 1, wtKg))
}

function adenosineDoseFactory (doseNo: number, wtKg: number) {
  const dosePerKg = roundToFixed(doseNo * 0.1)
  const doseMax = doseNo * 3
  const dose = wtKg < 30
    ? roundToFixed(dosePerKg * wtKg, 2)
    : doseMax
  return {
    dose,
    dosePerKg,
    doseMax,
    ampuleMl: syringeRounding(dose / ampConc)
  }
}
