const inputFile = '../inputs/XX-input.txt';
// const inputFile = '../inputs/XX-example.txt';
const processFile = require('../common/file-processor');


// PART I
const input1 = processFile(inputFile, {
    lineSeparator: new RegExp('\\n', 'g'),
    // groupSeparator: new RegExp('\\s', 'g'),
    // jsonSeparator: new RegExp(':', 'g')
});

const result1 = input1;
console.log(result1);



// PART II
// const result2 = input1;
// console.log(result2);