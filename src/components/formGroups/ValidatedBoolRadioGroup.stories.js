/* eslint-disable import/no-extraneous-dependencies */
// import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import { updatableAttrFactory } from '@/services/storybook/updatableAttrFactory';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import ValidatedBoolRadioGroup from './ValidatedBoolRadioGroup.vue';

export default {
  title: 'formGroups/ValidatedBoolRadioGroup',
  decorators: [
    () => ({ template: `<form style="margin: 1em;"><story/></form>` }),
    withKnobs,
  ],
};

const getTemplate = updatableAttrFactory(`<validated-bool-radio-group label="test input" :value="val" @change="change($event)"
  true-label="true label" false-label="false label" :disabled="isDisabled"/>`);

const getBaseObj = (val = null, attr = void 0) => ({
  components: { ValidatedBoolRadioGroup },
  template: getTemplate.insert(attr),
  methods: { change: action('change') },
  props: {
    isDisabled: { default: boolean('disabled', false) },
    val: { default: boolean('value', val) },
  },
});

export const neutral = () => getBaseObj();

export const error = () => getBaseObj(null, { immediate: void 0, required: void 0 });

export const valid = () => getBaseObj(false, { immediate: void 0, required: void 0 });
