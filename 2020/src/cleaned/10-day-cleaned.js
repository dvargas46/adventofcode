const inputFile = '../../inputs/10-day.txt';
const processFile = require('../../common/file-processor');
const combinations = require('combinations-js');


const input1 = processFile(inputFile, {
    lineSeparator: new RegExp('\\n'),
});

// PART I
const result1 = input1
    .sort((a,b) => a-b)
    .map((n, i) => i===0 ? 1 : input1[i]-input1[i-1])
    .concat([3])
    .reduce((j, n) => {
        j[n] = j[n] === undefined ? 1 : j[n]+1;
        return j;
    }, {});
console.log(result1['1']*result1['3']);


// PART II
const combos = Array.from({length: 3}, (_, i) => i);
const result2 = input1
    .sort((a,b) => a-b)                                  // Sorted ascending
    .map((_, i) => i===0 ? 1 : input1[i]-input1[i-1])    // Get Diffs
    .join('')                                            // Bring it back to one whole string of diffs
    .split(/3+/)                                         // Split on one or more occurrences of "3" since 3 never changes in the cominations
    .filter(group_of_ones => group_of_ones.length !== 1) // Remove single 1 groups
    .reduce((acc, group_of_ones) =>
        acc * (combos.reduce((x, y) => x + combinations(group_of_ones.length-1, y))+1), 1); 

    // NOTES on the final reduce:
    //  We are calculating the summation of nCk's such that 
    //  >  n = number of 1s in the group minus 1
    //  >  k = 0 or 1 or 2, i.e. choosing 0 (don't remove anything) up to choosing 2 (remove max)
    //  >  Σk=0->2 (nCk + 1)
    // The plus one is necessary here too

console.log(result2);