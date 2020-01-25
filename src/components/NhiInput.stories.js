import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
// import { withKnobs, boolean } from '@storybook/addon-knobs';

import NhiInput from './NhiInput.vue';
import { updatableAttrFactory } from '@/services/storybook/updatableAttrFactory';

export default {
  title: 'components/NhiInput',
  decorators: [() => ({ template: `<form style="margin: 1em;"><story/></form>` })],
};

const getTemplate = updatableAttrFactory(`<nhi-input v-model="val" @input="input($event)"/>`);

const getBaseObj = (val = null, attr = void 0) => ({
  template: getTemplate.insert(attr),
  components: { NhiInput },
  methods: { input: action('input') },
  props: {
    val: { default: val },
  },
});

export const neutral = () => getBaseObj();

export const errorRequired = () => getBaseObj(null, { immediate: void 0, required: void 0 });

export const errorLength = () => getBaseObj('AF', { immediate: void 0, required: void 0 });

export const errorPattern = () => getBaseObj('1234567', { immediate: void 0, required: void 0 });

export const errorChecksum = () => getBaseObj('ABC1234', { immediate: void 0, required: void 0 });

export const valid = () => getBaseObj('AXT1238', { immediate: void 0, required: void 0 });
