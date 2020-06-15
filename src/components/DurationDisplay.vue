<template>
    <span class="duration"><span class="hrs" v-if="hrs">{{hrs}}<small class="unit">h</small></span>
    <span class="mins">{{mins}}<small class="unit">m</small></span>
    </span>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class DurationDisplay extends Vue {
    @Prop({ required: true })
    public value!: number;

    public get hrs() {
      return Math.floor(this.value / 60);
    }

    public get mins() {
      return (this.value - this.hrs * 60).toFixed().padStart(2, '0');
    }
}
</script>
