import { WeanDay } from './WeanDay';

export function linearWean(startingDose: number, fractionReduction: number, qHourly: number, startDate: Date, finishingDose = 0) {
  const dt = new Date(startDate);
  dt.setHours(0, 0, 0, 0);
  const returnVar = [] as WeanDay[];
  const reduction = fractionReduction * startingDose;
  const stopAt = Math.trunc((startingDose - finishingDose) / reduction + Number.EPSILON / fractionReduction);
  for (let i = 0; i < stopAt; ++i) {
    const wean = new WeanDay(new Date(dt),
      startingDose,
      qHourlyToString(qHourly));
    wean.addDays(i);
    // Object.freeze(wean.weanDate);
    returnVar.push(wean);
    startingDose -= reduction;
  }
  return returnVar;
}

export function alternateWean(startingDose: number, days: number, qHourly: number, startDate: Date) {
  let returnVar = linearWean(startingDose, 1 / Math.ceil(days / 2), qHourly, startDate);
  const oddCorrection = (days % 2 === 0) ? 0 : 1;
  // 6 over 6 days
  // odd 6 4 4 2 2
  // even 6 6 4 4 2 2
  // date 1 2 3 4
  // even 1,0->1 . 2,1->3 . 3,2->5 . 4,3->7
  // odd 1,0->1 2,1->2 . 3,2->4 . 4,3->6
  returnVar = returnVar.reduce((prev, wd, indx) => {
    prev.push(wd);
    const addDays = indx - oddCorrection;
    if (addDays >= 0) {
      wd.addDays(indx);
      prev.push(wd.cloneForTomorrow());
    }
    return prev;
  }, [] as WeanDay[]);
  return returnVar;
}

export function nonWean(startingDose: number, days: number, qHourly: number, startDate: Date) {
  const dt = new Date(startDate);
  dt.setHours(0, 0, 0, 0);
  const returnVar = new Array(days) as WeanDay[];
  for (let i = 0; i < days; ++i) {
    const wean = new WeanDay(new Date(dt),
      startingDose,
      qHourlyToString(qHourly));
    wean.addDays(i);
    returnVar[i] = wean;
  }
  return returnVar;
}

export function exponentialWean(startingDose: number, fractionReduction: number, days: number, qHourly: number, startDate: Date) {
  const dt = new Date(startDate);
  dt.setHours(0, 0, 0, 0);
  const returnVar = [] as WeanDay[];
  fractionReduction = (1 - fractionReduction);
  for (let i = 0; i < days; ++i) {
    const wean = new WeanDay(new Date(dt),
      startingDose,
      qHourlyToString(qHourly));
    if (wean.regularDose === 0) {
      break;
    }
    wean.addDays(i);
    returnVar.push(wean);
    startingDose *= fractionReduction;
  }
  return returnVar;
}

function qHourlyToString(qHourly: number) {
  return `Q ${qHourly} H`;
}
