const inputFile = '../inputs/10-day.txt';
// const inputFile = '../inputs/10-day-example.txt';
const processFile = require('../common/file-processor');
const combinations = require('combinations-js');


// PART I
const input1 = processFile(inputFile, {
    lineSeparator: new RegExp('\\n'),
});

const result1 = input1
    .sort((a,b) => a-b)
    .map((n, i) => i===0 ? 1 : input1[i]-input1[i-1])
    .concat([3])
    .reduce((j, n) => {
        j[n] = j[n] === undefined ? 1 : j[n]+1;
        return j;
    }, {});
console.log(result1);
console.log(result1['1']*result1['3']);




// PART II
const diffs = input1
    .sort((a,b) => a-b)
    .map((n, i) => i===0 ? 1 : input1[i]-input1[i-1])
    // .concat([3]);
console.log(input1.sort((a,b) => a-b));
console.log(diffs.join('').split(/3+/).reduce((a,c) => {
    if (c.length > 1) console.log(Array.from({length: 3}, (_, i) => i).reduce((x,y) => x + combinations(c.length-1,y))+1);
    return c.length > 1 ? a * (Array.from({length: 3}, (_, i) => i).reduce((x,y) => x + combinations(c.length-1,y))+1) : a
}, 1));

diffs
    .join('')
    .split(/3+/)
    .reduce((a,c) => {
    c.length > 1 ? a * Array.from({length: 3}, (_, i) => i).reduce((x,y) => x + combinations(c.length-1,y)) : a
    }, 1);

// const result2 = 

// const result2 = input2;
// console.log(result2);