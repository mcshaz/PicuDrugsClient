import { expect } from 'chai';
import DateInputPolyfill from '@/components/DateInputPolyfill.vue';
import { shallowMount, Wrapper } from '@vue/test-utils';
import { CombinedVueInstance } from 'vue/types/vue';

interface IDData { dmyDate: string; keystrokes: string[] }
const dData: IDData[] = [{ dmyDate: '9/9/1999', keystrokes: ['991999', '09091999'] },
  { dmyDate: '2/3/2003', keystrokes: ['02032003'] },
  { dmyDate: '4/3/2003', keystrokes: ['432003', '04032003'] },
  { dmyDate: '1/4/2003', keystrokes: ['0142003'] },
  { dmyDate: '4/1/2003', keystrokes: ['4012003'] },
  { dmyDate: '3/2/2003', keystrokes: ['322003'] }];
describe('DateInputPolyfill', () => {
  // const dtStr = (dob: Date, now: Date) => `born:${dmyFormat(dob)} now:${dmyFormat(now)}`;
  // eslint-disable-next-line @typescript-eslint/ban-types
  let wrapper: Wrapper<CombinedVueInstance<DateInputPolyfill, object, object, object, Record<never, any>>>;
  // const createExpect = (el: string) => expect((wrapper.find('#' + el).element as HTMLInputElement).value, el);

  beforeEach('mounting wrapper', () => {
    wrapper = shallowMount(DateInputPolyfill);
  });
  it('has set up defaults', () => {
    expect(wrapper.vm.$data.pIsDateSupported, 'isDateFirst').to.equal(true);
    expect(wrapper.vm.$data.pIsMonthFirst, 'isDateFirst').to.equal(true);
  });
  for (const d of dData) {
    it('can work with date ' + d.dmyDate, () => {
      const day = wrapper.find('#day');
      day.setSelected();
      for (const ks of d.keystrokes) {
        for (const char of ks.split('')) {
          day.trigger('keydown', { key: char });
        }
      }
    });
  }
});
