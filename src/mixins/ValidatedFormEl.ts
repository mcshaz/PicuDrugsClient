import 'reflect-metadata';
import { Component, Vue, Prop } from 'vue-property-decorator';

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

    @Prop({ default:void 0 })
    rules: any;
    @Prop({ default: false })
    required!: boolean;
    @Prop({ default: false })
    disabled!: boolean;

    protected pErrorLabel = '';
    protected pName = ''

    public mounted() {
        const endCol = /:$/;
        let label!: string;
        if (this.label) {
            label = this.label.replace(endCol, '');
        } else {
            label = this.$slots.label!.map((vn) => (vn.text || (vn.elm as HTMLElement).innerText)).join('').trim();
            if (!label) {
            throw new Error('either a label="x" attribute or a <template #label> must be provided');
            }
            if (endCol.test(label)) {
            throw new Error('the label slot must not end in a colon');
            }
        }
        this.pErrorLabel = this.errorLabel || label;
        this.pName = this.name || label.replace(/\s+/g, '-');
    }
}
