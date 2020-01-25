import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import PatientAgeWeightData from './ValidatedSelectGroup.vue';
import { updatableAttrFactory } from '@/services/storybook/updatableAttrFactory';

export default {
  title: 'components/PatientAgeWeightData',
  decorators: [() => ({ template: `<form style="margin: 1em;"><story/></form>` }), withKnobs],
};

const getTemplate = updatableAttrFactory(`<patient-age-weight-data/>`);

const getBaseObj = (val = null, attr = void 0) => ({
  template: getTemplate.insert(attr),
  components: { ValidatedSelectGroup },
  methods: { input: action('input') },
  props: {
    val: { default: val },
    requireWeight: { default: boolean('requireWeight', false) },
    exactAge: { default: boolean('exactAge', false) },
    requireAge: { default: boolean('requireAge', false) },
  },
});

export const neutral = () => getBaseObj();

export const error = () => getBaseObj(null, { immediate: void 0, required: void 0 });

export const valid = () => getBaseObj(1, { immediate: void 0, required: void 0 });
