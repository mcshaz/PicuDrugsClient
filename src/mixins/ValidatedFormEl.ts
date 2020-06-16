import 'reflect-metadata';
import { Component, Prop, Mixins } from 'vue-property-decorator';
import StateWatcher from './StateWatcher';
import LabelColWidth from './LabelColWidth';

@Component
export default class ValidatedFormEl extends Mixins(StateWatcher, LabelColWidth) {
    @Prop({ default: '' })
    label!: string;

    @Prop({ default: void 0 })
    description?: string;

    @Prop({ default: void 0 })
    placeholder?: string;

    // for errors:
    @Prop({ default: void 0 })
    errorLabel?: string;

    // for id & name attribute:
    @Prop({ default: void 0 })
    name?: string;

    @Prop({ default: void 0 })
    rules: any;

    @Prop({ default: false })
    required!: boolean;

    @Prop({ default: false })
    disabled!: boolean;

    @Prop({ default: void 0 })
    immediate!: boolean;

    protected pErrorLabel = '';
    protected pName = '';
    protected invalidId = '';

    public beforeMount() {
      const endCol = /:$/;
      let label!: string;
      if (this.label) {
        label = this.label.replace(endCol, '');
      } else if (!this.name) {
        if (!this.$slots.label) {
          throw new Error('either a label="x" or name="x" attribute must be provided');
        }
        label = this.$slots.label.map((vn) => (vn.text || (vn.elm as HTMLElement).innerText)).join('').trim();
        if (endCol.test(label)) {
          throw new Error('the label slot must not end in a colon');
        }
      }
      this.pErrorLabel = this.errorLabel || label;
      this.pName = this.name || label.replace(/^[0-9]/, (n) => ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][Number(n)])
        .replace(/[^\w]+/g, '_');
      if (!/^\w+$/.test(this.pName)) {
        this.pName = 'inpt-el-' + (this as any)._uid;
      }
      this.invalidId = this.pName + '-live-feedback';
    }
}
