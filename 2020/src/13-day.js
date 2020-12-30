const inputFile = '../inputs/13-input.txt';
// const inputFile = '../inputs/13-example.txt';
const processFile = require('../common/file-processor');


// PART I
const input1 = processFile(inputFile, {
    lineSeparator: new RegExp('\\n', 'g'),
    groupSeparator: new RegExp(',', 'g'),
    // jsonSeparator: new RegExp(':', 'g')
});


const ts = parseInt(input1.shift());
const ids = input1
    .flat()
    .filter(id => id !== 'x')
    .map(id => parseInt(id));
const earliest1 = ids
    .map(id => [id, id * Math.ceil(ts / id)])
    .reduce((min, data) => {
        return data[1] < min[1] ? data : min;
    }, [0, 999999999]);
const result1 = earliest1[0] * (earliest1[1] - ts);

console.log(ts);
console.log(ids);
console.log(result1);



// PART II
// AFTERTHOUGHTS: This day was the turning point for me. In order to solve part2 (since I didn't know anything about CRT),
// I researched on a way to compute the LCM of numbers with an offset, which led me to this Math StackExchange post:
//  https://math.stackexchange.com/questions/2218763/how-to-find-lcm-of-two-numbers-when-one-starts-with-an-offset#comment8142700_3864593
// So, I used that Python code in TIO.run (slightly modified) to get the answer.
// The below code will not produce the correct answer at all (mainly just testing stuff initially).
// See the cleaned up version to see how I converted that Py code into JS to get the right answer.
console.log(input1);
const input2 = input1
    .flat()
    .map((id, ix) => [ix, parseInt(id)])
    .filter(dt => !isNaN(dt[1]));
const max = input2.reduce((m, i) => i[1] > m[1] ? i : m, [0,0]);

// const first = input2.shift()[1];
console.log(input2);
console.log(max);
let t = max[1]-max[0];
let inc = max[1];
console.log(t, inc, t+inc, t+inc*2)

// let a=[];
// const lcms = input2.map((val) => [...val, first, lcm(first, val[1])]);
// console.log(lcms);

// const last = input2[input2.length-1];
// console.log(last);


// counter = 133;
// while(counter < 10000000) {
//     counter += 133;
//     if (input2.every(data => (counter - (last[0] - data[0])) % data[1] === 0)) {
//         console.log(counter);
//         break;
//     } else {
//         // console.log()
//     }
// }
// console.log('done');
// counter = 100000000000250;
// while(counter < 1000000000000000) {
//     counter += 779;
//     if (input2.every(data => (counter - (last[0] - data[0])) % data[1] === 0)) {
//         console.log(counter);
//         break;
//     }
// }
// const result2 = input1;
// console.log(result2);