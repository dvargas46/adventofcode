const { CircularBuffer } = require('mnemonist');
// const inputFile = './inputs/23-input.txt';
const inputFile = './inputs/23-example.txt';
const processFile = require('./file-processor');

const TIMES_TO_RUN = 1000;
const BUFFER_SIZE = 1000;

const input = processFile(inputFile, { lineSeparator: new RegExp('', 'g') }).map(Number);
const min = input.reduce((min, val) => val < min ? val : min, 99);
let maxInitial = input.reduce((max, cup) =>  cup > max ? cup : max, 0);
max1 = input.reduce((max, cup) =>  cup > max ? cup : max, 0);
max2 = input.reduce((max, cup) =>  cup > max && cup !== max1 ? cup : max, 0);
max3 = input.reduce((max, cup) =>  cup > max && cup !== max1 && cup !== max2 ? cup : max, 0);
max4 = input.reduce((max, cup) =>  cup > max && cup !== max1 && cup !== max2 && cup !== max3 ? cup : max, 0);
for (let i=maxInitial+1; i<=BUFFER_SIZE; i++) {
    input.push(i);
}
const cb = CircularBuffer.from(input, Array, BUFFER_SIZE);
// console.log(cb);

// PART II
const rotateBufferToValue = (buff, value) => {
    let next = buff.shift();
    while (next !== value) {
        buff.push(next);
        next = buff.shift();
    }
    return next;
}

for(let i=0; i<TIMES_TO_RUN; i++) {
    if (i%1000 === 0) {
        console.log(i);
    }
    const currentCup = cb.shift();
    cb.push(currentCup);
    const c1 = cb.shift();
    const c2 = cb.shift();
    const c3 = cb.shift();
    let counter = 0;
    let destination;
    while(true) {
        counter++;
        const d = currentCup - counter;
        if (d < min) {
            if (c1 === max1 || c2 === max1 || c3 === max1) {
                if (c1 === max2 || c2 === max2 || c3 === max2) {
                    if (c1 === max3 || c2 === max3 || c3 === max3) {
                        destination = rotateBufferToValue(cb, max4);
                        break;
                    } else {
                        destination = rotateBufferToValue(cb, max3);
                        break;
                    }
                } else {
                    destination = rotateBufferToValue(cb, max2);
                    break;
                }
            } else {
                destination = rotateBufferToValue(cb, max1);
                break;
            }
        }
        const isTargetDestinationNotAlreadyPicked = d !== c1 && d !== c2 && d !== c3;
        if (isTargetDestinationNotAlreadyPicked) {
            destination = rotateBufferToValue(cb, d);
            break;
        }
    }

    cb.push(destination);
    cb.push(c1);
    cb.push(c2);
    cb.push(c3);

    cb.start = (i+1)%BUFFER_SIZE;

    // const beginning = rotateBufferToValue(cb, currentCup);
    // cb.push(beginning);
}

rotateBufferToValue(cb, 1);
// console.log(cb);
const firstAfterOne = cb.shift();
const secondAfterOne = cb.shift();
const result = firstAfterOne * secondAfterOne;
console.log(firstAfterOne, secondAfterOne, result);


/*

for(let i=0; i<TEN_MILLION; i++) {

    const rel = i%len;
    console.log('---move',i+1,'---', input.slice(0, rel).join(' '), parseInt(input[rel]), input.slice((i+1)%(len+1), 100).join(' '));

    let c = input[rel];
    let c1, c2, c3;
    let pusher = 0;

    if (rel < len-3) {
        pusher = 3;
        [c1,c2,c3] = input.splice(rel+1, 3);
    } else if (rel < len-2) {
        pusher = 2;
        [c1,c2] = input.splice(rel+1, 2);
        [c3] = input.splice(0, 1);
    } else if (rel < len-1) {
        pusher = 1;
        [c1] = input.splice(rel+1, 1);
        [c2,c3] = input.splice(0, 2);
    } else {
        [c1,c2,c3] = input.splice(0, 3);
    }
    
    console.log(c1, c2, c3);

    let dIndex = -1;
    let counter = 1;
    while (dIndex < 0) {
        const d = c - counter;
        if (d !== c1 && d !== c2 && d !== c3) {
            dIndex = input.findIndex(cup => cup === d);
        }
        if (dIndex < 0) {
            if (d < min) {
                if (c1 === max1 || c2 === max1 || c3 === max1) {
                    if (c1 === max2 || c2 === max2 || c3 === max2) {
                        if (c1 === max3 || c2 === max3 || c3 === max3) {
                            dIndex = input.findIndex(cup => cup === max4);
                        } else {
                            dIndex = input.findIndex(cup => cup === max3);
                        }
                    } else {
                        dIndex = input.findIndex(cup => cup === max2);
                    }
                } else {
                    dIndex = input.findIndex(cup => cup === max1);
                }
            }
        }
        counter++;
    }

    console.log(input[dIndex]);

    input.splice(dIndex+1, 0, c1, c2, c3);

    if (dIndex < i%len) {
        if (pusher === 3) {
            input.push(input.shift(), input.shift(), input.shift());
        } else if (pusher === 2) {
            input.push(input.shift(), input.shift());
        } else if (pusher === 1) {
            input.push(input.shift());
        }
    }
};

*/