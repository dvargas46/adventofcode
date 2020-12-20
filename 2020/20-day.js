// const inputfile = './inputs/20-input.txt';
const inputfile = './inputs/20-example.txt';
const processFile = require('./file-processor');


// PART I
const input1 = processFile(inputfile, {
    lineSeparator: new RegExp('\\n\\n', 'g'),
    mapSeparator: new RegExp(':\\n', 'g')
});

input1.forEach((value, key) => {
    const rows = value.split(/\n/);
    const topEdge = rows[0];
    const bottomEdge = rows[rows.length-1];
    const leftEdge = rows.reduce((s,v) => s+v[0]);
    const rightEdge = rows.reduce((s,v) => s+v[v.length]);
    input1.set(key, [topEdge, rightEdge, bottomEdge, leftEdge
]);
});

const rotate = (tile) => tile.unshift(tile.pop());
const flipHoriz = (arr) => [arr[1], arr[3]] = [arr[3], arr[1]];
const flipVert = (arr) => [arr[0], arr[2]] = [arr[2], arr[0]];

// It's like putting a real puzzle together (except flipping is now an option)
// Maybe, find the corners first? -- A corner is one that only has 2 matching sides (outer edges don't line up with any other)
// 

const result1 = input1;
console.log(result1);
