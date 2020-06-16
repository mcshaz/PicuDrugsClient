<template>
  <b-col cols="2">
    <b-input-group>
      <input
        class="form-control"
        :placeholder="measure"
        :title="measure"
        :value="value"
        type="number"
        @input="debounceEmit"
        @blur="debounceEmit.flush()"
        :read-only="readOnly"
        :min="min"
        :max="max"
        step="any"
      />
      <b-input-group-append is-text>
        {{units}}
        <slot></slot>
      </b-input-group-append>
    </b-input-group>
    <div v-if="typeof centile==='object'" class="centileInfo">
      <span class="prefix">{{centile.prefix}}&nbsp;</span>
      <span class="val">{{centile.val}}</span>
      <sup class="suffix">{{centile.suffix}}</sup>
      centile
    </div>
    <div v-if="typeof centile==='string'" class="centileInfo">{{centile}}</div>
  </b-col>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Model } from 'vue-property-decorator';
import { ICentileVal } from '@/services/utilities/centileString';
import _ from 'lodash';

type vueNumber = number | '';
export const emitKey = 'debounced-input';

@Component({})
export default class CentileCell extends Vue {
  @Model(emitKey, { required: true })
  public value!: vueNumber;

  @Prop({ required: true })
  public centile!: ICentileVal | null;

  @Prop({ default: '' })
  public units!: string;

  @Prop({ default: '' })
  public measure!: string;

  @Prop({ default: false })
  public readOnly!: boolean;

  @Prop({ default: 0.2 })
  public min!: number;

  @Prop({ default: 700 })
  public max!: number;

  private debounceEmit = _.debounce(this.emitValue.bind(this), 450);
  private emitValue($event: Event) {
    const valStr = ($event.target as HTMLInputElement).value;
    let returnVar: vueNumber;
    if (valStr === '') {
      returnVar = '';
    } else {
      returnVar = parseFloat(valStr);
      if (
        Number.isNaN(returnVar) ||
        returnVar < this.min ||
        returnVar > this.max
      ) {
        returnVar = '';
      }
    }
    this.$emit(emitKey, returnVar);
  }
}
</script>

<style scoped>
input {
  width: 3em;
}
</style>
