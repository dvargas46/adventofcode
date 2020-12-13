const inputfile = './inputs/13-input.txt';
// const inputfile = './inputs/13-example.txt';
const processFile = require('./file-processor');


// PART I
const input1 = processFile(inputfile, {
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
console.log(input1);
const input2 = input1
    .flat()
    .map((id, ix) => [ix, parseInt(id)])
    .filter(dt => !isNaN(dt[1]));

console.log(input2);
const last = input2[input2.length-1];
console.log(last);

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
counter = 100000000000250;
while(counter < 1000000000000000) {
    counter += 779;
    if (input2.every(data => (counter - (last[0] - data[0])) % data[1] === 0)) {
        console.log(counter);
        break;
    }
}
// const result2 = input1;
// console.log(result2);