const inputfile = './inputs/14-input.txt';
// const inputfile = './inputs/14-example.txt';
const processFile = require('./file-processor');


// PART I
const memorySpace = {};
const input1 = processFile(inputfile, {
        lineSeparator: new RegExp('\\n?mask = ', 'g'),
        groupSeparator: new RegExp('\\n', 'g'),
        // jsonSeparator: new RegExp(':', 'g')
    })
    .map(group => [group[0], group.slice(1).map(mem => mem.replace(/mem|[\[]|[\]]/g, '').split(/ = /g))]);
input1.shift();
input1.forEach(maskGroup => {
    const mask = maskGroup[0];
    const memGroup = maskGroup[1];

    memGroup.forEach(mem => {
        const bin = parseInt(mem[1]).toString(2).padStart(36, '0');
        // console.log(mask, bin, mask.length == bin.length);
        const masked = bin.split('').reduceRight((res, val, idx) => {
            const bit = mask[idx];
            // console.log(mask, bit, val, idx);
            return (bit==='X' ? val : bit) + res;
        }, '');
        // console.log(masked);
        memorySpace[mem[0]] = parseInt(masked, 2);
    });
});

const result = Object.keys(memorySpace).reduce((sum, key) => sum + memorySpace[key], 0);

// console.log(input1[0]);
console.log(memorySpace);
console.log(result);




// PART II
// const result2 = input1;
// console.log(result2);