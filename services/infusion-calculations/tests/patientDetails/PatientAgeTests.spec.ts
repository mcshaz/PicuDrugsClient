import { expect } from 'chai';
import { ChildAgeFromDob, NumericRange } from '../../';
import { MockableDate } from './../../src/PresentationClasses/Dosing/PatientDetails/MockableDate';

describe('ChildAgeFromDob', () => {
    // try
  //  const fmt = Intl.DateTimeFormat(['en-NZ','en-AU','en-GB']).format;
    const fmt = (dt: Date) => dt.getDate() + '/' + (dt.getMonth() + 1) + '/' + dt.getFullYear();
    const dtStr = (dob: Date, now: Date) => `born:${fmt(dob)} now:${fmt(now)}`;

    for (const d of getData()) {
        const msg = dtStr(d.dob, d.current);
        it('calculates age ' + msg, () => {
            const age = new ChildAgeFromDob(d.dob, new MockableDate(d.current));
            expect( age.years, 'yrs').to.equal( d.yrOld);
            expect( age.months, 'mths').to.equal( d.mthOld);
            expect( age.days, 'days').to.equal( d.dayOld);
        });
        it('calculates totalDays ' + msg, () => {
            const age = new ChildAgeFromDob(d.dob, new MockableDate(d.current));
            const ageDays = age.getAgeInDays();
            expect(ageDays).to.equal( d.totalDays);
            const ageRange = age.getAgeRangeInDays();
            expect(ageRange).to.deep.equal( new NumericRange(d.totalDays));
        });
    }
    it('thows if a future date', () => {
        const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24);
        tomorrow.setHours(0, 0, 0, 0);
        expect(() => new ChildAgeFromDob(tomorrow)).throws(Error);
    });
    it('works with native Date', () => {
        const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24);
        yesterday.setHours(0, 0, 0, 0);
        const age = new ChildAgeFromDob(yesterday);
        expect( age.years, 'yrs').to.equal( 0);
        expect( age.months, 'mths').to.equal( 0);
        expect( age.days, 'days').to.equal( 1);
    });
});
interface IDobTestData  { current: Date;
    dob: Date; yrOld: number;
    mthOld: number; dayOld: number; totalDays: number; }

function getData(): IDobTestData[] {
    return [
        {current: new Date(2020, 0, 31), dob: new Date(2016, 0, 31),
            yrOld: 4, mthOld: 0, dayOld: 0, totalDays: 1461},
        {current: new Date(2020, 1, 1), dob: new Date(2016, 0, 31),
            yrOld: 4, mthOld: 0, dayOld: 1, totalDays: 1462},
        {current: new Date(2020, 0, 31), dob: new Date(2016, 1, 1),
            yrOld: 3, mthOld: 11, dayOld: 30, totalDays: 1460},
        // leap day tests
        {current: new Date(2020, 1, 29), dob: new Date(2016, 1, 29),
            yrOld: 4, mthOld: 0, dayOld: 0, totalDays: 1461},
        {current: new Date(2019, 1, 28), dob: new Date(2016, 1, 29),
            yrOld: 2, mthOld: 11, dayOld: 30, totalDays: 1095},
        // arguable below should be 1 day, but 0 seems acceptable
        {current: new Date(2019, 2, 1), dob: new Date(2016, 1, 29),
            yrOld: 3, mthOld: 0, dayOld: 0, totalDays: 1096},
    ];
}

