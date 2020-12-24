const inputfile = './inputs/24-input.txt';
// const inputfile = './inputs/24-example.txt';
const processFile = require('./file-processor');


// PART I
const input1 = processFile(inputfile, {lineSeparator: new RegExp('\\n', 'g')}).map(h => h.match(/se|ne|sw|nw|w|e/g));

const directionsToLocation = (location, direction) => {
    switch (direction) {
        case 'sw':
            location[0]++;
            location[1]--;
            break;
        case 'se':
            location[0]++;
            location[1]++;
            break;
        case 'nw':
            location[0]--;
            location[1]--;
            break;
        case 'ne':
            location[0]--;
            location[1]++;
            break;
        case 'w':
            location[1]--;
            location[1]--;
            break;
        case 'e':
            location[1]++;
            location[1]++;
            break;
        default:
            throw 'Received an improper direction: ' + direction;            
    }
    return location;
}


const locations = input1.map(direction => direction.reduce(directionsToLocation, [0,0]));
let whiteHexagons = [];
let blackHexagons = [];
locations.forEach(location => {
    if (!whiteHexagons.some(other => JSON.stringify(location) === JSON.stringify(other))) {
        const frequency = locations.reduce((count, other) => JSON.stringify(location) === JSON.stringify(other) ? count+1 : count, 0);
        if (frequency % 2 === 0) {
            whiteHexagons.push(location);
        } else {
            blackHexagons.push(location);
        }
    }
});
console.log('PART I');
// console.log(locations, whiteHexagons, blackHexagons);
console.log('Number of white tiles', whiteHexagons.length);
console.log('Number of black tiles', blackHexagons.length);
console.log();



// PART II
const largestBX = blackHexagons.reduce((LX, b) => Math.abs(b[1]) > LX ? Math.abs(b[1]) : LX, 0);
const largestBY = blackHexagons.reduce((LY, b) => Math.abs(b[0]) > LY ? Math.abs(b[0]) : LY, 0);

let grid = Array.from({length: largestBY*2+1}, () => {
    return Array.from({length: largestBX*2+1}, () => false);
});
for (let i=0; i<largestBX*2+1; i++) {
    for (let j=0; j<largestBY*2+1; j++) {
        const loc = [j-largestBY, i-largestBX];
        const isBlack = blackHexagons.some((b) => JSON.stringify(loc) === JSON.stringify(b));
        if (isBlack) {
            grid[j][i] = true;
        }
    }
}

const printGrid = (matrix) => console.log(matrix.map(v => v.map(v2 => v2 ? 1 : 0).join(',')).join('\n'), '\n');
const countOfBlackTiles = () => grid.reduce((sum, row) => sum + row.reduce((subtotal, black) => black ? subtotal+1 : subtotal, 0), 0);

// console.log('day', 0, countOfBlackTiles());
const simulateDay = () => {
    let updatedGrid = [];
    let updatedGridRow = [];
    padXYSpace(grid);
    const lenY = grid.length;
    for(let y=0; y<lenY; y++) {
        const lenX = grid[y].length;
        for(let x=0; x<lenX; x++) {
            const se = y-1>=0 && x+1<lenX           ? grid[y-1][x+1] : false;
            const sw = y-1>=0 && x-1>=0                     ? grid[y-1][x-1] : false;
            const ne = y+1<lenY && x+1<lenX  ? grid[y+1][x+1] : false;
            const nw = y+1<lenY && x-1>=0            ? grid[y+1][x-1] : false;
            const w  = x-2>=0                               ? grid[y][x-2] : false;
            const e  = x+2<lenX                     ? grid[y][x+2] : false;
    
            const count = [se, sw, ne, nw, w, e].reduce((count, black) => black ? count+1 : count, 0);
            
            switch(grid[y][x]) {
                case true:
                    if (count == 0 || count > 2) {
                        updatedGridRow.push(false);
                    } else {
                        updatedGridRow.push(true);
                    }
                    break;
                case false:
                    if (count == 2) {
                        updatedGridRow.push(true);
                    } else {
                        updatedGridRow.push(false);
                    }
                    break;
            }
        }
        updatedGrid.push(updatedGridRow);
        updatedGridRow = [];
    }
    grid = updatedGrid;
    trimXYSpace(grid);
}
// printGrid();

const MAX_DAYS = 100;
Array.from({length: MAX_DAYS}, (_, i) => {
    // printGrid(grid);
    simulateDay();
    // printGrid(grid);
    // console.log('day', i+1, countOfBlackTiles());
});
console.log('PART II');
console.log('day', MAX_DAYS);
console.log('Number of black tiles', countOfBlackTiles());



/*
    HELPER FUNCTIONS
*/
function padYSpace(matrix) {
    const newY = Array.from({length: matrix[0].length}, () => false);
    matrix.unshift([...newY]);
    matrix.unshift([...newY]);
    matrix.push([...newY]);
    matrix.push([...newY]);
}
function padXSpace(matrix) {
    matrix.forEach(y => {
        y.unshift(false);
        y.unshift(false);
        y.push(false);
        y.push(false);
    });
}
function padXYSpace(matrix) {
    padXSpace(matrix);
    padYSpace(matrix);
}

function trimYSpace (matrix) {
    let keepTrimming = true;
    let trimFromAboveCount = 0;
    let trimFromBelowCount = 0;
    const trim = (y, above) => {
        if (keepTrimming) {
            if (matrix[y].every(x => !x)) {
                above ? trimFromAboveCount++ : trimFromBelowCount++;
            } else {
                keepTrimming = false;
            }
        }
    }
    Array.from({length: matrix.length}, (_, y) => trim(y, true));
    if (trimFromAboveCount) 
        Array.from({length: trimFromAboveCount}, (_, y) => matrix.shift());
    keepTrimming = true;
    const len = matrix.length;
    Array.from({length: len}, (_, z) => trim(len-1-z, false));
    if (trimFromBelowCount) 
        Array.from({length: trimFromBelowCount}, (_, y) => matrix.pop());
}
function trimXSpace(matrix) {
    let keepTrimming = true;
    let trimFromLeftCount = 0;
    let trimFromRightCount = 0;
    const trim = (x, left) => {
        if (keepTrimming) {
            if (Array.from({length: matrix.length}, (_, y) => !matrix[y][x]).every(yi => yi)) {
                left ? trimFromLeftCount++ : trimFromRightCount++;
            } else {
                keepTrimming = false;
            }
        }
    }
    Array.from({length: matrix[0].length}, (_, x) => trim(x, true));
    if (trimFromLeftCount) 
        Array.from({length: matrix.length}, (_, y) => 
            Array.from({length: trimFromLeftCount}, () => matrix[y].shift()));
    keepTrimming = true;

    const len = matrix[0].length;
    Array.from({length: len}, (_, x) => trim(len - 1 - x, false));
    if (trimFromRightCount) 
        Array.from({length: matrix.length}, (_, y) => 
            Array.from({length: trimFromRightCount}, () => matrix[y].pop()));
}
function trimXYSpace(matrix) {
    trimYSpace(matrix);
    trimXSpace(matrix);
}