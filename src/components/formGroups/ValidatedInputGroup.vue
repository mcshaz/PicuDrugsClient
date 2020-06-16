<template>
  <div>
    <validation-provider v-slot="validationContext" :name="pErrorLabel" :rules="rules" slim :immediate="immediate" ref="valProvider">
      <b-form-group :label-for="pName" :label-cols-lg="labelColsLg" :label-cols-xl="labelColsXl" label-align-lg="right" :state="getState(validationContext)">
        <template #label><slot name="label">{{ label }}</slot><span class="label-colon">:</span></template>
        <template #description v-if="description || $slots.description"><slot name="description">{{ description }}</slot></template>
        <template #description v-else-if="pRangeValue || $slots['range-value']"><slot name="range-value">value: <strong class="range-value">{{ pRangeValue }}</strong></slot></template>
        <b-input-group>
          <b-input-group-prepend is-text v-if="pPrepend || $slots.prepend"><slot name="prepend">{{ pPrepend }}</slot></b-input-group-prepend>
          <input :type="type" :min="min" :max="max" :step="step" :placeholder="placeholder" :required="required" :disabled="disabled" :list="datalistId"
              v-model="pValue" :id="pName" :name="pName" :autocomplete="autocomplete" :aria-describedby="invalidId" :class="getInputClass(validationContext)" :pattern="pattern">
          <b-input-group-append is-text v-if="pAppend || $slots.append"><slot name="append">{{ pAppend }}</slot></b-input-group-append>
        </b-input-group>
        <template #invalid-feedback :id="invalidId">
          <slot name="invalid-feedback" :val-context="validationContext">{{ validationContext.errors[0] }}</slot></template>
      </b-form-group>
    </validation-provider>
    <datalist v-if="datalist" :id="datalistId"><!--creates an infinite rendering loop if inside the validation-provider-->
      <option v-for="d in datalist" :key="d" :value="d"/>
    </datalist>
  </div>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Mixins } from 'vue-property-decorator';
import ValidatedInputEl from '@/mixins/ValidatedInputEl';

@Component
export default class ValidatedInputGroup extends Mixins(ValidatedInputEl) {
    @Prop({ default: void 0 })
    rangeValue?: string;

    @Prop({ default: void 0 })
    append?: string;

    @Prop({ default: void 0 })
    datalist?: Array<string | number>;

    @Prop({ default: void 0 })
    pattern?: string;

    public get pPrepend() {
      return this.type !== 'range'
        ? this.prepend
        : this.prepend || this.min;
    }

    public get pAppend() {
      return this.type !== 'range'
        ? this.append
        : this.append || this.max;
    }

    public get pRangeValue() {
      return this.type !== 'range'
        ? null
        : [this.rangeValue, this.pValue].find((n) => n !== void 0 && n !== '');
    }

    public get datalistId() {
      return this.datalist
        ? this.pName + '-datalist'
        : void 0;
    }

    private _counter = 0;
    log(v: any) {
      ++this._counter;
      if (this._counter > 40) { throw new Error('infinate loop terminated'); }
      console.log(v);
    }
}
</script>

<style>
input[type='number'].form-control {
    padding-right: calc(1.5em + 0.75rem);
}
</style>
