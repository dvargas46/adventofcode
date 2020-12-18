// const inputFile = './inputs/17-input.txt';
const inputFile = './inputs/17-example.txt';
const processFile = require('./file-processor');

/*
During a cycle, all cubes simultaneously change their state according to the following rules:

    If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active. Otherwise, the cube becomes inactive.
    If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active. Otherwise, the cube remains inactive.

    z=-1
    . . . . .     . . . . .
    . . . . .     . . . . .
    . . . . . --> . # . . .
    . . . . .     . . . # .
    . . . . .     . . # . .

    z=0
    . . . . .     . . . . .
    . . # . .     . . . . .
    . . . # . --> . # . # .
    . # # # .     . . # # .
    . . . . .     . . # . .

    z=1
    . . . . .     . . . . .
    . . . . .     . . . . .
    . . . . . --> . # . . .
    . . . . .     . . . # .
    . . . . .     . . # . .

    NOTES: result of z=-i is equal to result of z=i (mirrored)
    NOTES: 2D transformation into 1D
        begin       end
        . # .       0 1 2 3 4 5 6 7 8
        . . #   --> . # . . . # # # #
        # # #

    And after side padding
        begin       end
        . . # . .         0 1 2   3 4 5   6 7   8
        . . . # .   --> . . # . . . . . # . . # # # .
        . # # # .

    And after all padding
        begin       end
        . . . . .
        . . # . .         0 1 2   3 4 5   6 7   8       0 1 2   3 4 5   6 7   8       0 1 2   3 4 5   6 7   8    
        . . . # .   --> . . . . . . . . . . . . . . . . . # . . . . . # . . # # # . . . . . . . . . . . . . . . .
        . # # # .
        . . . . .
*/

const input1 = processFile(inputFile, { rawText: true }).replace(/\n/g, '');

let activeLocations = input1.split('').map((c, i) => c==='#' ? i : 0).filter(v => v);
let zdepth = 1;
let xylen = Math.sqrt(input1.length);
let vol = input1.length;

// console.log(input1, activeLocations, zdepth, xylen, vol);
const moveZd = (i) => 