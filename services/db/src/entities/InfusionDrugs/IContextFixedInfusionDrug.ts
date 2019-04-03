
import { IEntityInfusionDrug } from './IContextInfusionDrugBase';
import { IEntityDilution, IEntityConcentration } from './IContextInfusionDrugBase';

interface IFixedInfusionDrug extends IEntityInfusionDrug {
    defaultAmpConcentration: number;
}
interface IContextFixedInfusionDrug extends IFixedInfusionDrug {
    dilutions: IFixedDilution[];
}

interface IFixedDilution extends IEntityDilution {
    volume: number | null;
    concentrations: IFixedConcentration[];
}

interface IFixedConcentration extends IEntityConcentration {
    volume: number | null;
    stopMinutes: number;
    rate: number;
}

export { IContextFixedInfusionDrug, IFixedDilution, IFixedInfusionDrug };
