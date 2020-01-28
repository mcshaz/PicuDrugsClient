import { IValCtxt } from './StateWatcher';
import ValidatedFormEl from './ValidatedFormEl';
import { Component, Prop, Watch } from 'vue-property-decorator';
// import { stringify } from 'querystring';

@Component
export default class ValidatedInputEl extends ValidatedFormEl {
    @Prop({ required: true })
    value!: number | string;
    @Prop({ default: 'number' })
    type!: string & ('text' | 'number' | 'range' | 'email' | 'password');
    @Prop({ default: void 0 })
    min?: number;
    @Prop({ default: void 0 })
    max?: number;
    @Prop({ default: void 0 })
    step?: number | 'any';
    @Prop({ default: void 0 })
    prepend?: string;
    @Prop({ default: void 0 })
    autocomplete?: string;
    @Prop({ default: void 0 })
    trim?: boolean;

    pValue: string | number = '';

    public get pStep() {
      if (this.type !== 'number' && this.type !== 'range') {
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
          isInteger = this.rules.integer;
          break;
        case 'undefined':
          isInteger = false;
          break;
        default:
          throw new Error('cannot parse rules property');
      }
      return isInteger
        ? 1
        : 'any';
    }

    public getInputClass(valContext?: IValCtxt) {
      return {
        'custom-range': this.type === 'range',
        'form-control': this.type !== 'range',
        ...this.getValidClass(valContext),
      };
    }

    @Watch('value', { immediate: true })
    valueChanged(newVal: string | number) {
      this.pValue = newVal;
    }

    @Watch('pValue')
    input(newVal: string | number) {
      if (newVal === this.value) { return; }
      if (this.type === 'number' || this.type === 'range') {
        newVal = parseFloat(newVal as string);
        if (Number.isNaN(newVal as any)) {
          newVal = '';
        }
      } else if (this.type === 'text' && this.trim) {
        newVal = (newVal as string).trim();
      }
      this.$emit('input', newVal);
    }
}
