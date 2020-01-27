import 'reflect-metadata';
import { Component, Vue } from 'vue-property-decorator';

export interface IValCtxt { dirty: boolean; validated: boolean; touched: boolean; changed: boolean; valid?: boolean; errors: string[] }

@Component
export default class StateWatcher extends Vue {
  public getValidClass(valContext?: IValCtxt) {
    // if (ctxtName) console.log(ctxtName, valContext);
    return this.getClassForState(this.getState(valContext));
  }

  protected getClassForState(state: null | boolean) {
    return {
      'is-valid': state === true,
      'is-invalid': state === false,
    };
  }

  protected getState(valContext?: IValCtxt) {
    /* // if (contextName) console.log(contextName, valContext);
    if (valContext!.touched) { return valContext!.valid!; }
    if (valContext!.validated && !valContext!.valid) { return false; }
    return null;
    */
    return valContext && (valContext.touched || valContext.validated)
      ? valContext.valid!
      : null;
  };
}
