import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
// import { withKnobs } from '@storybook/addon-knobs';

import PatientAgeData from './PatientAgeData.vue';
import { updatableAttrFactory } from '@/services/storybook/updatableAttrFactory';
import { ChildAge } from '@/services/infusion-calculations';

export default {
  title: 'components/PatientAgeData',
  decorators: [() => ({ template: `<form novalidate style="margin: 1em;"><story/></form>` })],
};

const getTemplate = updatableAttrFactory(`<patient-age-data :value="age" @input="input($event)"/>`);

const getBaseObj = (val = null, attr = void 0) => ({
  template: getTemplate.insert(attr),
  components: { PatientAgeData },
  methods: { input: action('input') },
  props: {
    age: { default: val },
  },
});

export const neutral = () => getBaseObj();

export const error = () => getBaseObj(null, { immediate: void 0, required: void 0 });

export const valid = () => getBaseObj(new ChildAge(1, 2, 3), { immediate: void 0, required: void 0 });
