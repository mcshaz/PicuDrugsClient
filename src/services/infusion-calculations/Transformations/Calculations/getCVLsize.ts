// Anesth Analg 2001 Oct;93(4):883-6. The optimal length of insertion of central venous catheters for pediatric patients D B Andropoulos  1 , S T Bent, B Skjonsby, S A Stayer

import { toGrouping } from '@/services/drugDb';
import { NumericRange } from '../../Utilities/NumericRange';
import { roundingMethod } from '../../Utilities/roundingMethod';

interface ICvlSize { diameterFr: number; lengthCm: number}

interface ICVLPatientDetails { diameterFr: NumericRange; insertUpperCm: number; insertFemoralCm: number; neckCvls: ICvlSize[]; femoralCvls: ICvlSize[] }

export function getCVLSize(weightKg: number): ICVLPatientDetails {
  let diameterFr: NumericRange;
  let insertFemoralCm: number;
  if (weightKg < 3) {
    diameterFr = new NumericRange(4);
    insertFemoralCm = 5;
  } else if (weightKg < 10) {
    diameterFr = new NumericRange(4, 4.5);
    insertFemoralCm = 8;
  } else if (weightKg < 20) {
    diameterFr = new NumericRange(4.5, 5.5);
    insertFemoralCm = 13;
  } else if (weightKg < 40) {
    diameterFr = new NumericRange(5.5, 7);
    insertFemoralCm = 16;
  } else {
    diameterFr = new NumericRange(7, 8.5);
    insertFemoralCm = 16;
  }
  diameterFr.rounding = roundingMethod.noRounding;
  let insertUpperCm: number;
  if (weightKg < 3) {
    insertUpperCm = 4;
  } else if (weightKg < 5) {
    insertUpperCm = 5;
  } else if (weightKg < 7) {
    insertUpperCm = 6;
  } else if (weightKg < 10) {
    insertUpperCm = 7;
  } else if (weightKg < 13) {
    insertUpperCm = 8;
  } else if (weightKg < 20) {
    insertUpperCm = 9;
  } else if (weightKg < 30) {
    insertUpperCm = 10;
  } else if (weightKg < 40) {
    insertUpperCm = 11;
  } else if (weightKg < 50) {
    insertUpperCm = 12;
  } else if (weightKg < 60) {
    insertUpperCm = 13;
  } else if (weightKg < 70) {
    insertUpperCm = 14;
  } else if (weightKg < 80) {
    insertUpperCm = 15;
  } else {
    insertUpperCm = 16;
  }

  const cvls = [[4, 5], [4.5, 6], [4, 8], [5.5, 8], [8.5, 11], [5.5, 13], [7, 16], [8.5, 16]].map(l => ({ diameterFr: l[0], lengthCm: l[1] }));

  const apropriateCVLS = (diameterFr: NumericRange, insertCm: number) =>
  // note below is ordered by CVL lengt
    [...toGrouping(cvls.filter(cvl => cvl.diameterFr >= diameterFr.lowerBound && cvl.diameterFr <= diameterFr.upperBound && cvl.lengthCm >= insertCm),
      cvl => cvl.diameterFr).values()].map(c => c[0]);

  const neckCvls = apropriateCVLS(diameterFr, insertUpperCm);
  const femoralCvls = apropriateCVLS(diameterFr, insertFemoralCm);

  return {
    diameterFr,
    insertUpperCm,
    insertFemoralCm,
    neckCvls,
    femoralCvls,
  };
}
