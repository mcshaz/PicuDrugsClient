import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class VModelReflector extends Vue {
    @Prop({ required: true })
    value!: any;

    get pValue() { return this.value; }
    set pValue(newVal) {
      if (!isEquivalent(newVal, this.value)) {
        this.$emit('input', newVal);
      }
    }
}

function isEquivalent(val1: any, val2: any) {
  if (val1 === val2) { return true; }
  if (typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null && val1.valueOf && val2.valueOf) {
    return val1.valueOf() === val2.valueOf();
  }
  return false;
}
