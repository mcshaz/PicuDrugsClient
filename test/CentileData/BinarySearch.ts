import { searchComparison, binarySearch } from './../../src/anthropometry/binarySearch';
import { expect } from 'chai';

describe('binarySearch',()=>{
    const testArray = [2,5,9,10,24];
    const look=(indx:number) => testArray[indx];
    it('finds exact index',()=>{
        const searchNum = 10;
        const indx = testArray.indexOf(searchNum);
        let searchResult = binarySearch(look,searchNum,0,testArray.length-1)
        expect(searchResult.comparison).to.equal(searchComparison.inRange);
        expect(searchResult.lowerBound).to.equal(indx);
        expect(searchResult.upperBound).to.equal(indx);
    });
    it('finds indexes surrounding',()=>{
        const searchNum = 8.3;
        const indx = testArray.indexOf(5);
        let searchResult = binarySearch(look,searchNum,0,testArray.length-1)
        expect(searchResult.comparison).to.equal(searchComparison.inRange);
        expect(searchResult.lowerBound).to.equal(indx);
        expect(searchResult.upperBound).to.equal(indx+1);
    });
    it("doesn't find less than min",()=>{
        const min = Math.min(...testArray);
        let searchResult = binarySearch(look,min-1,0,testArray.length-1)
        expect(searchResult.comparison).to.equal(searchComparison.lessThanMin);
        expect(searchResult.lowerBound).to.equal(void 0);
        expect(searchResult.upperBound).to.equal(void 0);
    });
    it("doesn't find more than max",()=>{
        const max = Math.max(...testArray);
        let searchResult = binarySearch(look,max+0.1,0,testArray.length-1)
        expect(searchResult.comparison).to.equal(searchComparison.greaterThanMax);
        expect(searchResult.lowerBound).to.equal(void 0);
        expect(searchResult.upperBound).to.equal(void 0);
    });
})