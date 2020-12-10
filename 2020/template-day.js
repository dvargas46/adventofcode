const inputfile = './inputs/10-day.txt';
// const inputfile = './inputs/10-day-example.txt';
const processFile = require('./file-processor');


// PART I
const input1 = processFile(inputfile, {
    lineSeparator: new RegExp('\\n', 'g'),
    // groupSeparator: new RegExp('\\s', 'g'),
    // jsonSeparator: new RegExp(':', 'g')
});

const result1 = input1;
console.log(result1);



// PART II
// const result2 = input1;
// console.log(result2);