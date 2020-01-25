<template>
  <validation-provider v-slot="validationContext" :vid="pName" :name="pErrorLabel" :rules="pRules" :immediate="immediate" slim>
    <b-form-group :label-for="pName" :label-cols-lg="labelColsLg" :label-cols-xl="labelColsXl"
        :invalid-feedback="validationContext.errors[0]" :state="getState(validationContext)" label-align-lg="right">
      <template #label><slot name="label">{{ label }}</slot><span class="label-colon">:</span></template>
      <template #description v-if="description || $slots.description"><slot name="description">{{ description }}</slot></template>
      <date-input v-model="pValue" :min="min" :max="max" :required="required" :name="pName"
          :id="pName" :cssClass="getValidClass(validationContext)"/>
    </b-form-group>
  </validation-provider>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Watch, Mixins, Prop } from 'vue-property-decorator';
import ValidatedDateEl from '@/mixins/ValidatedDateEl';
import VModelReflector from '@/mixins/VModelReflector';
import { mergeValidators } from '@/services/validation/mergeValidators';
import DateInput from '@/components/formGroups/DateInput.vue';

@Component({
  components: { DateInput },
})
export default class ValidatedDateGroup extends Mixins(ValidatedDateEl, VModelReflector) {
  get pRules() {
    return mergeValidators(this.rules, {
      required: this.required,
      after: this.min ? [this.min] : false,
      before: this.max ? [this.max] : false,
    });
  }
}
</script>
