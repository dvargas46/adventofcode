// const inputFile = './inputs/23-input.txt';
const inputFile = './inputs/23-example.txt';
const processFile = require('./file-processor');


// PART II
const input = processFile(inputFile, {
    lineSeparator: new RegExp('\\n', 'g'),
    // groupSeparator: new RegExp('\\s', 'g'),
    // jsonSeparator: new RegExp(':', 'g')
});



const result = 0;
console.log(result);