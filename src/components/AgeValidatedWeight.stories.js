import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import { withKnobs, boolean, number } from '@storybook/addon-knobs';
import { ChildAge } from '@/services/infusion-calculations';

import AgeValidatedWeight from './AgeValidatedWeight.vue';
import { updatableAttrFactory } from '@/services/storybook/updatableAttrFactory';

export default {
  title: 'components/AgeValidatedWeight',
  decorators: [() => ({ template: `<form style="margin: 1em;"><story/></form>` }), withKnobs],
};

const getTemplate = updatableAttrFactory(`<age-validated-weight v-model="val" :weeks-gestation="40" :child-age="childAge" :is-male="isMale"
  @input="input" @update:weight-is-estimate="weightIsEstimate"/>`);

const getBaseObj = (val = '', attr = void 0) => ({
  template: getTemplate.insert(attr),
  components: { AgeValidatedWeight },
  methods: { input: action('input'), weightIsEstimate: action('weight-is-estimate') },
  props: {
    val: { default: number('value', val) },
    isMale: { default: boolean('isMale', null) },
    childAge: { default: new ChildAge(1, 2, 3) },
  },
});

export const empty = () => getBaseObj();

export const errorRequired = () => getBaseObj('', { immediate: void 0 });

export const errorRequireConfirm = () => getBaseObj(4, { immediate: void 0 });

export const errorExtreme = () => getBaseObj(0.2, { immediate: void 0 });
