<template>
  <b-form-radio-group :checked="value" @change="$emit('change', $event)"
        :stacked="stacked" :name="radioGrpName" :state="state">
    <b-form-radio :value="true">
      {{trueLabel}}
    </b-form-radio>
    <b-form-radio :value="false">
      {{falseLabel}}
    </b-form-radio>
  </b-form-radio-group>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Model } from 'vue-property-decorator';

type vueNumber = number | '';
type nullBool = null | boolean;

@Component({})
export default class TrueFalseRadio extends Vue {
  @Model('change')
  public value!: boolean | null;
  @Prop({ required: true })
  public trueLabel!: string;
  @Prop({ required: true })
  public falseLabel!: string;
  @Prop({ default: true })
  public stacked!: boolean;
  @Prop({ default: null })
  public state!: boolean | null;
  @Prop({ default: '' })
  public name!: string;

  public get radioGrpName() {
    return this.name || ('radioGrp_' + (this as any)._uid);
  }
}
function html5IdSafe(id: string) {
  if (id === '') {
    throw new Error('id cannot be an empty string');
  }
  return id.replace(/\s/g, '+');
}
</script>
