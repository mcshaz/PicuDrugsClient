import { Validation, validationMixin } from 'vuelidate'

interface IOriginalState { wasDirty: boolean; originalValue: any; }
export class LeaveDirtyState {
    private readonly originals: Map<Validation, IOriginalState>;
    constructor (...validations: Validation[]) {
      this.originals = new Map(validations.map((v) => ([ v, { wasDirty: v.$dirty, originalValue: v.$model } ])))
    }
    public setValues () {
      for (const v of this.originals) {
        if (v[0].$model !== v[1].originalValue && v[1].wasDirty) {
          v[0].$touch()
        }
      }
    }
}
