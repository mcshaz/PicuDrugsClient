import { deepFreeze } from '@/services/utilities/deepFreeze';
import { roundToFixed } from '@/services/infusion-calculations/';

export type numberOrFunc = number | ((wtKg: number) => number);
type qH = 4 | 6 | 8 | 12 | 24;
interface IToDailyWean { dailyCommence: number; qH: qH; maxPerDay: number }
export type dailyWeanCommence = (daily: number, ageLt1: boolean) => IToDailyWean;

interface IAgeDosing { maxPerDose: number; qH: qH }
function conversionFactory(args: { lt1: IAgeDosing; gte1: IAgeDosing}) {
  return (multiplier: number): dailyWeanCommence => {
    return (daily: number, ageLt1: boolean) => {
      const dailyCommence = roundToFixed(daily * multiplier);
      const ageDose = ageLt1 ? args.lt1 : args.gte1;
      const maxPerDay = ageDose.maxPerDose * 24 / ageDose.qH;
      return {
        dailyCommence: (maxPerDay && dailyCommence > maxPerDay) ? maxPerDay : dailyCommence,
        qH: ageDose.qH,
        maxPerDay,
      };
    };
  };
}

const morphineMultiplyBy = conversionFactory({
  lt1: { maxPerDose: 10, qH: 6 },
  gte1: { maxPerDose: 15, qH: 4 },
});
const oxycodoneMultiplyBy = conversionFactory({
  lt1: { maxPerDose: 10, qH: 8 },
  gte1: { maxPerDose: 10, qH: 6 },
});
const diazepamMultiplyBy = conversionFactory({
  lt1: { maxPerDose: 10, qH: 6 },
  gte1: { maxPerDose: 10, qH: 4 },
});
const clonidineConvert = conversionFactory({
  lt1: { maxPerDose: 150, qH: 6 },
  gte1: { maxPerDose: 300, qH: 6 },
});
const clonidineIVConvert: IWeaningMed = {
  clonidine: clonidineConvert(1.4),
};

const enum drugClass {
    opiate = 'opiate infusions',
    benzo = 'benzodiazepine infusions',
    alpha2 = 'αlpha-2 agonists',
    others = 'others'
}

export const enum adminRoute {
    infusion, boluses, patch,
}

export interface IWeaningMed {
  morphine?: dailyWeanCommence;
  oxycodone?: dailyWeanCommence;
  diazepam?: dailyWeanCommence;
  clonidine?: dailyWeanCommence;
  methadone?: dailyWeanCommence;
}
export interface IConcInfo {
  units: string;
  min: numberOrFunc;
  max: numberOrFunc;
  default?: numberOrFunc;
  step?: number | 'any';
}
export interface IDrug {
    name: string;
    drugClass: drugClass;
    adminRoute: adminRoute;
    conversion: IWeaningMed;
    concentrations: [] | [ IConcInfo ] | [ IConcInfo, IConcInfo ];
}

export const withdrawalDrugs: ReadonlyArray<IDrug> = deepFreeze([{
  name: 'IV morphine',
  drugClass: drugClass.opiate,
  adminRoute: adminRoute.infusion,
  conversion: { morphine: morphineMultiplyBy(3) },
  concentrations: [
    { units: 'microg/kg/hr', min: 10, max: 40, default: 20 },
    { units: 'mg/hr', min: 1, max: 4 }],
}, {
  name: 'IV fentanyl',
  drugClass: drugClass.opiate,
  adminRoute: adminRoute.infusion,
  conversion: { morphine: morphineMultiplyBy(200), oxycodone: oxycodoneMultiplyBy(100) },
  concentrations: [
    { units: 'microg/kg/hr', min: 0.5, max: 2, default: 1 },
    { units: 'microg/hr', min: 10, max: 50 }],
}, {
  name: 'IV oxycodone',
  drugClass: drugClass.opiate,
  adminRoute: adminRoute.infusion,
  conversion: { oxycodone: oxycodoneMultiplyBy(1.25) },
  concentrations: [
    { units: 'microg/kg/hr', min: 10, max: 10 },
    { units: 'mg/hr', min: 1, max: 1 }],
}, {
  name: 'IV midazolam',
  drugClass: drugClass.benzo,
  adminRoute: adminRoute.infusion,
  conversion: { diazepam: diazepamMultiplyBy(0.3333333333333333) },
  concentrations: [
    { units: 'microg/kg/min', min: 1, max: 4 },
    { units: 'mg/hr', min: 0.5, max: 2 }],
}, {
  name: 'clonidine patch',
  drugClass: drugClass.alpha2,
  adminRoute: adminRoute.patch,
  conversion: {
    clonidine: clonidineConvert(1),
  },
  concentrations: [{ units: 'TTS', min: 1, max: 3 }],
}, {
  name: 'IV clonidine infusion',
  drugClass: drugClass.alpha2,
  adminRoute: adminRoute.infusion,
  conversion: clonidineIVConvert,
  concentrations: [{ units: 'microg/kg/hr', min: 0.5, max: 2, step: 0.1 }],
}, {
  name: 'clonidine boluses',
  drugClass: drugClass.alpha2,
  adminRoute: adminRoute.boluses,
  conversion: clonidineIVConvert,
  concentrations: [
    {
      units: 'microg/dose',
      min: (wtKg: number) => wtKg * 0.5,
      max: (wtKg: number) => wtKg * 2,
      default: (wtKg: number) => wtKg,
      step: 'any',
    }],
}, {
  name: 'chloral hydrate',
  drugClass: drugClass.others,
  adminRoute: adminRoute.boluses,
  conversion: {
    diazepam: (wtKg: number) => ({
      dailyCommence: roundToFixed((wtKg > 100 ? 100 : wtKg) * 0.4),
      qH: 6,
      maxPerDay: 40,
    }),
  },
  concentrations: [ /*
            { units: 'mg/dose', min: (wtKg: number) => wtKg * 12.5, max: (wtKg: number) => wtKg * 100,
                default: (wtKg: number) => wtKg * 25, totalDaily: totalDoses,
        } */],
},
]);

export function extractUnits(rateStr: string) {
  if (rateStr === 'TTS') {
    return 'microg';
  }
  return rateStr.substring(0, rateStr.indexOf('/'));
}
