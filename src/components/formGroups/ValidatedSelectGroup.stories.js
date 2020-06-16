/* eslint-disable import/no-extraneous-dependencies */
// import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import ValidatedSelectGroup from './ValidatedSelectGroup.vue';
import { updatableAttrFactory } from '@/services/storybook/updatableAttrFactory';

export default {
  title: 'formGroups/ValidatedSelectGroup',
  decorators: [() => ({ template: '<form style="margin: 1em;"><story/></form>' }), withKnobs],
};

const getTemplate = updatableAttrFactory(`<validated-select-group label="test input" :value="val" :disabled="isDisabled" @input="input($event)">
    <option :value="null" disabled selected>please-select</option>
    <option :value="1">One</option>
    <option :value="2">Two</option>
    <option :value="3">Three</option>
  </validated-select-group>`);

const getBaseObj = (val = null, attr = void 0) => ({
  template: getTemplate.insert(attr),
  components: { ValidatedSelectGroup },
  methods: { input: action('input') },
  props: {
    val: { default: val },
    isDisabled: { default: boolean('disabled', false) },
  },
});

export const neutral = () => getBaseObj();

export const error = () => getBaseObj(null, { immediate: void 0, required: void 0 });

export const valid = () => getBaseObj(1, { immediate: void 0, required: void 0 });
