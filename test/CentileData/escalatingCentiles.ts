import { UKBMIData } from './../../src/anthropometry/UKBMIData';
import { UKHeadCircumferenceData } from './../../src/anthropometry/UKHeadCircumferenceData';
import { UKLengthData } from './../../src/anthropometry/UKLengthData';
import { UKWeightData } from './../../src/anthropometry/';
import chai = require('chai')
import chaiAlmost = require('chai-almost');
import { daysPerMonth, CentileCollection } from '../../src/anthropometry/CentileData';
chai.use(chaiAlmost());

describe('Centiles',()=>{
    for (const test of [{name:'weight', centile:new UKWeightData()},
                        {name:'lengths', centile:new UKLengthData()},
                        {name:'headCircumference', centile:new UKHeadCircumferenceData()},
                        {name:'BMI', centile:new UKBMIData()},
                    ]){
        for (const isMale of [true,false]){
            const description = (isMale ? 'male ' : 'female ') + test.name;
            const centiles:CentileCollection = test.centile;
            it(description + ' to median age and back',()=>{
                const maxMedian = Math.floor(centiles.lMSForAgeMonths(centiles.ageMonthsRange.get(isMale).max,isMale).m);
                const minMedian = Math.ceil(centiles.lMSForGestAge(centiles.gestAgeRange.get(isMale).min,isMale).m);
                for (let i=minMedian; i<maxMedian; i++) {
                    let age = centiles.ageDaysForMedian(i,isMale);
                    let m = centiles.lMSForAge(age.ageDays,isMale,age.gestation).m;
                    chai.expect(m).to.almost.equal(i);
                }
            });
            it(description + ' medians escalate with age',()=>{
                let last = centiles.lMSForGestAge(centiles.gestAgeRange.get(isMale).min,isMale).m;
                for (let i = centiles.gestAgeRange.get(isMale).min+1;i<centiles.gestAgeRange.get(isMale).max;i++){
                    let cur = centiles.lMSForGestAge(i,isMale).m;
                    chai.expect(cur).to.be.greaterThan(last);
                }
                for (let i = centiles.ageWeeksRange.get(isMale).min;i<centiles.ageWeeksRange.get(isMale).max;i++){
                    let cur = centiles.lMSForAgeWeeks(i,isMale).m;
                    chai.expect(cur).to.be.greaterThan(last);
                }

                chai.expect(centiles.ageWeeksRange.get(isMale).max*7)
                    .to.be.lessThan(centiles.ageMonthsRange.get(isMale).min * daysPerMonth)
                for (let i = centiles.ageMonthsRange.get(isMale).min+1;i<centiles.ageMonthsRange.get(isMale).max;i++){
                    let cur = centiles.lMSForAgeMonths(i,isMale).m;
                    chai.expect(cur).to.be.greaterThan(last);
                }
            })
        }
    }
});