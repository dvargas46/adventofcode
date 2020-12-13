// const inputfile = './inputs/13-input.txt';
const inputfile = './inputs/13-example.txt';
const processFile = require('./file-processor');


// PART I
const input1 = processFile(inputfile, {
    lineSeparator: new RegExp('\\n', 'g'),
    // groupSeparator: new RegExp('\\s', 'g'),
    // jsonSeparator: new RegExp(':', 'g')
});


const temp = input1;
const result1 = input1
    .map(data => {

    })
    .reduce(data => {

    });

console.log(temp);
console.log(result1);



// PART II
// const result2 = input1;
// console.log(result2);