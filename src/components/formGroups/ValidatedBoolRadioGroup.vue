<template>
  <validation-provider v-slot="{ errors, changed }" :name="pErrorLabel" :rules="rules" slim>
    <b-form-group :label-for="pName" :label-cols-lg="labelColsLg" :label-cols-xl="labelColsXl"
        :invalid-feedback="errors[0]" :state="errors[0] ? false : (changed ? true : null)" label-align-lg="right">
      <template #label><slot name="label">{{ label }}</slot><span class="label-colon">:</span></template>
      <template #description v-if="description || $slots.description"><slot name="description">{{ description }}</slot></template>
      <b-form-radio-group :checked="value" @change="$emit('change', $event)" v-model="pValue"
            :stacked="stacked" :name="radioGrpName">
        <b-form-radio :value="true" :disabled="disabled">
          {{trueLabel}}
        </b-form-radio>
        <b-form-radio :value="false" :disabled="disabled">
          {{falseLabel}}
        </b-form-radio>
      </b-form-radio-group>
    </b-form-group>
  </validation-provider>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Model, Mixins, Watch } from 'vue-property-decorator';
import ValidatedFormEl from '@/mixins/ValidatedFormEl';

type vueNumber = number | '';
type nullBool = null | boolean;

@Component({})
export default class ValidatedBoolRadioGroup extends Mixins(ValidatedFormEl)  {
  @Model('change') // use change event rather than input
  public value!: boolean | null;
  @Prop({ required: true })
  public trueLabel!: string;
  @Prop({ required: true })
  public falseLabel!: string;
  @Prop({ default: true })
  public stacked!: boolean;

  private pValue: boolean | null = null;

  @Watch('value')
  valueChanged(newVal: boolean | null) {
    this.pValue = newVal;
  }

  @Watch('pValue')
  input(newVal: boolean | null) {
    this.$emit('change', newVal);
  }

  public get radioGrpName() {
    return this.name || ('radioGrp_' + this.pName); //(this as any)._uid
  }
}
</script>
