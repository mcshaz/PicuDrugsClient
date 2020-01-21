<template>
  <validation-provider v-slot="validationContext" :name="pErrorLabel" :rules="pRules" slim>
    <b-form-group :label-for="pName" :label-cols-lg="labelColsLg" :label-cols-xl="labelColsXl"
        :invalid-feedback="errors[0]" :state="getState(validationContext)" label-align-lg="right">
      <template #label><slot name="label">{{ label }}</slot><span class="label-colon">:</span></template>
      <template #description v-if="description || $slots.description"><slot name="description">{{ description }}</slot></template>
      <date-input v-model="pValue" :min="min" :max="max" :required="required" :name="pName"
          :id="pName" :class="getValClass(validationContext)"/>
    </b-form-group>
  </validation-provider>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Watch, Mixins, Prop } from 'vue-property-decorator';
import ValidatedFormEl from '@/mixins/ValidatedFormEl';
import VModelReflector from '@/mixins/VModelReflector';
import { mergeValidators } from '@/services/validation/mergeValidators';
// import DateInputPolyfill from  '@/components/formGroups/DateInputPolyfill.vue';

@Component({})
export default class ValidatedDateGroup extends Mixins(ValidatedFormEl, VModelReflector) {
    @Prop({ default: void 0 })
    min?: Date;
    @Prop({ default: void 0 })
    max?: Date;

    get pRules() {
      return mergeValidators(this.rules, {
        required: this.required, after: this.min, before: this.max,
      });
    }
}
</script>
