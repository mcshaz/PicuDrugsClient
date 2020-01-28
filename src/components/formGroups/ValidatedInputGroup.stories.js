/* eslint-disable import/no-extraneous-dependencies */
// import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';
// import { linkTo } from '@storybook/addon-links';

import ValidatedInputGroup from './ValidatedInputGroup.vue';
import { updatableAttrFactory } from '@/services/storybook/updatableAttrFactory';

export default {
  title: 'formGroups/ValidatedInputGroup',
  decorators: [
    () => ({ template: `<form style="margin: 1em;"><story/></form>` }),
    withKnobs,
  ],
};

const getTemplate = updatableAttrFactory('<validated-input-group label="test input" min="1" max="15" :value="val" type="number" @input="input($event)" :disabled="isDisabled"/>');

const getBaseObj = (val = '', attr = void 0, slotContent = void 0, props = {}) => ({
  components: { ValidatedInputGroup },
  template: getTemplate.insert(attr, slotContent),
  methods: { input: action('input') },
  props: {
    isDisabled: { default: boolean('disabled', false) },
    val: { default: val },
    ...props,
  },
});

export const neutral = () => getBaseObj();

export const error = () => getBaseObj(18, { immediate: void 0 });

export const valid = () => getBaseObj(12, { immediate: void 0 });

export const neutralPreAppend = () => getBaseObj(12, { prepend: '$', append: '.00' });

export const errorPreAppend = () => getBaseObj(19, { immediate: void 0, prepend: '$', append: '.00' });

export const validPreAppend = () => getBaseObj(11, { immediate: void 0, prepend: '$', append: '.00' });

export const neutralAppendTemplate = () => getBaseObj(15, { prepend: '$' }, '<template #append><sup>.00</sup></template>');

export const range = () => getBaseObj(7, { type: 'range' });

export const rangeInvalid = () => getBaseObj('', { type: 'range', required: void 0, immediate: void 0 });

const fruits = ['apple', 'apricot', 'avocado', 'banana', 'blackberry', 'blackcurrant', 'blueberry', 'boysenberry', 'cherry', 'coconut', 'fig', 'grape', 'grapefruit', 'kiwifruit', 'lemon', 'lime', 'lychee', 'mandarin', 'mango', 'melon', 'nectarine', 'orange', 'papaya', 'passionfruit', 'peach', 'pear', 'pineapple', 'plum', 'pomegranate', 'quince', 'raspberry', 'strawberry', 'watermelon'];
const props = { rules: { default: { oneOf: fruits } }, datalist: { default: fruits } };
const attrs = { type: 'text', immediate: void 0, ':datalist': 'datalist', ':rules': 'rules' };
export const fromDatalistValid = () => getBaseObj('apple', attrs, void 0, props);

export const fromDatalistInvalid = () => getBaseObj('carrot', attrs, void 0, props);
