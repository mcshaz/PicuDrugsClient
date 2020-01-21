/* eslint-disable import/no-extraneous-dependencies */
// import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import ValidatedDateTimeGroup from './ValidatedDateTimeGroup.vue';
import { updatableAttrFactory } from '@/services/storybook/updatableAttrFactory';
import { withKnobs, date } from '@storybook/addon-knobs';

export default {
  title: 'formGroups/ValidatedDateTimeGroup',
  decorators: [() => ({ template: `<form style="margin: 1em;"><story/></form>` }), withKnobs],
};

const getTemplate = updatableAttrFactory('<validated-date-time-group label="test input" :value="val" @input="input($event)"/>');

const getBaseObj = ({ val = null, attr = void 0 }) => ({
  template: getTemplate(attr),
  components: { ValidatedDateTimeGroup },
  methods: { input: action('input') },
  props: {
    val: date('date', val),
  },
});

export const neutral = () => getBaseObj;

export const error = () => getBaseObj(null, { required: void 0, immediate: void 0 });

export const valid = () => getBaseObj(new Date(), { required: void 0, immediate: void 0 });
