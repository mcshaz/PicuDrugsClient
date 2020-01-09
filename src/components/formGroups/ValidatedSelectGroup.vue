<template>
  <validation-provider v-slot="{ errors, changed }" :name="pErrorLabel" :rules="rules" slim>
    <b-form-group :label-for="pName" :label-cols-lg="labelColsLg" :label-cols-xl="labelColsXl"
        :invalid-feedback="errors[0]" :state="errors[0] ? false : (changed ? true : null)" label-align-lg="right">
      <template #label><slot name="label">{{ label }}</slot><span class="label-colon">:</span></template>
      <template #description v-if="description || $slots.description"><slot name="description">{{ description }}</slot></template>
      <b-input-group :prepend="prepend" :append="append" v-if="prepend || append">
        <select class="form-control" :placeholder="placeholder" :required="required" :disabled="disabled"
            v-model="pValue" :id="pName" :name="pName" :class="{'is-invalid':errors[0],'is-valid':!errors[0]&&changed}">
          <slot>
          </slot>
        </select>
      </b-input-group>
      <select class="form-control" v-else :required="required" :disabled="disabled"
          v-model="pValue" :id="pName" :name="pName" :class="{'is-invalid':errors[0],'is-valid':!errors[0]&&changed}">
        <slot>
        </slot>
      </select>
    </b-form-group>
  </validation-provider>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Watch, Mixins, Prop } from 'vue-property-decorator';
import ValidatedFormEl from '@/mixins/ValidatedFormEl';

@Component
export default class ValidatedSelectGroup extends Mixins(ValidatedFormEl) {
  @Prop({ required: true })
  value!: any;
  @Prop({ default: void 0 })
  append?: string;
  @Prop({ default: void 0 })
  prepend?: string;

  pValue: any = '';

  @Watch('value')
  valueChanged(newVal: any) {
    this.pValue = newVal;
  }

  @Watch('pValue')
  input(newVal: any) {
    this.$emit('input', newVal);
  }
}
</script>

