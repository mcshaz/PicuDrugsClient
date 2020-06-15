/* eslint-disable import/no-extraneous-dependencies */
// import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import ValidatedDateTimeGroup from './ValidatedDateTimeGroup.vue';
import { updatableAttrFactory } from '@/services/storybook/updatableAttrFactory';
import { withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'formGroups/ValidatedDateTimeGroup',
  decorators: [() => ({ template: '<form style="margin: 1em;"><story/></form>' }), withKnobs],
};

const getTemplate = updatableAttrFactory('<validated-date-time-group label="test input" :value="val" @input="input($event)"/>');

const getBaseObj = (val = null, attr = void 0) => ({
  template: getTemplate.insert(attr),
  components: { ValidatedDateTimeGroup },
  methods: { input: action('input') },
  props: {
    val: { default: val }, // date()
  },
});

export const neutral = () => getBaseObj();

export const errorRequired = () => getBaseObj(null, { required: void 0, immediate: void 0 });

export const errorMax = () => getBaseObj(new Date(2020, 2, 2), { immediate: void 0, max: new Date(2020, 1, 12) });

export const valid = () => getBaseObj(new Date(), { required: void 0, immediate: void 0 });
