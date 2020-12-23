const inputFile = './inputs/23-input.txt';
// const inputFile = './inputs/23-example.txt';
const processFile = require('./file-processor');

// const TEN_MILLION = 10000000;
// const ONE_MILLION = 1000000;
const TEN_MILLION = 100;
const ONE_MILLION = 50;

// PART II
const input = processFile(inputFile, { lineSeparator: new RegExp('', 'g') }).map(Number);

let maxInitial = input.reduce((max, cup) =>  cup > max ? cup : max, 0);
for (let i=maxInitial; i<ONE_MILLION; i++) {
    input.push(i+1);
}

const len = input.length;
// let curLocation = 0;
max1 = input.reduce((max, cup) =>  cup > max ? cup : max, 0);
max2 = input.reduce((max, cup) =>  cup > max && cup !== max1 ? cup : max, 0);
max3 = input.reduce((max, cup) =>  cup > max && cup !== max1 && cup !== max2 ? cup : max, 0);
max4 = input.reduce((max, cup) =>  cup > max && cup !== max1 && cup !== max2 && cup !== max3 ? cup : max, 0);
const min = input.reduce((min, val) => val < min ? val : min, 99);

const mem = [];
const other = Array.from({length: len}, (_, i) => i);

for(let i=0; i<TEN_MILLION; i++) {
    console.log('---move',i+1,'---');
    console.log(input.join(' '));
    // console.log(other.join(' '));
    if (i%10000 === 0) {
        console.log(i, new Date());
    }
    // const p = input.join('');
    // mem.forEach((val, i1) => {
    //     if (val === p) {
    //         console.log('seen before on', i1, i, val);
    //     }
    // });
    // mem.push(p);

    const rel = i%len;
    let c = input[rel];
    let c1, c2, c3;
    let o1, o2, o3;
    let pusher = 0;
    if (rel < len-3) {
        pusher = 3;
        [c1,c2,c3] = input.splice(rel+1, 3);
        [o1,o2,o3] = other.splice(rel+1, 3);
    } else if (rel < len-2) {
        pusher = 2;
        [c1,c2] = input.splice(rel+1, 2);
        [c3] = input.splice(0, 1);
        [o1,o2] = other.splice(rel+1, 2);
        [o3] = other.splice(0, 1);
    } else if (rel < len-1) {
        pusher = 1;
        [c1] = input.splice(rel+1, 1);
        [c2,c3] = input.splice(0, 2);
        [o1] = other.splice(rel+1, 1);
        [o2,o3] = other.splice(0, 2);
    } else {
        [c1,c2,c3] = input.splice(0, 3);
        [o1,o2,o3] = other.splice(0, 3);
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
    other.splice(dIndex+1, 0, o1, o2, o3);

    if (dIndex < i%len) {
        if (pusher === 3) {
            input.push(input.shift(), input.shift(), input.shift());
            other.push(other.shift(), other.shift(), other.shift());
        } else if (pusher === 2) {
            input.push(input.shift(), input.shift());
            other.push(other.shift(), other.shift());
        } else if (pusher === 1) {
            input.push(input.shift());
            other.push(other.shift());
        }
    }
};

// any duplicates?
// console.log(new Set(mem).size);
// console.log(mem.length);
// if (new Set(mem).size !== mem.length) {
//     console.log('Duplicates exist in the memory');
//     mem.forEach((val1, i1) => {
//         mem.forEach((val2, i2) => {
//             if (i1 !== i2) {
//                 if (val1 === val2) {
//                     console.log(i1, i2, val1);
//                 }
//             }
//         });
//     });
// }
console.log(input.join(' '), 'final state');
console.log(other.join(' '), 'final state');
const oneIndex = input.findIndex(cup => cup === 1);
// for (let i=0; i<=oneIndex; i++) {
//     input.push(input.shift());
// }
// console.log('result', input.join(''));
const result = [input[(oneIndex+1)%len], input[(oneIndex+2)%len]];
// console.log('result', result, result[0]*result[1]);