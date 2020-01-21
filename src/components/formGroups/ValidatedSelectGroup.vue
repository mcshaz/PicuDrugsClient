<template>
  <validation-provider v-slot="valContext" :name="pErrorLabel" :rules="rules" slim>
    <b-form-group :label-for="pName" :label-cols-lg="labelColsLg" :label-cols-xl="labelColsXl"
        :invalid-feedback="valContext.errors[0]" :state="getState(valContext)" label-align-lg="right">
      <template #label><slot name="label">{{ label }}</slot><span class="label-colon">:</span></template>
      <template #description v-if="description || $slots.description"><slot name="description">{{ description }}</slot></template>
      <b-input-group>
        <b-input-group-prepend is-text v-if="prepend || $slots.prepend"><slot name="prepend">{{ prepend }}</slot></b-input-group-prepend>
        <select class="form-control" :placeholder="placeholder" :required="required" :disabled="disabled"
            v-model="pValue" :id="pName" :name="pName" :class="getValidClass(valContext)">
          <slot>
          </slot>
        </select>
        <b-input-group-append is-text  v-if="append || $slots.append"><slot name="append">{{ append }}</slot></b-input-group-append>
      </b-input-group>
    </b-form-group>
  </validation-provider>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Watch, Mixins, Prop } from 'vue-property-decorator';
import ValidatedFormEl from '@/mixins/ValidatedFormEl';
import VModelReflector from '@/mixins/VModelReflector';

@Component
export default class ValidatedSelectGroup extends Mixins(ValidatedFormEl, VModelReflector) {
  @Prop({ default: void 0 })
  prepend?: string;
  @Prop({ default: void 0 })
  append?: string;
}
</script>
