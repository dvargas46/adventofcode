// const inputFile = './inputs/23-input.txt';
const inputFile = './inputs/23-example.txt';
const processFile = require('./file-processor');


// PART I
const input = processFile(inputFile, {
    lineSeparator: new RegExp('', 'g'),
    // groupSeparator: new RegExp('\\s', 'g'),
    // jsonSeparator: new RegExp(':', 'g')
}).map(Number);

const len = input.length;

console.log(input.join(' '));
Array.from({length: 10}, (_, i) => {
    let c1 = input[(i+1)%len];
    let c2 = input[(i+2)%len];
    let c3 = input[(i+3)%len];

    let dest;
    let counter = 1;
    while (!dest || dest < 0) {
        const d = input[i%len] - counter;
        // const tDest = input[input.findIndex(cup => cup === d)];
        
        if (d !== c1 && d !== c2 && d !== c3) {
            dest = input.findIndex(cup => cup === d);
        }
        if (!dest || dest < 0) {
            const min = input.reduce((min, val) => val < min ? val : min, 99);
            if (d < min) {
                const max = input.reduce((max, cup) =>  cup !== c1 && cup !== c2 && cup !== c3 && cup > max ? cup : max, 0);
                dest = input.findIndex(cup => cup === max);
            }
        }
        counter++;
    }
    
    input.splice(dest%len+1, 0, c3+100);
    input.splice(dest%len+1, 0, c2+100);
    input.splice(dest%len+1, 0, c1+100);

    const c1i = input.findIndex(cup => cup === c1);
    input.splice(c1i, 1);
    const c2i = input.findIndex(cup => cup === c2);
    input.splice(c2i, 1);
    const c3i = input.findIndex(cup => cup === c3);
    input.splice(c3i, 1);

    input[input.findIndex(cup => cup === c1+100)] = c1;
    input[input.findIndex(cup => cup === c2+100)] = c2;
    input[input.findIndex(cup => cup === c3+100)] = c3;

    console.log(input.join(' '));
});

const result = 0;
console.log(result);