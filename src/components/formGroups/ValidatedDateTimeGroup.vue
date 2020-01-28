<template>
  <validation-provider v-slot="valContext" :name="pErrorLabel" :rules="pRules" :immediate="immediate" slim>
    <b-form-group :label-for="pName" :label-cols-lg="labelColsLg" :label-cols-xl="labelColsXl"
        :invalid-feedback="valContext.errors[0]" :state="getState(valContext)" label-align-lg="right">
      <template #label><slot name="label">{{ label }}</slot><span class="label-colon">:</span></template>
      <template #description v-if="description || $slots.description"><slot name="description">{{ description }}</slot></template>
      <date-time-input v-model="pValue" :required="required" :cssClass="getValidClass(valContext)" :min="min" :max="max"/>
    </b-form-group>
  </validation-provider>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Watch, Mixins, Prop } from 'vue-property-decorator';
import ValidatedDateEl from '@/mixins/ValidatedDateEl';
import VModelReflector from '@/mixins/VModelReflector';
import DateTimeInput from './DateTimeInput.vue';
import { mergeValidators } from '@/services/validation/mergeValidators';

@Component({
  components: { DateTimeInput },
})
export default class ValidatedDateTimeGroup extends Mixins(ValidatedDateEl, VModelReflector) {
  get pRules() {
    return mergeValidators(this.rules, {
      required: this.required,
      after: this.min ? { limit: this.min, displayTime: true } : false,
      before: this.max ? { limit: this.max, displayTime: true } : false,
    });
  }
}
</script>
