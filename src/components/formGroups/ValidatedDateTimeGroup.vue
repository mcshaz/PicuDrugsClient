<template>
  <validation-provider v-slot="{ errors, changed }" :name="pErrorLabel" :rules="rules" slim>
    <b-form-group :label-for="pName" :label-cols-lg="labelColsLg" :label-cols-xl="labelColsXl"
        :invalid-feedback="errors[0]" :state="errors[0] ? false : (changed ? true : null)" label-align-lg="right">
      <template #label><slot name="label">{{ label }}</slot><span class="label-colon">:</span></template>
      <template #description v-if="description || $slots.description"><slot name="description">{{ description }}</slot></template>
      <date-time-input v-model="pValue" :required="required" />
    </b-form-group>
  </validation-provider>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Watch, Mixins, Prop } from 'vue-property-decorator';
import ValidatedFormEl from '@/mixins/ValidatedFormEl';
import VModelReflector from '@/mixins/VModelReflector';
import DateTimeInput from './DateTimeInput.vue';

@Component({
  components: { DateTimeInput },
})
export default class ValidatedDateTimeGroup extends Mixins(ValidatedFormEl, VModelReflector) {
}
</script>
