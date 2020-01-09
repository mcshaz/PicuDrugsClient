import ValidatedFormEl from './ValidatedFormEl';
import { Prop, Watch } from 'vue-property-decorator';
import { stringify } from 'querystring';

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
    step?: number | string;
    @Prop({ default: void 0 })
    prepend?: string;
    @Prop({ default: void 0 })
    autocomplete?: string;

    private pValue = '';

    public get pStep() {
        if (this.type === 'text') {
            return void 0;
        }
        if (this.step) {
            return this.step;
        };
        let isInteger: boolean;
        switch (typeof this.rules) {
            case 'string':
                isInteger = /(^|\|) ?integer ?($|\|)/.test(this.rules);
                break;
            case 'object':
                isInteger = this.rules.integer
                break;
            default:
                throw new Error('cannot parse rules property');
        }
        return isInteger
            ? 1
            : 'any';
    }

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
