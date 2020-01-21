/* eslint-disable import/no-extraneous-dependencies */
// import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import DateInput from './DateInput.vue';

export default {
  title: 'formGroups/DateInput',
  decorators: [() => ({ template: `<form style="margin: 1em;"><story/></form>` })],
};

const baseObj = {
  components: { DateInput },
  props: {
    min: new Date(2020, 0, 1),
    max: new Date(2020, 1, 1),
    validDate: new Date(2020, 0, 15),
    invalidDate: new Date(2020, 1, 15),
    emptyDate: null,
  },
  methods: { input: action('input') },
};

export const neutral = () => ({
  template: '<date-input :min="min" :max="max" :value="emptyDate" @input="input($event)"/>',
  ...baseObj,
});

export const error = () => ({
  template: '<date-input :min="min" :max="max" :value="invalidDate" immediate @input="input($event)"/>',
  ...baseObj,
});

export const valid = () => ({
  template: '<date-input :min="min" :max="max" :value="validDate" immediate @input="input($event)"/>',
  ...baseObj,
});
