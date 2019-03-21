
import { IContextInfusionDrug } from './IContextInfusionDrugBase';
import { IContextDilution, IContextConcentration } from './IContextInfusionDrugBase';

interface IFixedInfusionDrug extends IContextInfusionDrug {
    DefaultAmpConcentration: number;
}
interface IContextFixedInfusionDrug extends IFixedInfusionDrug {
    Dilutions: IFixedDilution[];
}

interface IFixedDilution extends IContextDilution {
    Volume: number | null;
    Concentrations: IFixedConcentration[];
}

interface IFixedConcentration extends IContextConcentration {
    Volume: number | null;
    StopMinutes: number;
    Rate: number;
}

export { IContextFixedInfusionDrug, IFixedDilution, IFixedInfusionDrug };
