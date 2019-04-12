import { dilutionMethod, siUnit, IEntityFixedInfusionDrug} from '@/services/db';
import chaiAlmost from 'chai-almost'; // By default, chai-almost allows a tolerance of 1 x 10-6
import { FixedInfusionDrugVM, transformFixedInfusions, SiUnitMeasure, InfusionRateUnit,  MinutesDuration, getFixedDilutionsForPt } from '@/services/infusion-calculations';
import chai from 'chai';
import { fileFetch } from '../../test-resources/FileFetch';
import { ToArrayMap } from './utilities/toMap';

chai.use(chaiAlmost());
describe('fixedVMConversion', () => {
    let dbDatum: IEntityFixedInfusionDrug[];
    const expectedDatum = getFixedInfusionVMTestData();
    before('get data', async () => {
        const m = new ToArrayMap<IFixedVMTestData, IEntityFixedInfusionDrug>(expectedDatum,
            (d) => [d.infusionDrugId]);
        const dbInit = await fileFetch.getUpdates(null);
        dbDatum = m.match(dbInit.data.infusionDrugs as IEntityFixedInfusionDrug[], (d) => d.infusionDrugId)
            .map((d) => d[1][0]);
    });
    it('has all fixed drugs', () => {
        chai.expect(dbDatum.every((v) => (v as any).isTitratable === false),
            'every isTitratable === false').to.equal(true);
    });
    it('has matched test data appropriately', () => {
        const dbIds = dbDatum.map((d) => d.infusionDrugId);
        const expectIds = expectedDatum.map((d) => d.infusionDrugId);
        chai.expect(dbIds).to.have.same.ordered.members(expectIds);
    });
    describe('can produce views from test data', () => {
        const methodsTested = new Set<dilutionMethod>();
        for (let i = 0; i < expectedDatum.length; i++) {
            const expected = expectedDatum[i];
            it(`${expected.vm.drugName} (${expected.wt}kg)`, () => {
                const dbData = dbDatum[i];
                const selectedDil = getFixedDilutionsForPt(dbData, expected.ageMth, expected.wt)!;
                selectedDil.selectedAmpule = dbData.drugAmpuleConcentrations[0];
                methodsTested.add(selectedDil.dilution.dilutionMethodId);
                const testOut = transformFixedInfusions(expected.wt, selectedDil);
                chai.expect(testOut, `dilMethod ${selectedDil.dilution.dilutionMethodId}`).to.be.deep.almost.equal(expected.vm);
            });
        }
        it('has tested relevant methods', () => {
            chai.expect(Array.from(methodsTested)).to.have.same.members([2, 3, 4, 6, 7]);
        });
    });
});
interface IFixedVMTestData {wt: number; ageMth: number; infusionDrugId: number; vm: FixedInfusionDrugVM; }
function getFixedInfusionVMTestData(): IFixedVMTestData[] {
    return [{
        wt: 10, // Dilution Method Id: 7 wt: 10
        ageMth: 71,
        infusionDrugId: 32,
        vm: (() => {
            const f = new FixedInfusionDrugVM();
            f.drugName = 'Acetylcysteine';
            f.sourceDescription = 'Notes on Injectable Drugs 6th Ed';
            f.sourceHref = 'file://ahsl6/main/Groups/INTRANET/Pharmacy/eNoids6/eNOIDs6Mongraphs/ACETYLCYSTEINE.pdf';
            f.ampuleConcentration = 200;
            f.diluentFluid = '5% Dextrose';
            f.note = 'watch for hypotension.';
            f.route = 'Peripheral or Central Line';
            f.drawingUpUnits = new SiUnitMeasure(-3, siUnit.gram);
            f.rateUnit = new InfusionRateUnit(-3, siUnit.gram, true, false);
            f.concentrations = [{
                ampuleMl: 7.5,
                calculatedDose: 150,
                cumulativeStartTime: new MinutesDuration(0),
                duration: new MinutesDuration(15),
                diluentVolume: 22.5,
                drawingUpDose: 1500,
                finalVolume: 30,
                infusionRate: 120,
                oneMlHrDose: 5,
                isNeat: false,
            }, {
                ampuleMl: 2.5,
                calculatedDose: 50,
                cumulativeStartTime: new MinutesDuration(15),
                duration: new MinutesDuration(240),
                diluentVolume: 67.5,
                drawingUpDose: 500,
                finalVolume: 70,
                infusionRate: 17.5,
                oneMlHrDose: 0.714285714285714,
                isNeat: false,
            }, {
                ampuleMl: 5,
                calculatedDose: 100,
                cumulativeStartTime: new MinutesDuration(255),
                duration: new MinutesDuration(960),
                diluentVolume: 135,
                drawingUpDose: 1000,
                finalVolume: 140,
                infusionRate: 8.75,
                oneMlHrDose: 0.714285714285714,
                isNeat: false,
            }];
            return f;
        })(),
    },
    // Dilution Method Id: 3 wt: 70 ageMth: 600
    {
        wt: 70,
        ageMth: 600,
        infusionDrugId: 33,
        vm: (() => {
            const f = new FixedInfusionDrugVM();
            f.drugName = 'Levosimendan';
            f.sourceDescription = 'Starship Pharmacy Guidelines (paediatric)';
            f.sourceHref = 'file://ahsl6/main/Groups/Everyone/POLICY/Master%20file%20of%20Intranet/Medication%20Admin/Paed/IV/Levosimendan_Paed.pdf';
            f.ampuleConcentration = 2.5;
            f.diluentFluid = '5% Dextrose';
            f.route = 'Peripheral or Central Line';
            f.drawingUpUnits = new SiUnitMeasure(-3, siUnit.gram);
            f.rateUnit = new InfusionRateUnit(-6, siUnit.gram, false, true);
            f.concentrations = [{
                ampuleMl: 5,
                calculatedDose: 12.5,
                cumulativeStartTime: new MinutesDuration(),
                duration: new MinutesDuration(1440),
                diluentVolume: 245,
                drawingUpDose: 12.5,
                finalVolume: 250,
                infusionRate: 10.416666666666677,
                oneMlHrDose: 0.833333333333333,
                isNeat: false,
            }];
            return f;
        })(),
    },
    {
        wt: 28,
        ageMth: 606,
        infusionDrugId: 35,
        // Dilution Method Id: 6 wt: 28 ageMth: 606
        vm: (() => {
            const f = new FixedInfusionDrugVM();
            f.drugName = 'Magnesium Sulphate (asthma)';
            f.sourceDescription = 'Starship PICU Protocols';
            f.sourceHref = 'http://www.adhb.govt.nz/picu/Protocols/Asthma.pdf';
            f.ampuleConcentration = 493;
            f.diluentFluid = '5% Dextrose';
            f.note = 'Watch for hypotension. Keep serum Mg 1.5-2.5 mmol/L. May be repeated.';
            f.route = 'Peripheral or Central Line';
            f.drawingUpUnits = new SiUnitMeasure(-3, siUnit.gram);
            f.rateUnit = new InfusionRateUnit(-3, siUnit.gram, true, false);
            f.concentrations = [{
                ampuleMl: 2.83975659229209,
                calculatedDose: 50,
                cumulativeStartTime: new MinutesDuration(),
                duration: new MinutesDuration(20),
                diluentVolume: 17.1602434077079,
                drawingUpDose: 1400,
                finalVolume: 20,
                infusionRate: 60,
                oneMlHrDose: 2.5,
                isNeat: false,
            }];
            return f;
        })(),
    },
    {
        wt: 50,
        ageMth: 600,
        infusionDrugId: 37,
        // Dilution Method Id: 4 wt: 50 ageMth: 600
        vm: (() => {
            const f = new FixedInfusionDrugVM();
            f.drugName = 'Phenytoin - Peripheral IV';
            f.sourceDescription = 'Starship Clinical Guidelines';
            f.sourceHref = 'http://www.adhb.govt.nz/StarShipClinicalGuidelines/Convulsions%20Status%20Epilepticus.htm#Manage_in_Resuscitation_Area';
            f.ampuleConcentration = 50;
            f.diluentFluid = '0.9% Saline';
            f.route = 'Large Peripheral Line';
            f.drawingUpUnits = new SiUnitMeasure(-3, siUnit.gram);
            f.rateUnit = new InfusionRateUnit(-3, siUnit.gram, true, false);
            f.concentrations = [{
                ampuleMl: 20,
                calculatedDose: 20,
                cumulativeStartTime: new MinutesDuration(),
                duration: new MinutesDuration(20),
                diluentVolume: 180,
                drawingUpDose: 1000,
                finalVolume: 200,
                infusionRate: 600,
                oneMlHrDose: 0.1,
                isNeat: false,
            }];
            return f;
        })(),
    },
    {
        wt: 50,
        ageMth: 600,
        infusionDrugId: 36,
        // Dilution Method Id: 2 wt: 50 ageMth: 600
        vm: (() => {
            const f = new FixedInfusionDrugVM();
            f.drugName = 'Phenytoin - Central Access';
            f.sourceDescription = 'Starship Clinical Guidelines';
            f.sourceHref = 'http://www.adhb.govt.nz/StarShipClinicalGuidelines/Convulsions%20Status%20Epilepticus.htm#Manage_in_Resuscitation_Area';
            f.ampuleConcentration = 50;
            f.diluentFluid = 'Undiluted';
            f.route = 'Central Line Only';
            f.drawingUpUnits = new SiUnitMeasure(-3, siUnit.gram);
            f.rateUnit = new InfusionRateUnit(-3, siUnit.gram, true, false);
            f.concentrations = [{
                ampuleMl: 20,
                calculatedDose: 20,
                cumulativeStartTime: new MinutesDuration(),
                duration: new MinutesDuration(20),
                diluentVolume: 0,
                drawingUpDose: 1000,
                finalVolume: 20,
                infusionRate: 60,
                isNeat: true,
                oneMlHrDose: 1,
            }];
            return f;
        })(),
    }];
}
