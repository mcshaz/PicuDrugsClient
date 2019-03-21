import { searchComparison, binarySearch } from '../../src/anthropometry/binarySearch';
import { expect } from 'chai';

describe('binarySearch',()=>{
    let testArray:number[];
    const look=(indx:number) => testArray[indx];
    for(const testData of [{array: [2,5,9,10,24], name:'odd'},{array: [2,3,5,9,10,24], name:'even'}]){
        testArray = testData.array;
        it('finds exact index ' + testData.name,()=>{
            const searchNum = 10;
            const indx = testArray.indexOf(searchNum);
            const searchResult = binarySearch(look,searchNum,0,testArray.length-1)
            expect(searchResult.comparison).to.equal(searchComparison.inRange);
            expect(searchResult.lowerBound).to.equal(indx);
            expect(searchResult.upperBound).to.equal(indx);
        });
        it('finds indexes surrounding ' + testData.name,()=>{
            const searchNum = 8.3;
            const indx = testArray.indexOf(5);
            const searchResult = binarySearch(look,searchNum,0,testArray.length-1)
            expect(searchResult.comparison).to.equal(searchComparison.inRange,'comparison type [enum]');
            expect(searchResult.lowerBound).to.equal(indx,'lower bound');
            expect(searchResult.upperBound).to.equal(indx+1,'upper bound');
        });
    }
    it("doesn't find less than min",()=>{
        const min = Math.min(...testArray);
        const searchResult = binarySearch(look,min-1,0,testArray.length-1)
        expect(searchResult.comparison).to.equal(searchComparison.lessThanMin);
        expect(searchResult.lowerBound).to.equal(void 0);
        expect(searchResult.upperBound).to.equal(void 0);
    });
    it("doesn't find more than max",()=>{
        const max = Math.max(...testArray);
        const searchResult = binarySearch(look,max+0.1,0,testArray.length-1)
        expect(searchResult.comparison).to.equal(searchComparison.greaterThanMax);
        expect(searchResult.lowerBound).to.equal(void 0);
        expect(searchResult.upperBound).to.equal(void 0);
    });
});