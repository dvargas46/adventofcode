// const inputfile = './inputs/20-input.txt';
const inputfile = './inputs/20-example.txt';
const processFile = require('./file-processor');


// PART I
String.prototype.reverse = function() {
    return this.split('').reverse().join('');
}

const input1 = processFile(inputfile, {
    lineSeparator: new RegExp('\\n\\n', 'g'),
    mapSeparator: new RegExp(':\\n', 'g')
});

input1.forEach((value, key) => {
    const rows = value.split(/\n/);
    const topEdge = rows[0];
    const bottomEdge = rows[rows.length-1].reverse();
    const leftEdge = rows.reduce((s,v) => s+v[0], '');
    const rightEdge = rows.reduce((s,v) => s+v[v.length-1], '');
    input1.set(key, [topEdge, rightEdge, bottomEdge, leftEdge]);
});

const rotate = (tile) => tile.unshift(tile.pop());
const flipHorizontal = (arr) => [arr[1], arr[3]] = [arr[3], arr[1]];
const flipVertical = (arr) => [arr[0], arr[2]] = [arr[2], arr[0]];

// For part1, we just need the corner pieces - all tiles with only 2 matching edges
// - Edges should be compared with every other tile's edges, forward and reverse
// - Collect the tiles that only have 2 matching edges

const corners = [];
input1.forEach((value1, key1) => {
    input1.forEach((value2, key2) => {
        if (key1 === key2) {
            let nMatches = 0;
            value1.forEach(v1 => {
                value2.forEach(v2 => {
                    if (v1 === v2
                        || v1.reverse() === v2
                        || v1 === v2.reverse())
                        // || v1.reverse() === v2.reverse()) 
                        nMatches++;
                });
            });
            console.log(value1, nMatches);
            if (nMatches === 2) corners.push(key1.replace(/[^\d]/g, ''));
        }
    });
});

console.log(corners);