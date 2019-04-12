import { UKWeightData, CentileCollection, UKLengthData, UKBMIData, UKHeadCircumferenceData, weeksPerMonth } from '@/services/anthropometry';
import { expect } from 'chai';
import chai from 'chai';
import chaiAlmost from 'chai-almost';

describe('Centiles', () => {
    chai.use(chaiAlmost());
    for (const test of [{name: 'weight', centile: new UKWeightData()},
                        {name: 'lengths', centile: new UKLengthData()},
                        {name: 'headCircumference', centile: new UKHeadCircumferenceData()},
                        {name: 'BMI', centile: new UKBMIData()},
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
                    for (let i = currentRange.gestAgeData.minLookup + 1; i <= currentRange.gestAgeData.maxLookup; i++) {
                        const cur = currentRange.gestAgeData.lmsForGestAge(i).m;
                        expect(cur).to.be.greaterThan(last);
                        last = cur;
                    }
                    for (let i = currentRange.ageWeeksData.minLookup; i <= currentRange.ageWeeksData.maxLookup; i++) {
                        const cur = currentRange.ageWeeksData.lmsForAgeWeeks(i).m;
                        expect(cur).to.be.greaterThan(last);
                        last = cur;
                    }
                    for (let i = currentRange.ageMonthsData.minLookup; i < currentRange.ageMonthsData.maxLookup; i++) {
                        const cur = currentRange.ageMonthsData.lmsForAgeMonths(i).m;
                        expect(cur).to.be.greaterThan(last);
                    }
                });
            }
            it(description + 'does not overlap age definitions', () => {
                expect(currentRange.gestAgeData.maxLookup - 40)
                    .to.be.lessThan(currentRange.ageWeeksData.minLookup);

                expect(currentRange.ageWeeksData.maxLookup)
                    .to.be.lessThan(currentRange.ageMonthsData.minLookup * weeksPerMonth);
            });
        }
    }
});
