import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { validationMixin } from 'vuelidate';

const watchedValProps = ['$anyDirty', '$anyError', '$dirty', '$error', '$invalid'];
// You can declare a mixin as the same style as components.
@Component({mixins: [validationMixin]})
export default class EmitValidator extends Vue {
  private lastCode = 0;

  @Watch('$v', {deep: true})
  protected watchVal() {
    const newCode = this.getCode();
    if (newCode !== this.lastCode) {
      this.$emit('validation-state-change', this.$v);
      this.lastCode = newCode;
    }
  }
  private getCode() {
    // tslint:disable-next-line: no-bitwise
    return watchedValProps.reduce((accum, pName, indx) => accum | ((this.$v[pName] ? 1 : 0) << indx), 0);
  }
}
