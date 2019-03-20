import { assert } from 'chai';
import { ChildAgeFromDob, NumericRange } from './../../../src/infusionCalculations';
describe('ChildAgeFromDob',()=>{
    //try
  //  const fmt = Intl.DateTimeFormat(['en-NZ','en-AU','en-GB']).format;
    const fmt = (dt:Date) => dt.getDate() + '/' +(dt.getMonth()+1) +'/' +dt.getFullYear();
    const dtStr = (dob:Date,now:Date) => `born:${fmt(dob)} now:${fmt(now)}`;
    const getDateProv = (dt:Date) => ({ now : () => dt.getTime() });

    for (const d of getData()){
        let msg = dtStr(d.dob,d.current);
        it('calculates age ' + msg, () => {
            let age = new ChildAgeFromDob(d.dob,getDateProv(d.current));
            assert.strictEqual( age.years,d.yrOld, 'yrs');
            assert.strictEqual( age.months,d.mthOld, 'mths');
            assert.strictEqual( age.days,d.dayOld, 'days');
        });
        it('calculates totalDays ' +msg, () => {
            let age = new ChildAgeFromDob(d.dob,getDateProv(d.current));
            let ageDays = age.getAgeInDays()
            assert.strictEqual(ageDays,d.totalDays);
            let ageRange = age.getAgeRangeInDays();
            assert.deepStrictEqual(ageRange, new NumericRange(d.totalDays));
        });
    };
    it('thows if a future date',() => {
        const tomorrow = new Date(Date.now() + 1000*60*60*24);
        tomorrow.setHours(0,0,0,0);
        assert.throws(() => new ChildAgeFromDob(tomorrow),Error);
    });
    it('works with native Date',() => {
        const yesterday = new Date(Date.now() - 1000*60*60*24);
        yesterday.setHours(0,0,0,0);
        let age = new ChildAgeFromDob(yesterday);
        assert.strictEqual( age.years, 0, 'yrs');
        assert.strictEqual( age.months, 0, 'mths');
        assert.strictEqual( age.days, 1, 'days');
    });
});
interface dobTestData  { current:Date, 
    dob:Date, yrOld:number, 
    mthOld:number, dayOld:number, totalDays:number }
    
function getData():dobTestData[]
{
    return [
        {current:new Date(2020, 0, 31), dob: new Date(2016, 0, 31), 
            yrOld:4, mthOld:0, dayOld:0, totalDays:1461},
        {current:new Date(2020, 1, 1), dob: new Date(2016, 0, 31), 
            yrOld:4, mthOld:0, dayOld:1, totalDays:1462},
        {current:new Date(2020, 0, 31), dob: new Date(2016, 1, 1), 
            yrOld:3, mthOld:11, dayOld:30, totalDays:1460},
        //leap day tests
        {current:new Date(2020, 1, 29), dob: new Date(2016, 1, 29), 
            yrOld:4, mthOld:0, dayOld:0, totalDays:1461},
        {current:new Date(2019, 1, 28), dob: new Date(2016, 1, 29), 
            yrOld:2, mthOld:11, dayOld:30, totalDays:1095},
        //arguable below should be 1 day, but 0 seems acceptable
        {current:new Date(2019, 2, 1), dob: new Date(2016, 1, 29), 
            yrOld:3, mthOld:0, dayOld:0, totalDays:1096},
    ]
}

