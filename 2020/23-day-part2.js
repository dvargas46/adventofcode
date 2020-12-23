// const inputFile = './inputs/23-input.txt';
const inputFile = './inputs/23-example.txt';
const processFile = require('./file-processor');

// const TEN_MILLION = 10000000;
// const ONE_MILLION = 1000000;
const TEN_MILLION = 10000;
const ONE_MILLION = 100000;

// PART II
const input = processFile(inputFile, { lineSeparator: new RegExp('', 'g') }).map(Number);

let maxInitial = input.reduce((max, cup) =>  cup > max ? cup : max, 0);
for (let i=maxInitial; i<ONE_MILLION; i++) {
    input.push(i+1);
}

// console.log(input);
// console.log(input[input.length-1]);
// console.log(input.length);
// process.exit(0);
const len = input.length;
let curLocation = 0;
max1 = input.reduce((max, cup) =>  cup > max ? cup : max, 0);
max2 = input.reduce((max, cup) =>  cup > max && cup !== max1 ? cup : max, 0);
max3 = input.reduce((max, cup) =>  cup > max && cup !== max1 && cup !== max2 ? cup : max, 0);
max4 = input.reduce((max, cup) =>  cup > max && cup !== max1 && cup !== max2 && cup !== max3 ? cup : max, 0);
const min = input.reduce((min, val) => val < min ? val : min, 99);
for(let i=0; i<TEN_MILLION; i++) {
    // console.log('move',i+1);
    // console.log(input.join(' '));
    // if (i%10000 === 0) {
    //     console.log(i, new Date());
    // }
    const rel = i%len;
    let c1i = (i+1)%len;
    let c2i = (i+2)%len;
    let c3i = (i+3)%len;

    let c1 = input[c1i];
    let c2 = input[c2i];
    let c3 = input[c3i];
    // console.log(c1, c2, c3);

    let dest;
    let counter = 1;
    while ((!dest && dest !== 0) || dest < 0) {
        const d = input[rel] - counter;
        if (d !== c1 && d !== c2 && d !== c3) {
            dest = input.findIndex(cup => cup === d);
        }
        if ((!dest && dest !== 0) || dest < 0) {
            if (d < min) {
                if (c1 === max1 || c2 === max1 || c3 === max1) {
                    // const maxi = input.reduce((max, cup) =>  cup !== c1 && cup !== c2 && cup !== c3 && cup > max ? cup : max, 0);
                    if (c1 === max2 || c2 === max2 || c3 === max2) {
                        if (c1 === max3 || c2 === max3 || c3 === max3) {
                            dest = input.findIndex(cup => cup === max4);
                        } else {
                            dest = input.findIndex(cup => cup === max3);
                        }
                    } else {
                        dest = input.findIndex(cup => cup === max2);
                    }
                } else {
                    dest = input.findIndex(cup => cup === max1);
                }
            }
        }
        counter++;
    }
    // console.log(input[dest]);
    input.splice(dest+1, 0, 1.1, 1.2, 1.3);

    if (dest < i%len) {
        input.push(input.shift(), input.shift(), input.shift());
    }

    c1i = input.findIndex(cup => cup === c1);
    if (c1i < len+1) {
        input.splice(c1i, 3);
    } else if (c1i < len+2) {
        input.splice(c1i, 2);
        input.splice(0, 1);
    } else if (c1i < len+3) {
        input.splice(c1i, 1);
        input.splice(0, 2);
    } else {
        input.splice(0, 3);
    }

    // c1i = input.findIndex(cup => cup === c1);
    // input.splice(c1i, 1);
    // c2i = input.findIndex(cup => cup === c2);
    // input.splice(c2i, 1);
    // c3i = input.findIndex(cup => cup === c3);
    // input.splice(c3i, 1);

    const nc1 = input.findIndex(cup => cup === 1.1)
    input[nc1] = c1;
    input[(nc1+1)%len] = c2;
    input[(nc1+2)%len] = c3;

    // console.log(input.join(' '), 'move',i+2);
};
// console.log(input.join(' '), 'final state');
const oneIndex = input.findIndex(cup => cup === 1);
for (let i=0; i<=oneIndex; i++) {
    input.push(input.shift());
}
// console.log('result', input.join(''));
const result = [input[(oneIndex+1)%len], input[(oneIndex+2)%len]];
// console.log('result', result, result[0]*result[1]);