// import { linkTo } from '@storybook/addon-links';
import { withKnobs, number } from '@storybook/addon-knobs';

import AnaphylaxisSvg from './AnaphylaxisSvg.vue';

export default {
  title: 'svg/GasGuage',
  decorators: [() => ({ template: `<div style="width: 90%;"><story/></div>` }), withKnobs],
};

export const defaults = () => ({
    template: `<anaphylaxis-svg :wt-kg="wtKg"/>`,
    components: { AnaphylaxisSvg },
    props: {
      wtKg: { default: number('wtKg', 10, { max: 130, min: 1 }) },
    },
  });
