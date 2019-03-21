import { dilutionMethod, siUnit} from './../../../src/db';
import chai from 'chai'; // import { expect } from 'chai';
import chaiAlmost from 'chai-almost'; // By default, chai-almost allows a tolerance of 1 x 10-6
import {FixedInfusionView, FixedInfusionDrugVM, transformFixedInfusions, SiUnitMeasure, InfusionRateUnit, InfusionPeriodVM, MinutesDuration } from './../../../src/infusionCalculations';
chai.use(chaiAlmost());
describe('fixedVMConversion', () => {
    const methodsTested = new Set<dilutionMethod>();
    for (const td of getFixedInfusionVMTestData()) {
        const dilMethods = Array.from(new Set(td.viewRows.map((r) => r.DilutionMethod)));
        dilMethods.forEach((dm) => methodsTested.add(dm));
        td.viewRows.forEach((vr) => vr.Note = vr.Note || '');
        it(`${td.vm.DrugName} (${td.wt}kg) - dilMethods [${dilMethods.join(',')}]`, () => {
            const testOut = transformFixedInfusions(td.wt, td.viewRows);
            chai.expect(testOut).to.be.deep.almost.equal(td.vm);
        });
    }
    it('has tested relevant methods', () => {
        chai.expect(Array.from(methodsTested)).to.have.same.members([2, 3, 4, 6, 7]);
    });
});
interface IFixedVMTestData {wt: number; viewRows: FixedInfusionView[]; vm: FixedInfusionDrugVM; }
function getFixedInfusionVMTestData(): IFixedVMTestData[] {
    return [
        {
            wt: 10, // Dilution Method Id: 7 wt: 10 ageMth: 71
            viewRows:
                [{
                    InfusionDrugId: 32,
                    Fullname: 'Acetylcysteine',
                    Abbrev: 'NAC',
                    AmpulePrefix: -3,
                    SiUnit: siUnit.gram,
                    Note: 'watch for hypotension.',
                    ReferenceDescription: 'Notes on Injectable Drugs 6th Ed',
                    RefAbbrev: 'Notes on Inj',
                    Hyperlink: 'file://ahsl6/main/Groups/INTRANET/Pharmacy/eNoids6/eNOIDs6Mongraphs/',
                    RouteDescription: 'Peripheral or Central Line',
                    RouteAbbrev: 'PIV',
                    DilutionMethod: dilutionMethod.VaryDrugDilutionVolFlowByWeight,
                    InfusionPrefix: -3,
                    IsPerMin: false,
                    ReferencePage: 'ACETYLCYSTEINE.pdf',
                    Concentration: 50,
                    Volume: 3,
                    StopMins: 15,
                    Rate: 600,
                    DiluentType: '5% Dextrose',
                    DiluentAbbrev: '5% dex',
                    AmpuleConcentration: 200,
                },
                {
                    InfusionDrugId: 32,
                    Fullname: 'Acetylcysteine',
                    Abbrev: 'NAC',
                    AmpulePrefix: -3,
                    SiUnit: siUnit.gram,
                    Note: 'watch for hypotension.',
                    ReferenceDescription: 'Notes on Injectable Drugs 6th Ed',
                    RefAbbrev: 'Notes on Inj',
                    Hyperlink: 'file://ahsl6/main/Groups/INTRANET/Pharmacy/eNoids6/eNOIDs6Mongraphs/',
                    RouteDescription: 'Peripheral or Central Line',
                    RouteAbbrev: 'PIV',
                    DilutionMethod: dilutionMethod.VaryDrugDilutionVolFlowByWeight,
                    InfusionPrefix: -3,
                    IsPerMin: false,
                    ReferencePage: 'ACETYLCYSTEINE.pdf',
                    Concentration: 7.14285714285714,
                    Volume: 7,
                    StopMins: 255,
                    Rate: 12.5,
                    DiluentType: '5% Dextrose',
                    DiluentAbbrev: '5% dex',
                    AmpuleConcentration: 200,
                },
                {
                    InfusionDrugId: 32,
                    Fullname: 'Acetylcysteine',
                    Abbrev: 'NAC',
                    AmpulePrefix: -3,
                    SiUnit: siUnit.gram,
                    Note: 'watch for hypotension.',
                    ReferenceDescription: 'Notes on Injectable Drugs 6th Ed',
                    RefAbbrev: 'Notes on Inj',
                    Hyperlink: 'file://ahsl6/main/Groups/INTRANET/Pharmacy/eNoids6/eNOIDs6Mongraphs/',
                    RouteDescription: 'Peripheral or Central Line',
                    RouteAbbrev: 'PIV',
                    DilutionMethod: dilutionMethod.VaryDrugDilutionVolFlowByWeight,
                    InfusionPrefix: -3,
                    IsPerMin: false,
                    ReferencePage: 'ACETYLCYSTEINE.pdf',
                    Concentration: 7.14285714285714,
                    Volume: 14,
                    StopMins: 1215,
                    Rate: 6.25,
                    DiluentType: '5% Dextrose',
                    DiluentAbbrev: '5% dex',
                    AmpuleConcentration: 200,
                },
                ]
            , vm: (() => {
                const f = new FixedInfusionDrugVM();
                f.DrugName = 'Acetylcysteine';
                f.SourceDescription = 'Notes on Injectable Drugs 6th Ed';
                f.SourceHref = 'file://ahsl6/main/Groups/INTRANET/Pharmacy/eNoids6/eNOIDs6Mongraphs/ACETYLCYSTEINE.pdf';
                f.AmpuleConcentration = 200;
                f.DiluentFluid = '5% Dextrose';
                f.Note = 'watch for hypotension.';
                f.Route = 'Peripheral or Central Line';
                f.DrawingUpUnits = new SiUnitMeasure(-3, siUnit.gram);
                f.RateUnit = new InfusionRateUnit(-3, siUnit.gram, true, false);
                const i1 = new InfusionPeriodVM();
                i1.AmpuleMl = 7.5;
                i1.CalculatedDose = 150;
                i1.CumulativeStartTime = new MinutesDuration();
                i1.Duration = new MinutesDuration(15);
                i1.DiluentVolume = 22.5;
                i1.DrawingUpDose = 1500;
                i1.FinalVolume = 30;
                i1.InfusionRate = 120;
                i1.OneMlHrDose = 5;
                const i2 = new InfusionPeriodVM();
                i2.AmpuleMl = 2.5;
                i2.CalculatedDose = 50;
                i2.CumulativeStartTime = new MinutesDuration(15);
                i2.Duration = new MinutesDuration(240);
                i2.DiluentVolume = 67.5;
                i2.DrawingUpDose = 500;
                i2.FinalVolume = 70;
                i2.InfusionRate = 17.5;
                i2.OneMlHrDose = 0.714285714285714;
                const i3 = new InfusionPeriodVM();
                i3.AmpuleMl = 5;
                i3.CalculatedDose = 100;
                i3.CumulativeStartTime = new MinutesDuration(255);
                i3.Duration = new MinutesDuration(960);
                i3.DiluentVolume = 135;
                i3.DrawingUpDose = 1000;
                i3.FinalVolume = 140;
                i3.InfusionRate = 8.75;
                i3.OneMlHrDose = 0.714285714285714;
                f.InfusionPeriods = [i1, i2, i3];
                return f;
            })(),
        },
        // Dilution Method Id: 3 wt: 70 ageMth: 600
        {
            wt: 70,
            viewRows: [{
                InfusionDrugId: 33,
                Fullname: 'Levosimendan',
                Abbrev: 'Levosimendan',
                AmpulePrefix: -3,
                SiUnit: siUnit.gram,
                ReferenceDescription: 'Starship Pharmacy Guidelines (paediatric)',
                RefAbbrev: 'SS pharm',
                Hyperlink: 'file://ahsl6/main/Groups/Everyone/POLICY/Master%20file%20of%20Intranet/Medication%20Admin/Paed/IV/',
                RouteDescription: 'Peripheral or Central Line',
                RouteAbbrev: 'PIV',
                DilutionMethod: dilutionMethod.FixedDilutionFixedFlow,
                InfusionPrefix: -6,
                IsPerMin: true,
                ReferencePage: 'Levosimendan_Paed.pdf',
                Concentration: 0.833333333333333,
                Volume: 250,
                StopMins: 1440,
                Rate: 8.68055555555556,
                DiluentType: '5% Dextrose',
                DiluentAbbrev: '5% dex',
                AmpuleConcentration: 2.5,
            }], vm: (() => {
                const f = new FixedInfusionDrugVM();
                f.DrugName = 'Levosimendan';
                f.SourceDescription = 'Starship Pharmacy Guidelines (paediatric)';
                f.SourceHref = 'file://ahsl6/main/Groups/Everyone/POLICY/Master%20file%20of%20Intranet/Medication%20Admin/Paed/IV/Levosimendan_Paed.pdf';
                f.AmpuleConcentration = 2.5;
                f.DiluentFluid = '5% Dextrose';
                f.Route = 'Peripheral or Central Line';
                f.DrawingUpUnits = new SiUnitMeasure(-3, siUnit.gram);
                f.RateUnit = new InfusionRateUnit(-6, siUnit.gram, false, true);
                const i = new InfusionPeriodVM();
                i.AmpuleMl = 5;
                i.CalculatedDose = 12.5;
                i.CumulativeStartTime = new MinutesDuration();
                i.Duration = new MinutesDuration(1440);
                i.DiluentVolume = 245;
                i.DrawingUpDose = 12.5;
                i.FinalVolume = 250;
                i.InfusionRate = 10.416666666666677;
                i.OneMlHrDose = 0.833333333333333;
                f.InfusionPeriods = [i];
                return f;
            })(),
        },
        {
            wt: 28,
            // Dilution Method Id: 6 wt: 28 ageMth: 606
            viewRows: [{
                InfusionDrugId: 35,
                Fullname: 'Magnesium Sulphate (asthma)',
                Abbrev: 'Mg',
                AmpulePrefix: -3,
                SiUnit: siUnit.gram,
                Note: 'Watch for hypotension. Keep serum Mg 1.5-2.5 mmol/L. May be repeated.',
                ReferenceDescription: 'Starship PICU Protocols',
                RefAbbrev: 'PICU RBPs',
                Hyperlink: 'http://www.adhb.govt.nz/picu/Protocols/',
                RouteDescription: 'Peripheral or Central Line',
                RouteAbbrev: 'PIV',
                DilutionMethod: dilutionMethod.VaryDrugFixedFlow,
                InfusionPrefix: -3,
                IsPerMin: false,
                ReferencePage: 'Asthma.pdf',
                Concentration: 2.5,
                Volume: 20,
                StopMins: 20,
                Rate: 150,
                DiluentType: '5% Dextrose',
                DiluentAbbrev: '5% dex',
                AmpuleConcentration: 493,
            }], vm: (() => {
                const f = new FixedInfusionDrugVM();
                f.DrugName = 'Magnesium Sulphate (asthma)';
                f.SourceDescription = 'Starship PICU Protocols';
                f.SourceHref = 'http://www.adhb.govt.nz/picu/Protocols/Asthma.pdf';
                f.AmpuleConcentration = 493;
                f.DiluentFluid = '5% Dextrose';
                f.Note = 'Watch for hypotension. Keep serum Mg 1.5-2.5 mmol/L. May be repeated.';
                f.Route = 'Peripheral or Central Line';
                f.DrawingUpUnits = new SiUnitMeasure(-3, siUnit.gram);
                f.RateUnit = new InfusionRateUnit(-3, siUnit.gram, true, false);
                const i = new InfusionPeriodVM();
                i.AmpuleMl = 2.83975659229209;
                i.CalculatedDose = 50;
                i.CumulativeStartTime = new MinutesDuration();
                i.Duration = new MinutesDuration(20);
                i.DiluentVolume = 17.1602434077079;
                i.DrawingUpDose = 1400;
                i.FinalVolume = 20;
                i.InfusionRate = 60;
                i.OneMlHrDose = 2.5;
                f.InfusionPeriods = [i];
                return f;
            })(),
        },
        {
            wt: 50,
            // Dilution Method Id: 4 wt: 50 ageMth: 600
            viewRows: [{
                InfusionDrugId: 37,
                Fullname: 'Phenytoin - Peripheral IV',
                Abbrev: 'Phenytoin PIV',
                AmpulePrefix: -3,
                SiUnit: siUnit.gram,
                ReferenceDescription: 'Starship Clinical Guidelines',
                RefAbbrev: 'SS Guidelines',
                Hyperlink: 'http://www.adhb.govt.nz/StarShipClinicalGuidelines/',
                RouteDescription: 'Large Peripheral Line',
                RouteAbbrev: 'Large PIV',
                DilutionMethod: dilutionMethod.FixedDilutionVaryFlowByWeight,
                InfusionPrefix: -3,
                IsPerMin: false,
                ReferencePage: 'Convulsions%20Status%20Epilepticus.htm#Manage_in_Resuscitation_Area',
                Concentration: 5,
                StopMins: 20,
                Rate: 60,
                DiluentType: '0.9% Saline',
                DiluentAbbrev: 'Saline',
                AmpuleConcentration: 50,
            }],
            vm: (() => {
                const f = new FixedInfusionDrugVM();
                f.DrugName = 'Phenytoin - Peripheral IV';
                f.SourceDescription = 'Starship Clinical Guidelines';
                f.SourceHref = 'http://www.adhb.govt.nz/StarShipClinicalGuidelines/Convulsions%20Status%20Epilepticus.htm#Manage_in_Resuscitation_Area';
                f.AmpuleConcentration = 50;
                f.DiluentFluid = '0.9% Saline';
                f.Route = 'Large Peripheral Line';
                f.DrawingUpUnits = new SiUnitMeasure(-3, siUnit.gram);
                f.RateUnit = new InfusionRateUnit(-3, siUnit.gram, true, false);
                const i = new InfusionPeriodVM();
                i.AmpuleMl = 20;
                i.CalculatedDose = 20;
                i.CumulativeStartTime = new MinutesDuration();
                i.Duration = new MinutesDuration(20);
                i.DiluentVolume = 180;
                i.DrawingUpDose = 1000;
                i.FinalVolume = 200;
                i.InfusionRate = 600;
                i.OneMlHrDose = 0.1;
                f.InfusionPeriods = [i];
                return f;
            })(),
        },
        {
            wt: 50,
            // Dilution Method Id: 2 wt: 50 ageMth: 600
            viewRows: [{
                InfusionDrugId: 36,
                Fullname: 'Phenytoin - Central Access',
                Abbrev: 'Phenytoin CVL',
                AmpulePrefix: -3,
                SiUnit: siUnit.gram,
                ReferenceDescription: 'Starship Clinical Guidelines',
                RefAbbrev: 'SS Guidelines',
                Hyperlink: 'http://www.adhb.govt.nz/StarShipClinicalGuidelines/',
                RouteDescription: 'Central Line Only',
                RouteAbbrev: 'CVL only',
                DilutionMethod: dilutionMethod.NeatVaryFlowByWeight,
                InfusionPrefix: -3,
                IsPerMin: false,
                ReferencePage: 'Convulsions%20Status%20Epilepticus.htm#Manage_in_Resuscitation_Area',
                Concentration: 50,
                StopMins: 20,
                Rate: 60,
                DiluentType: 'Undiluted',
                DiluentAbbrev: 'Neat',
                AmpuleConcentration: 50,
            }], vm: (() => {
                const f = new FixedInfusionDrugVM();
                f.DrugName = 'Phenytoin - Central Access';
                f.SourceDescription = 'Starship Clinical Guidelines';
                f.SourceHref = 'http://www.adhb.govt.nz/StarShipClinicalGuidelines/Convulsions%20Status%20Epilepticus.htm#Manage_in_Resuscitation_Area';
                f.AmpuleConcentration = 50;
                f.DiluentFluid = 'Undiluted';
                f.Route = 'Central Line Only';
                f.DrawingUpUnits = new SiUnitMeasure(-3, siUnit.gram);
                f.RateUnit = new InfusionRateUnit(-3, siUnit.gram, true, false);
                const i = new InfusionPeriodVM();
                i.AmpuleMl = 20;
                i.CalculatedDose = 20;
                i.CumulativeStartTime = new MinutesDuration();
                i.Duration = new MinutesDuration(20);
                i.DiluentVolume = 0;
                i.DrawingUpDose = 1000;
                i.FinalVolume = 20;
                i.InfusionRate = 60;
                i.IsNeat = true;
                i.OneMlHrDose = 1;
                f.InfusionPeriods = [i];
                return f;
            })(),
        }];
}
