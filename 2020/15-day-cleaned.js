const inputfile = './inputs/15-input.txt';
// const inputfile = './inputs/15-example.txt';
const processFile = require('./file-processor');
let counter = 1;

// PART I
const input1 = processFile(inputfile, { lineSeparator: ',' });

const memory = input1.reduce((mem, val) => (mem.set(parseInt(val),[counter++]), mem), new Map());
let lastNumberSpoken = parseInt(input1[input1.length-1]);

const addToMemory = (num) => {
    if (!memory.has(num)) {
        memory.set(num, [counter++]);
    } else if (memory.get(num).length === 1) {
        memory.get(num).push(counter++);
    } else {
        memory.get(num).shift();
        memory.get(num).push(counter++);
    }
}

const runTurns = (MAX) => {
    while (counter <= MAX) {
        if (memory.get(lastNumberSpoken).length === 1) {
            lastNumberSpoken = 0;
            addToMemory(0);
        } else if (memory.get(lastNumberSpoken).length === 2) {
            turns = memory.get(lastNumberSpoken);
            diff = turns[1] - turns[0];
            lastNumberSpoken = diff;
            addToMemory(diff);
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