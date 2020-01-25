import 'reflect-metadata';
import { Component, Vue } from 'vue-property-decorator';

export interface IValCtxt { dirty: boolean; validated: boolean; touched: boolean; valid?: boolean; errors: string[] }

@Component
export default class StateWatcher extends Vue {
  public getValidClass(valContext?: IValCtxt) {
    // if (ctxtName) console.log(ctxtName, valContext);
    const state = this.getState(valContext);
    return {
      'is-valid': state === true,
      'is-invalid': state === false,
    };
  }

  protected getState(valContext?: IValCtxt) {
    // if (contextName) console.log(contextName, valContext);
    return valContext && (valContext.touched || valContext.validated)
      ? valContext.valid
      : null;
  };
}
