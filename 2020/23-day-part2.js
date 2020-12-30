const inputFile = './inputs/23-input.txt';
// const inputFile = './inputs/23-example.txt';
const processFile = require('./file-processor');

const TIMES_TO_RUN = 10000000;
const LOG_TIMES = TIMES_TO_RUN/10;
const BUFFER_SIZE = 1000000;

const input = processFile(inputFile, { lineSeparator: new RegExp('', 'g') }).map(Number);

// Create the extended cup arrangement
const initialMax = [...input].sort().reverse()[0];
for (let i=initialMax+1; i<=BUFFER_SIZE; i++) {
    input.push(i);
}
const MIN_CUP_LABEL = [...input].sort((a,b) => a-b)[0];
const MAX_CUP_LABEL = [...input].sort((a,b) => a-b).reverse()[0];

// Create a circular linked list inside an array
const cupNodes = Array.from({length: BUFFER_SIZE+1});
for (let i = 1; i < input.length; i++) {
    let next = input[i];
    let previous = input[i-1];
    cupNodes[previous] = next;
    cupNodes[next] = cupNodes[previous];
}
cupNodes[cupNodes.length-1] = input[0];

// Run the game
let currentCup = input[0];
for(let i=1; i<=TIMES_TO_RUN; i++) {
    // if (i%LOG_TIMES === 0) console.log(`On step: ${i}`);

    const c1 = cupNodes[currentCup];
    const c2 = cupNodes[c1];
    const c3 = cupNodes[c2];
    const pickedCups = [c1, c2, c3];
    cupNodes[currentCup] = cupNodes[c3];

    let destinationCupLabel = currentCup - 1;
    while(true) {
        if (pickedCups.includes(destinationCupLabel)) {
            destinationCupLabel--;
        } else if (destinationCupLabel < MIN_CUP_LABEL) {
            destinationCupLabel = MAX_CUP_LABEL;
        } else {
            break;
        }
    }

    cupNodes[c3] = cupNodes[destinationCupLabel];
    cupNodes[destinationCupLabel] = c1;
    currentCup = cupNodes[currentCup];
}

const firstAfterOne = cupNodes[1];
const secondAfterOne = cupNodes[firstAfterOne];
const result = firstAfterOne * secondAfterOne;
console.log(firstAfterOne, secondAfterOne, result);