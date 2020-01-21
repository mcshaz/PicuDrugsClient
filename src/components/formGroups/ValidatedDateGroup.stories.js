/* eslint-disable import/no-extraneous-dependencies */
// import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { updatableAttrFactory } from '@/services/storybook/updatableAttrFactory';
import ValidatedDateGroup from './ValidatedDateGroup.vue';

export default {
  title: 'formGroups/ValidatedDateGroup',
  decorators: [
    () => ({ template: `<form style="margin: 1em;"><story/></form>` }),
    withKnobs,
  ],
};

const getTemplate = updatableAttrFactory('<validated-date-group label="test input" :min="min" :max="max" :value="val"  @input="input($event)" :disabled="isDisabled"/>');

const getBaseObj = ({ val = null, attr = void 0, slotContent = void 0 }) => ({
  components: { ValidatedDateGroup },
  template: getTemplate.insert(attr, slotContent),
  methods: { input: action('input') },
  props: {
    isDisabled: { default: boolean('disabled', false) },
    val,
    min: new Date(2020, 0, 1),
    max: new Date(2020, 1, 1),
  },
});

export const neutral = () => getBaseObj();

export const error = () => getBaseObj(new Date(2020, 2, 2), { immediate: void 0 });

export const valid = () => getBaseObj(new Date(2020, 0, 15), { immediate: void 0 });
