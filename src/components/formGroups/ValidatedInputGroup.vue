<template>
  <validation-provider v-slot="{ errors, changed }" :name="pErrorLabel" :rules="rules" slim>
    <b-form-group :label-for="pInputName" :label-cols-lg="labelColsLg" :label-cols-xl="labelColsXl"
        :invalid-feedback="errors[0]" :state="errors[0] ? false : (changed ? true : null)" label-align-lg="right">
      <template #label><slot name="label">{{ label }}</slot><span class="label-colon">:</span></template>
      <template #description v-if="description || $slots.description"><slot name="description">{{ description }}</slot></template>
      <template #description v-else-if="rangeValue || $slots['range-value']">value: <strong class="range-value"><slot name="range-value">{{ rangeValue }}</slot></strong></template>
      <b-input-group :prepend="prepend" :append="append" v-if="prepend || append">
        <template #append v-if="append || $slots.append"><slot name="append">{{ append }}</slot></template>
        <input class="form-control" :type="type" :min="min" :max="max" :step="step" :placeholder="placeholder" :required="required" :disabled="disabled"
            v-model="pValue" :id="pName" :name="pName" :class="{'is-invalid':errors[0],'is-valid':!errors[0]&&changed}">
      </b-input-group>
      <input class="form-control" :type="type" :min="min" :max="max" :step="step" :placeholder="placeholder" :required="required" :disabled="disabled" v-else
          v-model="pValue" :id="pName" :name="pName" :class="{'is-invalid':errors[0],'is-valid':!errors[0]&&changed}">
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
    append?: string;
    @Prop({ default: void 0 })
    rangeValue?: string;
}
</script>

<style>
input[type='number'] {
    padding-right: calc(1.5em + 0.75rem);
}
</style>
