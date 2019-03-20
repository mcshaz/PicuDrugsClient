import { UKWeightData } from './../../src/anthropometry/';
import chai = require('chai')
import chaiAlmost = require('chai-almost');
chai.use(chaiAlmost());

describe('Centiles',()=>{
    const weightCentiles = new UKWeightData();
    it('male centiles escalate',()=>{
        for (let i=1; i<100;i++){
            let age = weightCentiles.ageDaysForMedian(i,true);
            let m = weightCentiles.lMSForAge(age.ageDays,true,age.gestation).m;
            chai.expect(m).to.almost.equal(i);
        }
    });
});