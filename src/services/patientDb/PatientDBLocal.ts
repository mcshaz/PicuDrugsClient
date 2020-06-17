import Dexie from 'dexie';
import { IPatient } from './IPatient';

export class PatientDBLocal extends Dexie {
    // Declare implicit table properties.
    // (just to inform Typescript. Instanciated by Dexie in stores() method)
    // Declare implicit table properties.
    // (just to inform Typescript. Instanciated by Dexie in stores() method)
    public patients!: Dexie.Table<IPatient, string>; // number = type of the primkey
    // ...other tables goes here...

    constructor() {
      super('PatientDBLocal' + process.env.NODE_ENV);
      this.version(1).stores({
        patients: 'nhi',
      });
    }
}
