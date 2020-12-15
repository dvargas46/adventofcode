const inputfile = './inputs/15-input.txt';
// const inputfile = './inputs/15-example.txt';
const processFile = require('./file-processor');
let counter = 1;

// PART I
const input1 = processFile(inputfile, {
    lineSeparator: ',',
});

const memory = input1.reduce((mem, val) => (mem[val]=[counter++], mem), {});
let lastNumberSpoken = input1[input1.length-1];

const addToMemory = (num) => {
    if (!memory[num]) {
        memory[num] = [counter++];
    } else if (memory[num].length === 1) {
        memory[num].push(counter++);
    } else {
        memory[num].shift();
        memory[num].push(counter++);
    }
}

const runTurns = (MAX) => {
    while (counter <= MAX) {
        if(counter % 1000000 === 0 ) console.log(counter);
        if (memory[lastNumberSpoken].length === 1) {
            lastNumberSpoken = 0;
            addToMemory(0);
        } else if (memory[lastNumberSpoken].length === 2) {
            turns = memory[lastNumberSpoken];
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