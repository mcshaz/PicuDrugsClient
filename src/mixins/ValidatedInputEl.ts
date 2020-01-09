import ValidatedFormEl from './ValidatedFormEl';
import { Prop, Watch } from 'vue-property-decorator';

export default class ValidatedInputEl extends ValidatedFormEl {
    @Prop({ required: true })
    value!: number | string;
    @Prop({ default: 'number' })
    type!: string & ('text' | 'number' | 'range');
    @Prop({ default: void 0 })
    min?: number;
    @Prop({ default: void 0 })
    max?: number;
    @Prop({ default: void 0 })
    step?: number;
    @Prop({ default: void 0 })
    prepend?: string;

    private pValue = '';

    @Watch('value')
    valueChanged(newVal: string | number) {
      this.pValue = newVal.toString();
    }

    @Watch('pValue')
    input(newVal: string | number) {
      if (this.type !== 'text') {
          newVal = parseFloat(this.pValue);
          if (Number.isNaN(newVal as any)) {
            newVal = '';
          }
      }
      this.$emit('input', newVal);
    }
}