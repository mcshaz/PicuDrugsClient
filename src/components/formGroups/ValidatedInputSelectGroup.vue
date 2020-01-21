<template>
    <b-form-group :label-for="pName" :label-cols-lg="labelColsLg" :label-cols-xl="labelColsXl"
        :invalid-feedback="combinedErrors[0]" :state="errors[0]" label-align-lg="right">
      <template #label><slot name="label">{{ label }}</slot><span class="label-colon">:</span></template>
      <template #description v-if="description || $slots.description"><slot name="description">{{ description }}</slot></template>
      <b-input-group>
        <b-input-group-prepend is-text v-if="prepend || $slots.prepend"><slot name="prepend">{{ prepend }}</slot></b-input-group-prepend>
        <validation-provider v-slot="valContextInput" :name="pErrorLabel" :rules="rules" ref="inputValProvider" :immediate="immediate" slim>
          <input class="form-control" :type="type" :min="min" :max="max" :step="step" :placeholder="placeholder" :required="required" :disabled="disabled"
              v-model="pValue" :id="pName" :name="pName" :class="getDualValidClass(valContextInput)" :autocomplete="autocomplete">
        </validation-provider>
        <b-input-group-append is-text  v-if="$slots.default">
          <validation-provider v-slot="valContextSelect" class="input-group-append" tag="div" ref="selectValProvider" :immediate="immediate" :name="pSelectErrorLabel"
              :rules="selectRules" :title="selectTitle" slim>
            <select v-model="pSelectValue" :name="pSelectName" :id="pSelectName" :class="getDualValidClass(valContextSelect)" :required="required"
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
  errorsCombined: any = {};

  created() {
    this.pSelectName = this.selectName || this.pSelectTitle.replace(/\s+/g, '-');
    this.pSelectErrorLabel = this.selectErrorLabel || this.pSelectTitle;
  }

  get pSelectTitle() {
    return this.selectTitle || (this.pName + ' units');
  }

  get combinedErrors() {
    if (this.$refs.selectValProvider) {
      return (this.$refs.inputValProvider as any).errors.concat((this.$refs.selectValProvider as any).errors);
    }
    return (this.$refs.inputValProvider as any).errors;
  }

  get errors() {
    return Object.values(this.errorsCombined).flat();
  }

  getDualValidClass(context: IValCtxt) {
    this.errorsCombined[context.id] = context.errors;
    return this.getValidClass(context);
  }

  @Watch('selectValue')
  valueChanged(newVal: any) {
    this.pSelectValue = newVal;
  }

  @Watch('pSelectValue')
  input(newVal: any) {
    this.$emit('update:select-value', newVal);
  }
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
