/* eslint-disable import/no-extraneous-dependencies */
// import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import DateInputPolyfill from './DateInputPolyfill.vue';

export default {
  title: 'formGroups/DateInputPolyfill',
  decorators: [() => ({ template: '<form style="margin: 1em;"><story/></form>' })],
};

const baseObj = {
  components: { DateInputPolyfill },
  props: {
    min: { default: new Date(2020, 0, 1) },
    max: { default: new Date(2020, 1, 1) },
    validDate: { default: new Date(2020, 0, 15) },
    invalidDate: { default: new Date(2020, 1, 15) },
    emptyDate: { default: null },
  },
  methods: { input: action('input') },
};

export const neutral = () => ({
  template: '<date-input-polyfill :min="min" :max="max" :value="emptyDate" @input="input($event)"/>',
  ...baseObj,
});

export const error = () => ({
  template: '<date-input-polyfill :min="min" :max="max" :value="invalidDate" immediate @input="input($event)"/>',
  ...baseObj,
});

export const valid = () => ({
  template: '<date-input-polyfill :min="min" :max="max" :value="validDate" immediate @input="input($event)"/>',
  ...baseObj,
});
