import lolex from 'lolex';
import { expect } from 'chai';
import { getData } from './../../test-resources/DobTestData';
import { ChildAge, NumericRange } from '@/services/infusion-calculations';

describe('ChildAge', () => {
    // try
  //  const fmt = Intl.DateTimeFormat(['en-NZ','en-AU','en-GB']).format;
    const fmt = (dt: Date) => dt.getDate() + '/' + (dt.getMonth() + 1) + '/' + dt.getFullYear();
    const dtStr = (dob: Date, now: Date) => `born:${fmt(dob)} now:${fmt(now)}`;
    for (const d of getData()) {
        const msg = dtStr(d.dob, d.current);
        it('calculates totalDays ' + msg, () => {
            const clock = lolex.install({now: d.current});
            const age = new ChildAge(d.yrOld, d.mthOld, d.dayOld);
            const ageDays = ChildAge.getMinTotalDays(age);
            expect(ageDays).to.equal(d.totalDays);
            const ageRange = age.getAgeRangeInDays();
            expect(ageRange).to.deep.equal(new NumericRange(d.totalDays));
            clock.uninstall();
        });
    }
});
