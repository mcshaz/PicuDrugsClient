/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import ValidatedInputGroup from '../components/formGroups/ValidatedInputGroup.vue';

storiesOf('ValidatedInputGroup', module)
  .add('neutral', () => ({
    components: { ValidatedInputGroup },
    template: '<validated-input-group label="test input" min="1" max="15" type="number" value="12" @input="action" />',
    methods: { action: action('clicked') },
  }))
  .add('valid', () => ({
    components: { ValidatedInputGroup },
    template: '<validated-input-group @click="action" />',
    methods: { action: action('clicked') },
  }))
  .add('invalid', () => ({
    components: { ValidatedInputGroup },
    template: '<validated-input-group @click="action" />',
    methods: { action: action('clicked') },
  }));
