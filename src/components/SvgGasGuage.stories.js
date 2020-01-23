// import { linkTo } from '@storybook/addon-links';
import { withKnobs, number, select } from '@storybook/addon-knobs';

import SvgGasGuage from '././SvgGasGuage.vue';
import { updatableAttrFactory } from '@/services/storybook/updatableAttrFactory';

export default {
  title: 'svg/GasGuage',
  decorators: [() => ({ template: `<div style="width: 40%;"><story/></div>` }), withKnobs],
};

const getTemplate = updatableAttrFactory(`<svg-gas-guage :fraction-begin="fractionBegin"
:fraction-remain="fractionRemain" fullPressure="153" />`);

const getBaseObj = (attr = void 0) => ({
  template: getTemplate.insert(attr),
  components: { SvgGasGuage },
  props: {
    fractionBegin: { default: number('fractionBegin', 1, { range: true, max: 1, min: 0, step: 0.1 }) },
    fractionRemain: { default: number('fractionRemain', 0, { range: true, max: 1, min: 0, step: 0.1 }) },
  },
});

export const defaults = () => getBaseObj();

export const majorArcPositiveEnd = () => getBaseObj({ ':emptyAngle': 90, ':fullAngle': 300 });

export const worksBurgerKnobs = () => {
  const attrs = Object.fromEntries(['emptyAngle', 'fullAngle', 'fullPressure', 'pressureUnits'].map((p) => [':' + p, p]));
  const returnVar = getBaseObj(attrs);
  returnVar.props = { ...returnVar.props,
    ...{
      emptyAngle: { default: number('emptyAngle', 160, { range: true, max: 360, min: 0 }) },
      fullAngle: { default: number('fullAngle', 300, { range: true, max: 360, min: 0 }) },
      fullPressure: { default: number('fullPressure', 153, { max: 160, min: 1 }) },
      pressureUnits: { default: select('pressureUnits', ['KPa', 'Bar', 'PSI'], 'KPa') },
    } };
  console.log(returnVar);
  return returnVar;
};
