<template>
  <validation-provider v-slot="validationContext" :name="pErrorLabel" :rules="rules" slim :immediate="immediate" ref="valProvider">
    <b-form-group :label-for="pName" :label-cols-lg="labelColsLg" :label-cols-xl="labelColsXl" label-align-lg="right" :state="getState(validationContext)">
      <template #label><slot name="label">{{ label }}</slot><span class="label-colon">:</span></template>
      <template #description v-if="description || $slots.description"><slot name="description">{{ description }}</slot></template>
      <template #description v-else-if="pRangeValue || $slots['range-value']">value: <strong class="range-value"><slot name="range-value">{{ pRangeValue }}</slot></strong></template>
      <b-input-group>
        <b-input-group-prepend is-text v-if="pPrepend || $slots.prepend"><slot name="prepend">{{ pPrepend }}</slot></b-input-group-prepend>
        <input :type="type" :min="min" :max="max" :step="step" :placeholder="placeholder" :required="required" :disabled="disabled"
            v-model="pValue" :id="pName" :name="pName" :autocomplete="autocomplete" :aria-describedby="invalidId" :class="getInputClass(validationContext)">
        <b-input-group-append is-text v-if="pAppend || $slots.append"><slot name="append">{{ pAppend }}</slot></b-input-group-append>
      </b-input-group>
      <template #invalid-feedback :id="invalidId">{{ validationContext.errors[0] }}</template>
    </b-form-group>
  </validation-provider>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject, Prop, Watch, Mixins } from 'vue-property-decorator';
import ValidatedInputEl from '@/mixins/ValidatedInputEl';

@Component({})
export default class ValidatedInputGroup extends Mixins(ValidatedInputEl) {
    @Prop({ default: void 0 })
    rangeValue?: string;
    @Prop({ default: void 0 })
    append?: string;

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
}
</script>

<style>
input[type='number'].form-control {
    padding-right: calc(1.5em + 0.75rem);
}
</style>
