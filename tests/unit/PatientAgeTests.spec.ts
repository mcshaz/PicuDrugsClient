import { expect } from 'chai';
import { ChildAge } from '@/services/infusion-calculations';
import PatientAgeData from '@/components/PatientAgeData.vue';
import { shallowMount, Wrapper } from '@vue/test-utils';
import { getData } from './../test-resources/DobTestData';
import { dmyFormat, ymdFormat } from '@/services/utilities/dateHelpers';
import lolex from 'lolex';
import { CombinedVueInstance } from 'vue/types/vue';

describe('PatientAgeData.vue', () => {
    const dtStr = (dob: Date, now: Date) => `born:${dmyFormat(dob)} now:${dmyFormat(now)}`;
    let wrapper: Wrapper<CombinedVueInstance<PatientAgeData, object, object, object, Record<never, any>>>;
    const createExpect = (el: string) => expect((wrapper.find('#' + el).element as HTMLInputElement).value, el);
    let clock: lolex.InstalledClock<lolex.Clock>;

    beforeEach('mounting wrapper', () => {
        wrapper = shallowMount(PatientAgeData);
    });

    afterEach('destroying wrapper', () => {
        wrapper.destroy();
        if (clock) {
            clock.uninstall();
        }
    });

    for (const d of getData()) {
        const msg = dtStr(d.dob, d.current);
        it('calculates age ' + msg, () => {
            clock = lolex.install({now: d.current, toFake: ['Date']});
            const ymdStr = ymdFormat(d.dob);
            wrapper.find('#dob').setValue(ymdStr);
            createExpect('dob').to.equal(ymdStr);
            createExpect('years').to.equal(d.yrOld.toString());
            createExpect('months').to.equal(d.mthOld.toString());
            createExpect('days').to.equal(d.dayOld.toString());
        });
    }

    it('no emit if a future date', () => {
        const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24);
        tomorrow.setHours(0, 0, 0, 0);
        wrapper.find('#dob').setValue(ymdFormat(tomorrow));
        const emitted = wrapper.emitted()['age-data-change'];
        expect(emitted, 'ageDataChange emits').to.equal(void 0);
    });
    it('no emit if an old date', () => {
        const partialDate = '0001-05-01';
        wrapper.find('#dob').setValue(partialDate);
        createExpect('dob').to.equal(partialDate);
        createExpect('years').to.equal('');
        createExpect('months').to.equal('');
        createExpect('days').to.equal('');
        const emitted = wrapper.emitted()['age-data-change'];
        expect(emitted, 'ageDataChange emits').to.equal(void 0);
    });
    it('emits with native dob yesterday', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        wrapper.find('#dob').setValue(ymdFormat(yesterday));
        const emitted = wrapper.emitted()['age-data-change'];
        expect(emitted.length, 'ageDataChange emits.length').to.equal(1);
        expect(emitted[0].length, 'ageDataChange emits[0].length').to.equal(1);
        expect(emitted[0][0], 'emit data').to.deep.equal(new ChildAge(0, 0, 1));
    });
    it('zeroes left, with single emission', () => {
        const ageDays = 3;
        wrapper.find('#days').setValue(ageDays.toString());
        createExpect('days').to.equal(ageDays.toString());
        createExpect('months').to.equal('0');
        createExpect('years').to.equal('0');
        const emitted = wrapper.emitted()['age-data-change'];
        expect(emitted.length, 'ageDataChange emits.length').to.equal(1);
        expect(emitted[0].length, 'ageDataChange emits[0].length').to.equal(1);
        expect(emitted[0][0], 'emit data').to.deep.equal(new ChildAge(0, 0, ageDays));
    });
    it('unsets dob when age years set', () => {
        const lastYr = new Date();
        lastYr.setFullYear(lastYr.getFullYear() - 1);
        wrapper.find('#dob').setValue(ymdFormat(lastYr));
        createExpect('dob').to.not.equal('');
        wrapper.find('#years').setValue('2');
        createExpect('years').to.equal('2');
        createExpect('dob').to.equal('');
    });
    it('unsets dob when age months set', () => {
        const lastYr = new Date();
        lastYr.setFullYear(lastYr.getFullYear() - 1);
        wrapper.find('#dob').setValue(ymdFormat(lastYr));
        createExpect('dob').to.not.equal('');
        wrapper.find('#months').setValue('2');
        createExpect('months').to.equal('2');
        createExpect('dob').to.equal('');
    });
    it('unsets dob when age days set', () => {
        const lastYr = new Date();
        lastYr.setFullYear(lastYr.getFullYear() - 1);
        wrapper.find('#dob').setValue(ymdFormat(lastYr));
        createExpect('dob').to.not.equal('');
        wrapper.find('#days').setValue('2');
        createExpect('days').to.equal('2');
        createExpect('dob').to.equal('');
    });
    it('does not emit if years=0 & nothing else' , () => {
        wrapper.find('#years').setValue('0');
        createExpect('years').to.equal('0');
        createExpect('months').to.equal('');
        createExpect('days').to.equal('');
        const emitted = wrapper.emitted()['age-data-change'];
        expect(emitted, 'ageDataChange emits').to.equal(void 0);
    });
    describe('updates age at midnight', () => {
        afterEach('destroying wrapper', () => {
            wrapper.destroy();
            if (clock) {
                clock.uninstall();
            }
        });
        it('sets & clears timeout', () => {
            const now = new Date(2019, 1, 1, 23, 0, 0, 0);
            clock = lolex.install({ now, toFake: ['setTimeout', 'clearTimeout', 'Date'] });
            wrapper = shallowMount(PatientAgeData);
            wrapper.find('#dob').setValue('2019-02-01');
            createExpect('years').to.equal('0');
            createExpect('months').to.equal('0');
            createExpect('days').to.equal('0');
            let emitted = wrapper.emitted()['age-data-change'];
            expect(emitted[0][0], 'emit data [0]').to.deep.equal(new ChildAge(0, 0, 0));
            expect(clock.countTimers(), 'countTimers').to.equal(1);
            clock.tick('00:59:00');
            createExpect('years').to.equal('0');
            createExpect('months').to.equal('0');
            createExpect('days').to.equal('0');
            clock.tick('00:01:01');
            createExpect('years').to.equal('0');
            createExpect('months').to.equal('0');
            createExpect('days').to.equal('1');
            expect(clock.countTimers()).to.equal(1);
            emitted = wrapper.emitted()['age-data-change'];
            expect(emitted.length, 'ageDataChange emits.length').to.equal(2);
            expect(emitted[0].length, 'ageDataChange emits[0].length').to.equal(1);
            expect(emitted[1].length, 'ageDataChange emits[1].length').to.equal(1);
            expect(emitted[1][0], 'emit data [1]').to.deep.equal(new ChildAge(0, 0, 1));
            wrapper.destroy();
            expect(clock.countTimers(), 'countTimers').to.equal(0);
        });
    });
});
