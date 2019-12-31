import { UKWeightData, CentileCollection, UKLengthData, UKBMIData, UKHeadCircumferenceData, weeksPerMonth } from '@/services/anthropometry';
import chai, { expect } from 'chai';

import chaiAlmost from 'chai-almost';

describe('Centiles', () => {
  chai.use(chaiAlmost());
  for (const test of [{ name: 'weight', centile: new UKWeightData() },
    { name: 'lengths', centile: new UKLengthData() },
    { name: 'headCircumference', centile: new UKHeadCircumferenceData() },
    { name: 'BMI', centile: new UKBMIData() },
  ]) {
    for (const isMale of [true, false]) {
      const description = (isMale ? 'male ' : 'female ') + test.name;
      const centiles: CentileCollection = test.centile;
      const currentRange = isMale
        ? centiles.maleRange
        : centiles.femaleRange;
      it(description + ' to median age and back', () => {
        const minMedian = Math.ceil(currentRange.gestAgeData.minLms().m);
        const maxMedian = Math.floor(currentRange.ageMonthsData.maxLms().m);
        for (let i = minMedian; i < maxMedian; i++) {
          const age = currentRange.ageDaysForMedian(i);
          const m = currentRange.lmsForAge(age.ageDays, age.gestation).m;
          expect(m).to.almost.equal(i);
        }
      });
      if (!(centiles instanceof UKBMIData)) {
        it(description + ' medians escalate with age', () => {
          let last = currentRange.gestAgeData.minLms().m;
          for (let i = 1; i < currentRange.gestAgeData.lookup.length; i++) {
            const cur = currentRange.gestAgeData.lookup[i].m;
            expect(cur).to.be.greaterThan(last);
            last = cur;
          }
          for (const lookup of currentRange.ageWeeksData.lookup) {
            const cur = lookup.m;
            expect(cur).to.be.greaterThan(last);
            last = cur;
          }
          for (const lookup of currentRange.ageMonthsData.lookup) {
            const cur = lookup.m;
            expect(cur).to.be.greaterThan(last);
          }
        });
      }
      it(description + ' does not overlap age definitions', () => {
        expect(currentRange.gestAgeData.maxAge - 40)
          .to.be.lessThan(currentRange.ageWeeksData.minAge);

        expect(currentRange.ageWeeksData.maxAge)
          .to.be.lessThan(currentRange.ageMonthsData.minAge * weeksPerMonth);
      });
    }
  }
});
