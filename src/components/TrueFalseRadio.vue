<template>
    <b-form-group label-cols-lg="2" label-cols-xl="2" :label="label">
        <b-form-radio-group :name="labelName" :checked="value" @change="$emit('change', $event)" >
          <b-form-radio :id="trueName" :name="trueName" :value="true">
            {{trueLabel}}
          </b-form-radio>
          <b-form-radio :id="falseName" :name="falseName" :value="false">
            {{falseLabel}}
          </b-form-radio>
        </b-form-radio-group>
    </b-form-group>
</template>
<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Model } from 'vue-property-decorator';

type vueNumber = number | '';
type nullBool = null | boolean;

@Component({})
export default class PatientAgeWeightData extends Vue {
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

  private trueName!: string;
  private falseName!: string;
  private labelName!: string;

  public created() {
    this.trueName = html5IdSafe(this.trueLabel);
    this.falseName = html5IdSafe(this.falseLabel);
    this.labelName = html5IdSafe(this.label);
  }
}
function html5IdSafe(id: string) {
  if (id === '') {
    throw new Error('id cannot be an empty string');
  }
  return id.replace(/\s/g, '+');
}
</script>
