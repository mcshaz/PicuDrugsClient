import { Watch, Prop, Vue } from 'vue-property-decorator';

export default class VModelReflector extends Vue {
    @Prop({ required: true })
    value!: any;

    get pValue(){ return this.value; }
    set pValue(newVal) {
        this.$emit('input', newVal);
    }
}