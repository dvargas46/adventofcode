// const inputfile = './inputs/20-input.txt';
const inputfile = './inputs/20-example.txt';
const processFile = require('./file-processor');


// PART I
const input1 = processFile(inputfile, {
    lineSeparator: new RegExp('\\n\\n', 'g'),
    mapSeparator: new RegExp(':\\n', 'g')
});

input1.forEach((value, key) => {
    const binaryArray = [];
    value.split(/\n/).forEach((rowV, r) => {
        binaryArray.push([]);
        rowV.split('').forEach((colV) => {
            binaryArray[r].push(colV === '#');
        });
    });
    input1.set(key, binaryArray);
});

// Need a function to rotate all directions
// Need a function to flip vertically/horizontally
// It's like putting a real puzzle together (except flipping is now an option)
// Maybe, find the corners first? -- A corner is one that only has 2 matching sides (outer edges don't line up with any other)
// 

const result1 = input1;
console.log(result1);