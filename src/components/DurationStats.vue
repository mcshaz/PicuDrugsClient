<template>
  <span v-if="value" class="duration-stats">
    median <duration-display :value="value.p50"/>
    (IQR <duration-display :value="value.p25"/>–<duration-display :value="value.p75"/>)
    <span v-if="departFrom">from {{departFrom}}</span>
  </span>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Prop } from 'vue-property-decorator';
import DurationDisplay from '@/components/DurationDisplay.vue';
import { IStats } from '@/services/transports/roadTimes';
@Component({
  components: {
    DurationDisplay,
  },
})
export default class DurationStats extends Vue {
    @Prop({ required: true })
    value: IStats | undefined;

    @Prop({ default: '' })
    departFrom!: string;
}
</script>
