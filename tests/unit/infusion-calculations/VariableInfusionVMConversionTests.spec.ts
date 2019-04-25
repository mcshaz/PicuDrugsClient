import chai from 'chai'; // import { expect } from 'chai';
import chaiAlmost from 'chai-almost'; // By default, chai-almost allows a tolerance of 1 x 10-6
import { dilutionMethod, IEntityVariableInfusionDrug, siUnit } from '@/services/db';
import { ToArrayMap, concatSets, toMap } from './utilities/toMap';
import { fileFetch } from '../../test-resources/FileFetch';
import { getVariableInfusionsForPt } from '@/services/infusion-calculations/Transformations/Calculations/getVariableInfusionsForPt';
import { IVariableInfusionDrugVM, NumericRange, InfusionRateUnit, SiUnitMeasure } from '@/services/infusion-calculations';
import { transformVariableInfusions } from '@/services/infusion-calculations/Transformations/transformVariableInfusions';

chai.use(chaiAlmost());
describe('variableVMConversion', () => {
    let dbDatum: IEntityVariableInfusionDrug[][];
    const testDatum = getVariableInfusionVMTestData();
    before('get data', async () => {
        const am = new ToArrayMap<IVariableVMTestData, IEntityVariableInfusionDrug>(testDatum, (d) => d.infusionDrugIds);
        const dbInit = await fileFetch.getUpdates(null);
        dbDatum = am.match(dbInit.data.infusionDrugs as IEntityVariableInfusionDrug[], (d) => d.infusionDrugId)
            .map((m) => m[1] as IEntityVariableInfusionDrug[]);
    });
    it('has all variable drugs', () => {
        chai.expect(dbDatum.every((d) => d.every((v) => (v as any).isTitratable === true)),
            'every isTitratable === true').to.equal(true);
    });
    it('has matched test data appropriately', () => {
        const dbIds = dbDatum.map((d) => d.map((i) => i.infusionDrugId));
        const expectIds = testDatum.map((d) => d.infusionDrugIds);
        chai.expect(dbIds).to.have.same.deep.ordered.members(expectIds);
    });
    describe('can produce views from test data', () => {
        const methodsTested = new Set<dilutionMethod>();
        for (let i = 0; i < testDatum.length; i++) {
            const expected = testDatum[i];
            it(`${expected.vm.map((d) => d.drugName).join(',')} (${expected.wt}kg)`, () => {
                const selected = getVariableInfusionsForPt(dbDatum[i], expected.ageMth, expected.wt);
                const dilMethods = [...new Set(selected.map((s) => s.dilution.dilutionMethodId))];
                concatSets(methodsTested, dilMethods);
                const testOut = transformVariableInfusions(expected.wt, selected);
                chai.expect(testOut, `dilMethod [${dilMethods.join(',')}]`).to.deep.almost.equal(expected.vm);
            });
        }
        it('has tested relevant methods', () => {
            chai.expect(Array.from(methodsTested)).to.have.same.members([1, 2, 3, 4, 5, 6]);
        });
    });
});

interface IVariableVMTestData { wt: number; ageMth: number; infusionDrugIds: number[];
vm: IVariableInfusionDrugVM[]; }
function getVariableInfusionVMTestData(): IVariableVMTestData[] {
    return [{
        wt: 2.8,
        ageMth: 0,
        infusionDrugIds: [24, 22],
        vm: [{
                drugName: 'doPamine/doBUTamine',
                link: 'http://www.adhb.govt.nz/picu/Protocols/Paediatric%20Drug%20Infusion%20Chart.pdf',
                doseRange: new NumericRange(2.5, 10),
                rateUnit: new InfusionRateUnit(-6, siUnit.gram, true, true),
                drawingUpUnits: new SiUnitMeasure(-3, siUnit.gram),
                note: '',
                concentrations: [{
                    detailName: 'doP/doBUT',
                    finalVolume: 50,
                    drawingUpDose: 42,
                    oneMlHrDose: 5,
                    flowRange: new NumericRange(0.5, 2),
                    isNeat: false,
                }],
            }, {
                drugName: 'Propofol',
                link: 'http://www.adhb.govt.nz/picu/Protocols/Paediatric%20Drug%20Infusion%20Chart.pdf',
                doseRange: new NumericRange(0, 3),
                rateUnit: new InfusionRateUnit(-3, siUnit.gram, true, false),
                drawingUpUnits: new SiUnitMeasure(-3, siUnit.gram),
                note: 'NEVER in shock or compensated shock',
                concentrations: [{
                    detailName: 'Propofol',
                    finalVolume: 50,
                    drawingUpDose: 500,
                    oneMlHrDose: 10.0 / 2.8,
                    flowRange: new NumericRange(0, 0.84),
                    isNeat: true,
                }],
            }],
        }, {
            wt: 5.7, ageMth: 1, infusionDrugIds: [25],
            vm: [{
                drugName: 'Adrenaline/Noradrenaline',
                link: 'http://www.adhb.govt.nz/picu/Protocols/Paediatric%20Drug%20Infusion%20Chart.pdf',
                doseRange: new NumericRange(0.01, 1),
                rateUnit: new InfusionRateUnit(-6, siUnit.gram, true, true),
                drawingUpUnits: new SiUnitMeasure(-3, siUnit.gram),
                note: '',
                concentrations: [{
                    detailName: 'Low',
                    finalVolume: 50,
                    drawingUpDose: 0.855,
                    oneMlHrDose: 0.05,
                    flowRange: new NumericRange(0.2, 20),
                    isNeat: false,
                }, {
                    detailName: 'High',
                    finalVolume: 50,
                    drawingUpDose: 1.71,
                    oneMlHrDose: 0.1,
                    flowRange: new NumericRange(0.1, 10),
                    isNeat: false,
                }],
            }],
        }, {
            wt: 73,  ageMth: 150, infusionDrugIds: [25], vm: [{
                drugName: 'Adrenaline/Noradrenaline',
                link: 'http://www.adhb.govt.nz/picu/Protocols/Adult%20Drug%20Infusion%20Chart.pdf',
                doseRange: new NumericRange(0.01, 1),
                rateUnit: new InfusionRateUnit(-6, siUnit.gram, true, true),
                drawingUpUnits: new SiUnitMeasure(-3, siUnit.gram),
                note: '',
                concentrations: [{
                    detailName: 'Low',
                    finalVolume: 46,
                    drawingUpDose: 2,
                    oneMlHrDose: 0.01,
                    flowRange: new NumericRange(1, 100),
                    isNeat: false,
                }, {
                    detailName: 'Medium',
                    finalVolume: 46,
                    drawingUpDose: 4,
                    oneMlHrDose: 0.02,
                    flowRange: new NumericRange(0.5, 50),
                    isNeat: false,
                }, {
                    detailName: 'High',
                    finalVolume: 46,
                    drawingUpDose: 10,
                    oneMlHrDose: 0.05,
                    flowRange: new NumericRange(0.2, 20),
                    isNeat: false,
                }],
            }],
        }, {
            wt: 3.6, ageMth: 0, infusionDrugIds: [16], vm: [{
                drugName: 'Actrapid Insulin',
                link: 'http://www.adhb.govt.nz/picu/Protocols/Paediatric%20Drug%20Infusion%20Chart.pdf',
                doseRange: new NumericRange(0.05, 0.1),
                rateUnit: new InfusionRateUnit(0, siUnit.unit, true, false),
                drawingUpUnits: new SiUnitMeasure(0, siUnit.unit),
                note: '',
                concentrations: [{
                    detailName: 'Actrapid',
                    finalVolume: 50,
                    drawingUpDose: 50,
                    oneMlHrDose: 1.0 / 3.6,
                    flowRange: new NumericRange(0.18, 0.36),
                    isNeat: false,
                }],
            }],
        }, {
            wt: 73, ageMth: 150, infusionDrugIds: [12],
            vm: [{
                drugName: 'Morphine',
                link: 'http://www.adhb.govt.nz/picu/Protocols/Paediatric%20Drug%20Infusion%20Chart.pdf',
                doseRange: new NumericRange(1, 4),
                rateUnit: new InfusionRateUnit(-3, siUnit.gram, false, false),
                drawingUpUnits: new SiUnitMeasure(-3, siUnit.gram),
                note: '',
                concentrations: [{
                    detailName: 'Morphine',
                    finalVolume: 60,
                    drawingUpDose: 60,
                    oneMlHrDose: 1,
                    flowRange: new NumericRange(1, 4),
                    isNeat: false,
                }],
            }],
        }, {
            wt: 73, ageMth: 150, infusionDrugIds: [15], vm: [{
                drugName: 'Frusemide',
                link: 'http://www.adhb.govt.nz/picu/Protocols/Paediatric%20Drug%20Infusion%20Chart.pdf',
                doseRange: new NumericRange(2, 20),
                rateUnit: new InfusionRateUnit(-3, siUnit.gram, false, false),
                drawingUpUnits: new SiUnitMeasure(-3, siUnit.gram),
                note: '',
                concentrations: [{
                    detailName: 'Frusemide',
                    finalVolume: 25,
                    drawingUpDose: 250,
                    oneMlHrDose: 10,
                    flowRange: new NumericRange(0.2, 2),
                    isNeat: true,
                }],
            }],
    }];
}
