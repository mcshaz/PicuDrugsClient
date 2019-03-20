import chai = require('chai'); //import { expect } from 'chai';
import chaiRoughly = require('chai-roughly'); //By default, chai-almost allows a tolerance of 1 x 10-6
import { VariableInfusionView, VariableInfusionDrugVM, transformVariableInfusions, SiUnitMeasure, InfusionRateUnit, VariableConcentrationDetailVM, NumericRange } from './../../src/infusionCalculations';
import { dilutionMethod, siUnit } from '../../src/db';
chai.use(chaiRoughly);
describe('variableVMConversion', () => {
    const methodsTested = new Set<dilutionMethod>()
    for (const td of getVariableInfusionVMTestData()) {
        const dilMethods = [...new Set(td.viewRows.map(r=>r.DilutionMethod))];
        dilMethods.forEach(dm => methodsTested.add(dm));
        td.viewRows.forEach(vr=> vr.Note = vr.Note || "");
        it(`${td.vm[0].DrugName} (${td.wt}kg) - dilMethod [${dilMethods.join(',')}]`, () => {
            const testOut = transformVariableInfusions(td.wt, td.viewRows);
            chai.expect(testOut).to.roughly.deep.equal(td.vm);
        });
    }
    it('has tested relevant methods', () => {
        chai.expect(Array.from(methodsTested)).to.have.same.members([1,2, 3, 4, 5, 6]);
    });
});
interface variableVMTestData { wt: number, viewRows: VariableInfusionView[], vm: VariableInfusionDrugVM[] }
function getVariableInfusionVMTestData(): variableVMTestData[] {
    return [
        {
            wt: 2.8, viewRows: [{
                InfusionDrugId: 24,
                Fullname: "doPamine/doBUTamine",
                Abbrev: "doP/doBUT",
                AmpulePrefix: -3,
                SiUnit: siUnit.gram,
                DilutionMethod: dilutionMethod.VaryDrugFixedFlow,
                InfusionPrefix: -6,
                Volume: 50,
                RateMin: 2.5,
                RateMax: 10,
                Concentration: 5,
                HrefBase: "http://www.adhb.govt.nz/picu/Protocols/",
                HrefPage: "Paediatric%20Drug%20Infusion%20Chart.pdf",
                IsPerMin: true
            }, {
                InfusionDrugId: 22,
                Fullname: "Propofol",
                Abbrev: "Propofol",
                AmpulePrefix: -3,
                Note: "NEVER in shock or compensated shock",
                SiUnit: siUnit.gram,
                DilutionMethod: dilutionMethod.NeatVaryFlowByWeight,
                InfusionPrefix: -3,
                Volume: 50,
                RateMin: 0,
                RateMax: 3,
                IsPerMin: false,
                Concentration: 10,
                HrefBase: "http://www.adhb.govt.nz/picu/Protocols/",
                HrefPage: "Paediatric%20Drug%20Infusion%20Chart.pdf",
            }],
            vm: (() => {
                let d1 = new VariableInfusionDrugVM();
                d1.DrugName = "doPamine/doBUTamine";
                d1.Link = "http://www.adhb.govt.nz/picu/Protocols/Paediatric%20Drug%20Infusion%20Chart.pdf";
                d1.DoseRange = new NumericRange(2.5, 10);
                d1.RateUnit = new InfusionRateUnit(-6, siUnit.gram, true, true);
                d1.DrawingUpUnits = new SiUnitMeasure(-3, siUnit.gram);
                let c1 = new VariableConcentrationDetailVM()
                c1.DetailName = "doP/doBUT";
                c1.FinalVolume = 50;
                c1.DrawingUpDose = 42;
                c1.OneMlHrDose = 5;
                c1.FlowRange = new NumericRange(0.5, 2);
                c1.IsNeat = false;
                d1.InfusionDetails = [c1];

                let d2 = new VariableInfusionDrugVM();
                d2.DrugName = "Propofol";
                d2.Link = "http://www.adhb.govt.nz/picu/Protocols/Paediatric%20Drug%20Infusion%20Chart.pdf";
                d2.DoseRange = new NumericRange(0, 3);
                d2.RateUnit = new InfusionRateUnit(-3, siUnit.gram, true, false);
                d2.DrawingUpUnits = new SiUnitMeasure(-3, siUnit.gram);
                d2.Note = "NEVER in shock or compensated shock";
                let c2 = new VariableConcentrationDetailVM
                c2.DetailName = "Propofol";
                c2.FinalVolume = 50;
                c2.DrawingUpDose = 500;
                c2.OneMlHrDose = 10.0 / 2.8;
                c2.FlowRange = new NumericRange(0, 0.84);
                c2.IsNeat = true;
                d2.InfusionDetails = [c2];
                return [d1, d2];
            })()
        },
        {
            wt: 5.7, viewRows: [{
                InfusionDrugId: 25,
                Fullname: "Adrenaline/Noradrenaline",
                Abbrev: "Adrenaline/Norad",
                AmpulePrefix: -3,
                SiUnit: siUnit.gram,
                Category: "Low",
                DilutionMethod: dilutionMethod.VaryDrugFixedFlow,
                InfusionPrefix: -6,
                Volume: 50,
                RateMin: 0.01,
                RateMax: 1,
                IsPerMin: true,
                Concentration: 0.05,
                HrefBase: "http://www.adhb.govt.nz/picu/Protocols/",
                HrefPage: "Paediatric%20Drug%20Infusion%20Chart.pdf",
            }, {
                InfusionDrugId: 25,
                Fullname: "Adrenaline/Noradrenaline",
                Abbrev: "Adrenaline/Norad",
                AmpulePrefix: -3,
                SiUnit: siUnit.gram,
                Category: "High",
                DilutionMethod: dilutionMethod.VaryDrugFixedFlow,
                InfusionPrefix: -6,
                Volume: 50,
                RateMin: 0.01,
                RateMax: 1,
                IsPerMin: true,
                Concentration: 0.1,
                HrefBase: "http://www.adhb.govt.nz/picu/Protocols/",
                HrefPage: "Paediatric%20Drug%20Infusion%20Chart.pdf",
            }],
            vm: [(() => {
                let d = new VariableInfusionDrugVM();
                d.DrugName = "Adrenaline/Noradrenaline";
                d.Link = "http://www.adhb.govt.nz/picu/Protocols/Paediatric%20Drug%20Infusion%20Chart.pdf";
                d.DoseRange = new NumericRange(0.01, 1);
                d.RateUnit = new InfusionRateUnit(-6, siUnit.gram, true, true);
                d.DrawingUpUnits = new SiUnitMeasure(-3, siUnit.gram);
                let c1 = new VariableConcentrationDetailVM
                c1.DetailName = "Low";
                c1.FinalVolume = 50;
                c1.DrawingUpDose = 0.855;
                c1.OneMlHrDose = 0.05;
                c1.FlowRange = new NumericRange(0.2, 20);
                c1.IsNeat = false;
                let c2 = new VariableConcentrationDetailVM
                c2.DetailName = "High";
                c2.FinalVolume = 50;
                c2.DrawingUpDose = 1.71;
                c2.OneMlHrDose = 0.1;
                c2.FlowRange = new NumericRange(0.1, 10);
                c2.IsNeat = false;
                d.InfusionDetails = [c1, c2];
                return d;
            })()]
        },

        {
            wt: 73, viewRows: [{
                InfusionDrugId: 25,
                Fullname: "Adrenaline/Noradrenaline",
                Abbrev: "Adrenaline/Norad",
                AmpulePrefix: -3,
                SiUnit: siUnit.gram,
                Category: "Low",
                DilutionMethod: dilutionMethod.VaryDilutionVolumeFixedFlow,
                InfusionPrefix: -6,
                RateMin: 0.01,
                RateMax: 1,
                IsPerMin: true,
                Concentration: 0.01,
                HrefBase: "http://www.adhb.govt.nz/picu/Protocols/",
                HrefPage: "Adult%20Drug%20Infusion%20Chart.pdf",
            }, {
                InfusionDrugId: 25,
                Fullname: "Adrenaline/Noradrenaline",
                Abbrev: "Adrenaline/Norad",
                AmpulePrefix: -3,
                SiUnit: siUnit.gram,
                Category: "Medium",
                DilutionMethod: dilutionMethod.VaryDilutionVolumeFixedFlow,
                InfusionPrefix: -6,
                RateMin: 0.01,
                RateMax: 1,
                IsPerMin: true,
                Concentration: 0.02,
                HrefBase: "http://www.adhb.govt.nz/picu/Protocols/",
                HrefPage: "Adult%20Drug%20Infusion%20Chart.pdf",
            }, {
                InfusionDrugId: 25,
                Fullname: "Adrenaline/Noradrenaline",
                Abbrev: "Adrenaline/Norad",
                AmpulePrefix: -3,
                SiUnit: siUnit.gram,
                Category: "High",
                DilutionMethod: dilutionMethod.VaryDilutionVolumeFixedFlow,
                InfusionPrefix: -6,
                RateMin: 0.01,
                RateMax: 1,
                IsPerMin: true,
                Concentration: 0.05,
                HrefBase: "http://www.adhb.govt.nz/picu/Protocols/",
                HrefPage: "Adult%20Drug%20Infusion%20Chart.pdf",
            }], vm: [(() => {
                let d = new VariableInfusionDrugVM()
                d.DrugName = "Adrenaline/Noradrenaline";
                d.Link = "http://www.adhb.govt.nz/picu/Protocols/Adult%20Drug%20Infusion%20Chart.pdf";
                d.DoseRange = new NumericRange(0.01, 1);
                d.RateUnit = new InfusionRateUnit(-6, siUnit.gram, true, true);
                d.DrawingUpUnits = new SiUnitMeasure(-3, siUnit.gram);
                let c1 = new VariableConcentrationDetailVM
                c1.DetailName = "Low";
                c1.FinalVolume = 46;
                c1.DrawingUpDose = 2;
                c1.OneMlHrDose = 0.01;
                c1.FlowRange = new NumericRange(1, 100);
                c1.IsNeat = false
                let c2 = new VariableConcentrationDetailVM
                c2.DetailName = "Medium";
                c2.FinalVolume = 46;
                c2.DrawingUpDose = 4;
                c2.OneMlHrDose = 0.02;
                c2.FlowRange = new NumericRange(0.5, 50);
                c2.IsNeat = false
                let c3 = new VariableConcentrationDetailVM
                c3.DetailName = "High";
                c3.FinalVolume = 46;
                c3.DrawingUpDose = 10;
                c3.OneMlHrDose = 0.05;
                c3.FlowRange = new NumericRange(0.2, 20);
                c3.IsNeat = false
                d.InfusionDetails = [c1, c2, c3]
                return d;
            })()]
        },
        {
            wt: 3.6, viewRows: [
                {
                    InfusionDrugId: 16,
                    Fullname: "Actrapid Insulin",
                    Abbrev: "Actrapid",
                    AmpulePrefix: 0,
                    SiUnit: siUnit.unit,
                    DilutionMethod: dilutionMethod.FixedDilutionVaryFlowByWeight,
                    InfusionPrefix: 0,
                    Volume: 50,
                    RateMin: 0.05,
                    RateMax: 0.1,
                    IsPerMin: false,
                    Concentration: 1,
                    HrefBase: "http://www.adhb.govt.nz/picu/Protocols/",
                    HrefPage: "Paediatric%20Drug%20Infusion%20Chart.pdf",
                }], vm: [(() => {
                    let d = new VariableInfusionDrugVM();
                    d.DrugName = "Actrapid Insulin";
                    d.Link = "http://www.adhb.govt.nz/picu/Protocols/Paediatric%20Drug%20Infusion%20Chart.pdf";
                    d.DoseRange = new NumericRange(0.05, 0.1);
                    d.RateUnit = new InfusionRateUnit(0, siUnit.unit, true, false);
                    d.DrawingUpUnits = new SiUnitMeasure(0, siUnit.unit);
                    let c = new VariableConcentrationDetailVM();
                    c.DetailName = "Actrapid";
                    c.FinalVolume = 50;
                    c.DrawingUpDose = 50;
                    c.OneMlHrDose = 1.0 / 3.6;
                    c.FlowRange = new NumericRange(0.18, 0.36);
                    c.IsNeat = false;
                    d.InfusionDetails = [c];
                    return d;
                })()]
        }, {
            wt: 73,
            viewRows: [
                {
                    InfusionDrugId: 12,
                    Fullname: "Morphine",
                    Abbrev: "Morphine",
                    AmpulePrefix: -3,
                    SiUnit: siUnit.gram,
                    DilutionMethod: dilutionMethod.FixedDilutionFixedFlow,
                    InfusionPrefix: -3,
                    Volume: 60,
                    RateMin: 1,
                    RateMax: 4,
                    IsPerMin: false,
                    Concentration: 1,
                    HrefBase: "http://www.adhb.govt.nz/picu/Protocols/",
                    HrefPage: "Paediatric%20Drug%20Infusion%20Chart.pdf",
                }], vm: [(() => {
                    let d = new VariableInfusionDrugVM();
                    d.DrugName = "Morphine";
                    d.Link = "http://www.adhb.govt.nz/picu/Protocols/Paediatric%20Drug%20Infusion%20Chart.pdf";
                    d.DoseRange = new NumericRange(1, 4);
                    d.RateUnit = new InfusionRateUnit(-3, siUnit.gram, false, false);
                    d.DrawingUpUnits = new SiUnitMeasure(-3, siUnit.gram);

                    let c = new VariableConcentrationDetailVM()
                    c.DetailName = "Morphine";
                    c.FinalVolume = 60;
                    c.DrawingUpDose = 60;
                    c.OneMlHrDose = 1;
                    c.FlowRange = new NumericRange(1, 4);
                    c.IsNeat = false;
                    d.InfusionDetails = [c];
                    return d;
                })()]
        }, {
            wt: 73, viewRows: [
                {
                    InfusionDrugId: 15,
                    Fullname: "Frusemide",
                    Abbrev: "Frusemide",
                    AmpulePrefix: -3,
                    SiUnit: siUnit.gram,
                    DilutionMethod: dilutionMethod.NeatFixedFlow,
                    InfusionPrefix: -3,
                    Volume: 25,
                    RateMin: 2,
                    RateMax: 20,
                    IsPerMin: false,
                    Concentration: 10,
                    HrefBase: "http://www.adhb.govt.nz/picu/Protocols/",
                    HrefPage: "Paediatric%20Drug%20Infusion%20Chart.pdf",
                }], vm: [(() => {
                    let d = new VariableInfusionDrugVM();
                    d.DrugName = "Frusemide";
                    d.Link = "http://www.adhb.govt.nz/picu/Protocols/Paediatric%20Drug%20Infusion%20Chart.pdf";
                    d.DoseRange = new NumericRange(2, 20);
                    d.RateUnit = new InfusionRateUnit(-3, siUnit.gram, false, false);
                    d.DrawingUpUnits = new SiUnitMeasure(-3, siUnit.gram);
                    let c = new VariableConcentrationDetailVM()
                    c.DetailName = "Frusemide";
                    c.FinalVolume = 25;
                    c.DrawingUpDose = 250;
                    c.OneMlHrDose = 10;
                    c.FlowRange = new NumericRange(0.2, 2);
                    c.IsNeat = true;
                    d.InfusionDetails = [c];
                    return d;
                })()]
        }]
}