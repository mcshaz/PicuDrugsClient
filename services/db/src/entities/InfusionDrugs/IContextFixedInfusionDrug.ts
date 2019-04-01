
import { IContextInfusionDrug } from './IContextInfusionDrugBase';
import { IContextDilution, IContextConcentration } from './IContextInfusionDrugBase';

interface IFixedInfusionDrug extends IContextInfusionDrug {
    defaultAmpConcentration: number;
}
interface IContextFixedInfusionDrug extends IFixedInfusionDrug {
    dilutions: IFixedDilution[];
}

interface IFixedDilution extends IContextDilution {
    volume: number | null;
    concentrations: IFixedConcentration[];
}

interface IFixedConcentration extends IContextConcentration {
    volume: number | null;
    stopMinutes: number;
    rate: number;
}

export { IContextFixedInfusionDrug, IFixedDilution, IFixedInfusionDrug };
