import { expect, assert } from 'chai';
import { NumericRange, roundingMethod } from '../../src/infusionCalculations/index';

describe('NumericRange',()=>{
    it('can be initialized without an initializer', () => {
        const nr = new NumericRange();
        expect(nr.lowerBound).to.equal(0);
        expect(nr.upperBound).to.equal(0);
    });
    it('can be initialized with 2 numbers', () => {
        const nr = new NumericRange( 2, 1);
        expect(nr.lowerBound).to.equal(1);
        expect(nr.upperBound).to.equal(2);
    });
    it('can be initialized with 1 number', () => {
        const nr = new NumericRange(1);
        expect(nr.lowerBound).to.equal(1);
        expect(nr.upperBound).to.equal(1);
    });
    it('toString encodes correctly',()=>{
        let ir = new NumericRange();
        expect("–").to.equal( ir.separator);
        ir.lowerBound = 3;
        ir.upperBound = 5;
        expect(ir.toString()).to.equal("3–5");
        ir.upperBound = 3;
        expect(ir.toString()).to.equal("3");
        ir = new NumericRange(3,5);
        expect(ir.toString()).to.equal("3–5");
        ir = new NumericRange(5,3);
        expect(ir.toString()).to.equal("3–5");

        ir = NumericRange.op_Multiply(ir,2)
        assert.strictEqual( ir.toString(),"6–10","multiplier");
        ir.upperBound = 6.0;
        assert.strictEqual( ir.toString(),"6","toString lb == ub");
        ir = new NumericRange(3012, 5859);
        ir.precision = 2;
        ir.rounding = roundingMethod.toPrecision; 
        assert.strictEqual( ir.toString(),"3000–5900", "precision rounding");
        ir = new NumericRange(5.003, 3.678);
        ir.precision = 2;
        ir.rounding = roundingMethod.toPrecision; 
        assert.strictEqual( ir.toString(),"3.7–5.0", "precision rounding decimals");
        ir.rounding = roundingMethod.fixedDecimalPlaces;
        assert.strictEqual( ir.toString(),"3.68–5.00", "fixed decimal rounding");
    });
    it('throws if upperBound < lowerBound', () => {
        var ir = new NumericRange;
        ir.lowerBound = 5;
        expect(()=>ir.upperBound = 3).to.throw(RangeError);
    });
});