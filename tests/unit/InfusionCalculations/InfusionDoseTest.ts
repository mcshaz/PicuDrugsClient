import { assert } from 'chai';
import { DrugDoseUnit, InfusionRateUnit, SiConcentration } from './../../src/infusionCalculations/';
import { siUnit } from '../../src/db';

describe('DrugDoseUnit',()=>{
    it('Converts to string', () => {
        let id = new DrugDoseUnit(0,siUnit.gram,true);
        assert.strictEqual(id.toShortString(),"g/kg");
        assert.strictEqual(id.toShortUserSafeString(),"grams/kg"); //note not g/kg - could argue point, but i believe safer prescription
        assert.strictEqual(id.toString(),"grams/kg");
        id = new DrugDoseUnit(-3, siUnit.gram, true);
        assert.strictEqual(id.toShortString(),"mg/kg");
        assert.strictEqual(id.toShortUserSafeString(),"mg/kg");
        assert.strictEqual(id.toString(),"milligrams/kg");
        id = new DrugDoseUnit(-6, siUnit.gram, false);
        assert.strictEqual(id.toShortString(),"µg");
        assert.strictEqual(id.toShortUserSafeString(),"micrograms");
        assert.strictEqual(id.toString(),"micrograms");
    });
    it('throws if illogical prefix',()=>{
        assert.throws(() => new DrugDoseUnit(-2, siUnit.gram, true),RangeError);
    });
});

describe('InfusionRateUnit', ()=>{
    it('converts to string',()=>{
        let id = new InfusionRateUnit(0, siUnit.gram, true,true);
        assert.strictEqual( id.toShortString(),"g/kg/min");
        assert.strictEqual( id.toShortUserSafeString(),"grams/kg/min"); //note not g/kg - could argue point, but i believe safer prescription
        assert.strictEqual( id.toString(),"grams/kg/minute");
        id = new InfusionRateUnit(-3, siUnit.gram, true,false);
        assert.strictEqual( id.toShortString(),"mg/kg/hr");
        assert.strictEqual( id.toShortUserSafeString(),"mg/kg/hr");
        assert.strictEqual( id.toString(),"milligrams/kg/hour");
        id = new InfusionRateUnit(-3, siUnit.gram, false, false);
        assert.strictEqual( id.toShortString(),"mg/hr");
        assert.strictEqual( id.toShortUserSafeString(),"mg/hr");
        assert.strictEqual( id.toString(),"milligrams/hour");
    });
    it('downconverts using "as" methods',()=>{
        let iru = new InfusionRateUnit(-3, siUnit.gram, true,false);
        let ru = iru.toDrugDoseUnit();
        assert.strictEqual( ru.toString(),"milligrams/kg");
        let u = iru.tosiUnitMeasure();
        assert.strictEqual( u.toString(),"milligrams");
    });
});

describe('SiConcentration', ()=>{
    it('converts to string',()=>{
        let s = new SiConcentration(-3, siUnit.gram);
        assert.strictEqual( s.toShortString(),"mg/mL");
        assert.strictEqual( s.toShortUserSafeString(),"mg/mL");
        assert.strictEqual( s.toString(),"milligrams/mL");
        s = new SiConcentration(-6, siUnit.gram);
        assert.strictEqual( s.toShortString(),"µg/mL");
        assert.strictEqual( s.toShortUserSafeString(),"micrograms/mL");
        assert.strictEqual( s.toString(),"micrograms/mL");
    });
});

