import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class VModelReflector extends Vue {
    @Prop({ required: true })
    value!: any;

    get pValue() { return this.value; }
    set pValue(newVal) {
      this.$emit('input', newVal);
    }
}
