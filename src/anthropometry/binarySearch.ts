
export enum searchComparison { lessThanMin, inRange , greaterThanMax }

export interface searchResult { comparison:searchComparison, lowerBound?:number, upperBound?:number }

export function binarySearch(lookup:(index:number) => number, 
        target: number, minIndex:number,maxIndex:number):searchResult{
    const minVal = lookup(minIndex);
    if (minVal < target){
        return { comparison: searchComparison.lessThanMin };
    }
    if (minVal === target){
        return { comparison: searchComparison.inRange, lowerBound:minVal, upperBound:minVal };
    }
    const maxVal = lookup(maxIndex);
    if (maxVal > target){
        return { comparison: searchComparison.greaterThanMax };
    }
    if (maxVal === target){
        return { comparison: searchComparison.inRange, lowerBound:maxVal, upperBound:maxVal };
    } 
    let currentIndex:number;
    while (maxIndex - minIndex > 1) {
        currentIndex = Math.floor((minIndex + maxIndex) / 2);
        const currentVal = lookup(currentIndex);
    
        if (currentVal < target) {
            minIndex = currentIndex;
        }
        else if (currentVal > target) {
            maxIndex = currentIndex;
        }
        else {
            return { comparison: searchComparison.inRange, lowerBound:currentIndex, upperBound:currentIndex };
        }
    }
    
    return { comparison: searchComparison.inRange, lowerBound:currentIndex, upperBound:currentIndex };
}