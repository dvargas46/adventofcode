const inputfile = './inputs/14-input.txt';
// const inputfile = './inputs/14-example.txt';
// const inputfile = './inputs/14-example2.txt';
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
// console.log(memorySpace);
console.log(result);




// PART II
const memorySpace2 = {};
const input2 = processFile(inputfile, {
        lineSeparator: new RegExp('\\n?mask = ', 'g'),
        groupSeparator: new RegExp('\\n', 'g'),
        // jsonSeparator: new RegExp(':', 'g')
    })
    .map(group => [group[0], group.slice(1).map(mem => mem.replace(/mem|[\[]|[\]]/g, '').split(/ = /g))]);
input2.shift();


const recGen = (n, arr, i) => {
    const allP = [];
    generatePossible(allP, n, arr, i);
    return allP;
}

const generatePossible = (a, n, arr, i) => {
    // console.log(i,n,arr,a);
    if (i === n) {
        a.push([...arr]);
        return;
    }

    arr[i] = 0;
    generatePossible(a, n, arr, i+1);

    arr[i] = 1;
    generatePossible(a, n, arr, i+1);
}
// console.log(new Array(7).fill(0));
// console.log(recGen(7, new Array(7).fill(0), 0).length)

input2.forEach(maskGroup => {
    const mask = maskGroup[0];
    const memGroup = maskGroup[1];

    memGroup.forEach(mem => {
        const bin = parseInt(mem[0]).toString(2).padStart(36, '0');
        // console.log(mask, bin, mask.length == bin.length);
        const masked = bin.split('').reduceRight((res, val, idx) => {
            const bit = mask[idx];
            // console.log(mask, bit, val, idx);
            return (bit==='X' ? 'X' : bit==='0' ? val : bit) + res;
        }, '');
        // console.log(masked);
        const ctFloat = masked.split('').reduce((ct, val) => val === 'X' ? ct+1 : ct, 0);
        const possibleCombos = recGen(ctFloat, new Array(ctFloat).fill(0), 0);


        possibleCombos.forEach(combo => {
            let newMask = masked;
            combo.forEach(b => {
                newMask = newMask.replace('X', b);
            });
            // console.log(newMask, parseInt(newMask, 2), mem[1]);
            memorySpace2[parseInt(newMask, 2)] = mem[1];
        });
    });
});

const result2 = Object.keys(memorySpace2).reduce((sum, key) => sum + parseInt(memorySpace2[key]), 0);

// console.log(input1[0]);
// console.log(memorySpace2);
console.log(result2);