/* eslint-disable import/no-extraneous-dependencies */
// import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import ValidatedInputSelectGroup from './ValidatedInputSelectGroup.vue';
import { updatableAttrFactory } from '@/services/storybook/updatableAttrFactory';

export default {
  title: 'formGroups/ValidatedInputSelectGroup',
  decorators: [() => ({ template: '<form style="margin: 1em;"><story/></form>' }), withKnobs],
};

const getTemplate = updatableAttrFactory(`<validated-input-select-group label="test input" :value="val" :disabled="isDisabled" @input="input($event)" :select-value="units" @update:select-value="select($event)">
    <option :value="null" disabled selected>[units...]</option>
    <option value="milli">mg</option>
    <option value="micro">microg</option>
  </validated-input-select-group>`);

const getBaseObj = (val = '', units = null, attr = void 0) => ({
  template: getTemplate.insert(attr),
  components: { ValidatedInputSelectGroup },
  methods: { input: action('input'), select: action('select') },
  props: {
    val: { default: val },
    units: { default: units },
    isDisabled: { default: boolean('disabled', false) },
  },
});

export const neutral = () => getBaseObj();

export const error = () => getBaseObj('', null, { immediate: void 0, required: void 0 });

export const valid = () => getBaseObj(1, 'milli', { immediate: void 0, required: void 0 });
