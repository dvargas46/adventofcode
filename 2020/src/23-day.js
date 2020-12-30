const inputFile = '../inputs/23-input.txt';
// const inputFile = '../inputs/23-example.txt';
const processFile = require('../common/file-processor');


// PART I
const input = processFile(inputFile, {
    lineSeparator: new RegExp('', 'g'),
    // groupSeparator: new RegExp('\\s', 'g'),
    // jsonSeparator: new RegExp(':', 'g')
}).map(Number);

const len = input.length;
const TIMES = 1000000;
// console.log(input.join(' '), 'move', 1);
Array.from({length: TIMES}, (_, i) => {
    let c1 = input[(i+1)%len];
    let c2 = input[(i+2)%len];
    let c3 = input[(i+3)%len];

    let dest;
    let counter = 1;
    while ((!dest && dest !== 0) || dest < 0) {
        const d = input[i%len] - counter;
        // const tDest = input[input.findIndex(cup => cup === d)];
        
        if (d !== c1 && d !== c2 && d !== c3) {
            dest = input.findIndex(cup => cup === d);
        }
        if ((!dest && dest !== 0) || dest < 0) {
            const min = input.reduce((min, val) => val < min ? val : min, 99);
            if (d < min) {
                const max = input.reduce((max, cup) =>  cup !== c1 && cup !== c2 && cup !== c3 && cup > max ? cup : max, 0);
                dest = input.findIndex(cup => cup === max);
            }
        }
        counter++;
    }
    
    input.splice(dest+1, 0, 1.3);
    input.splice(dest+1, 0, 1.2);
    input.splice(dest+1, 0, 1.1);

    if (dest < i%len) {
        input.push(input.shift());
        input.push(input.shift());
        input.push(input.shift());
    }

    const c1i = input.findIndex(cup => cup === c1);
    input.splice(c1i, 1);
    const c2i = input.findIndex(cup => cup === c2);
    input.splice(c2i, 1);
    const c3i = input.findIndex(cup => cup === c3);
    input.splice(c3i, 1);

    input[input.findIndex(cup => cup === 1.1)] = c1;
    input[input.findIndex(cup => cup === 1.2)] = c2;
    input[input.findIndex(cup => cup === 1.3)] = c3;

    // console.log(input.join(' '), 'move',i+2);
});

const oneIndex = input.findIndex(cup => cup === 1);
for (let i=0; i<=oneIndex; i++) {
    input.push(input.shift());
}
console.log('result', input.join(''));