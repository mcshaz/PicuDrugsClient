<template>
    <b-form-group :label="label" :label-cols-lg="labelColsLg" :label-align-lg="labelAlignLg" :label-cols-md="labelColsMd" :label-align-md="labelAlignMd"
          :label-cols-sm="labelColsSm" :label-align-sm="labelAlignSm"
          :invalid-feedback="`Either ${trueLabel} or ${falseLabel} must be selected`" :state="state">
        <b-form-radio-group :checked="value" @change="$emit('change', $event)"
             :required="required" :stacked="stacked" :name="labelName" >
          <b-form-radio :value="true">
            {{trueLabel}}
          </b-form-radio>
          <b-form-radio :value="false">
            {{falseLabel}}
          </b-form-radio>
        </b-form-radio-group>
        <template #description>
          <slot name="description">
          </slot>
        </template>
    </b-form-group>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Model } from 'vue-property-decorator';

type vueNumber = number | '';
type nullBool = null | boolean;

@Component({})
export default class TrueFalseRadio extends Vue {
  @Model('change')
  private value!: boolean | null;
  @Prop({required: true})
  private label!: string;
  @Prop({required: true})
  private trueLabel!: string;
  @Prop({required: true})
  private falseLabel!: string;
  @Prop({default: false})
  private required!: boolean;
  @Prop({default: true})
  private stacked!: boolean;

  @Prop({default: null})
  private labelColsLg!: number | null;
  @Prop({default: null})
  private labelAlignLg!: string | null;
  @Prop({default: null})
  private labelColsMd!: number | null;
  @Prop({default: null})
  private labelAlignMd!: string | null;
 @Prop({default: null})
  private labelColsSm!: number | null;
  @Prop({default: null})
  private labelAlignSm!: string | null;

  private trueName!: string;
  private falseName!: string;
  private labelName!: string;

  public created() {
    this.labelName = html5IdSafe(this.label);
    if (!this.labelColsLg && !this.labelColsMd && !this.labelColsSm) {
      this.labelColsLg = 2;
    }
  }

  public get state() {
    if (this.required === false) {
      return null;
    }
    return this.value !== null;
  }
}
function html5IdSafe(id: string) {
  if (id === '') {
    throw new Error('id cannot be an empty string');
  }
  return id.replace(/\s/g, '+');
}
</script>
