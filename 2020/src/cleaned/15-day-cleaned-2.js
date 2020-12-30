const inputFile = '../../inputs/15-input.txt';
// const inputFile = '../../inputs/15-example.txt';
const processFile = require('../../common/file-processor');
let counter = 1;

// PART I
const input1 = processFile(inputFile, {
    lineSeparator: ',',
});

let memory1 = input1.reduce((mem, val) => (mem.set(parseInt(val), counter++), mem), new Map());
let memory2 = new Map();
let lastNumberSpoken = parseInt(input1[input1.length-1]);

const addToMemory = (num) => {
    if (!memory1.has(num)) {
        memory1.set(num, counter++);
    } else if (!memory2.has(num)) {
        memory2.set(num, counter++);
    } else {
        memory1.set(num, memory2.get(num));
        memory2.set(num, counter++);
    }
}

const runTurns = (MAX) => {
    while (counter <= MAX) {
        if (!memory2.has(lastNumberSpoken)) {
            lastNumberSpoken = 0;
            addToMemory(0);
        } else {
            lastNumberSpoken = memory2.get(lastNumberSpoken) - memory1.get(lastNumberSpoken);
            addToMemory(lastNumberSpoken);
        }
    }
}

// PART I
// runTurns(2020);

// PART II
runTurns(30000000);

// DON'T PRINT THE MEMORY FOR PART II --- YOU WILL REGRET IT
// console.log(memory);
console.log(counter-1, lastNumberSpoken);