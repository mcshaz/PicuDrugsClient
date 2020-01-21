/* eslint-disable import/no-extraneous-dependencies */
// import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import DateTimeInput from './DateTimeInput.vue';

export default {
  title: 'formGroups/DateTimeInput',
  decorators: [() => ({ template: `<form style="margin: 1em;"><story/></form>` })],
};

const baseObj = {
  methods: { input: action('input') },
  components: { DateTimeInput },
  props: {
    nullVal: null,
  },
};

export const neutral = () => ({
  template: '<date-time-input v-model="nullVal" @input="input($event)"/>',
  ...baseObj,
});
