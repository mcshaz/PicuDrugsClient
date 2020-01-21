import 'reflect-metadata';
import { Component, Vue, Prop } from 'vue-property-decorator';

export interface IValCtxt { dirty: boolean; validated: boolean; valid?: boolean; errors: string[], id: string }

@Component
export default class ValidatedFormEl extends Vue {
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
    @Prop({ default: 3 })
    labelColsLg!: number;
    @Prop({ default: 3 })
    labelColsXl!: number;

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
      } else {
        if (!this.$slots.label) {
          throw new Error('either a label="x" attribute or a <template #label> must be provided');
        }
        label = this.$slots.label.map((vn) => (vn.text || (vn.elm as HTMLElement).innerText)).join('').trim();
        if (endCol.test(label)) {
          throw new Error('the label slot must not end in a colon');
        }
      }
      this.pErrorLabel = this.errorLabel || label;
      this.pName = this.name || label.replace(/\s+/g, '-');
      if (!/\w+/.test(this.pName)) {
        this.pName = 'inpt-el-' + (this as any)._uid;
      }
      this.invalidId = this.pName + '-live-feedback';
    }

    public getValidClass(valContext?: IValCtxt) {
      const state = this.getState(valContext);
      return {
        'is-valid': state === true,
        'is-invalid': state === false,
      };
    }

    protected getState(valContext?: IValCtxt) {
      return valContext && (valContext.dirty || valContext.validated)
        ? valContext.valid
        : null;
    };
}
