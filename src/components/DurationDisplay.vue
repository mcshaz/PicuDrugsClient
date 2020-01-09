<template>
    <span class="duration"><span class="hrs">{{hrs}}</span><small class="unit">h</small>
    <span class="mins">{{mins}}</span><small class="unit">m</small>
    </span>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';

@Component({})
export default class DurationDisplay extends Vue {
    @Prop({required: true})
    public value!: number;

    public get hrs() {
        return Math.floor(this.value / 60);
    }

    public get mins() {
        return (this.value - this.hrs).toFixed().padStart(2, '0');
    }
}
</script>
