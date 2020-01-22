<template>
    <b-form-group :label-for="pName" :label-cols-lg="labelColsLg" :label-cols-xl="labelColsXl"
        :invalid-feedback="errors.join(' AND ')" :state="state" label-align-lg="right">
      <template #label><slot name="label">{{ label }}</slot><span class="label-colon">:</span></template>
      <template #description v-if="description || $slots.description"><slot name="description">{{ description }}</slot></template>
      <b-input-group>
        <b-input-group-prepend is-text v-if="prepend || $slots.prepend"><slot name="prepend">{{ prepend }}</slot></b-input-group-prepend>
        <validation-provider v-slot="valContextInput" :name="pErrorLabel" :rules="rules" ref="inputValProvider" :immediate="immediate" slim>
          <input class="form-control" :type="type" :min="min" :max="max" :step="step" :placeholder="placeholder" :required="required" :disabled="disabled"
              v-model="pValue" :id="pName" :name="pName" :class="getDualValidClass(valContextInput, 0)" :autocomplete="autocomplete">
        </validation-provider>
        <b-input-group-append>
          <validation-provider v-slot="valContextSelect" class="input-group-append" tag="div" ref="selectValProvider" :immediate="immediate" :name="pSelectErrorLabel"
              :rules="selectRules">
            <select v-model="pSelectValue" :name="pSelectName" :id="pSelectName" :class="getDualValidClass(valContextSelect, 1)" :required="required"
                :disabled="disabled" class="custom-select input-group-addon">
              <slot></slot>
            </select>
          </validation-provider>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Inject, Prop, Watch, Mixins } from 'vue-property-decorator';
import ValidatedInputEl from '@/mixins/ValidatedInputEl';
import { IValCtxt } from '@/mixins/ValidatedFormEl';

@Component({})
export default class ValidatedInputSelectGroup extends Mixins(ValidatedInputEl) {
  @Prop({ required: true })
  selectValue!: any;
  @Prop({ default: 'required' })
  selectRules?: any;
  @Prop({ default: void 0 })
  selectTitle?: string;
  @Prop({ default: void 0 })
  selectName?: string;
  @Prop({ default: void 0 })
  selectErrorLabel?: string;

  pSelectValue: any = '';
  pSelectName = '';
  pSelectErrorLabel = '';
  errorsCombined: [string[], string[]] = [[], []];
  stateCombined: [null | boolean, null | boolean] = [null, null];

  beforeMount() {
    this.pSelectName = this.selectName || (this.pName + '-select-append');
    this.pSelectErrorLabel = this.selectErrorLabel || this.pSelectLabel;
  }

  get pSelectLabel() {
    return this.selectTitle || (this.label + ' units');
  }

  get errors() {
    return this.errorsCombined.flat();
  }

  get state() {
    if (this.stateCombined[0] === null && this.stateCombined[1] === null) {
      return null;
    }
    if (this.stateCombined[0] === false || this.stateCombined[1] === false) {
      return false;
    }
    return true;
  }

  getDualValidClass(valContext: IValCtxt, index: number) {
    if (valContext.errors) {
      console.log(valContext.errors);
      if (!areArraysEqual(this.errorsCombined[index], valContext.errors)) {
        Vue.set(this.errorsCombined, index, valContext.errors);
      }
      if (this.stateCombined[index] !== this.getState(valContext)) {
        Vue.set(this.stateCombined, index, this.getState(valContext));
      }
    }
    return this.getValidClass(valContext);
  }

  @Watch('selectValue', { immediate: true })
  syncSelect(newVal: any) {
    this.pSelectValue = newVal;
  }

  @Watch('pSelectValue')
  syncPSelect(newVal: any) {
    if (newVal === this.selectValue) { return; }
    this.$emit('update:select-value', newVal);
  }
}

function areArraysEqual(arr1: string[], arr2: string[]) {
  if (arr1.length !== arr2.length) { return false; }
  if (arr1 === arr2) { return true; }
  for (let i = 0; i < arr1.length; ++i) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}
</script>

<style>
.custom-select.input-group-addon {
    display: -ms-flexbox;
    display: -webkit-box;
    display: flex;
    -ms-flex-align: center;
    -webkit-box-align: center;
    align-items: center;
    margin-bottom: 0;
    color: #495057;
    text-align: left;
    white-space: nowrap;
    background-color: #e9ecef!important;
    border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
