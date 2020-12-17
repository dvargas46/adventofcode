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

// PART I
const inactive = '.';
const active = '#';
let input1 = processFile(inputFile, { rawText: true }).replace(/\n/g, '');
let zLength = 1;
let squareLength = Math.sqrt(input1.length);
let stringLength = input1.length;
let padChar = inactive;
let tempSpace;

const getZPlanes = (str) => {
    return str.match(new RegExp('.{' + stringLength + '}', 'g'))
}

// PAD SPACES
const padZSpace = (str) => {
    const template = padChar.repeat(stringLength);
    zLength += 2;
    return template + str + template;
}
const pad2D = (str) => {
    const newStr = str.split('').map((char, index) => index % squareLength === 0 ? padChar + char : index % squareLength === squareLength-1 ? char + padChar : char).join('');
    const template = padChar.repeat(squareLength+2);
    return template + newStr + template;
}
const padAll2DPlanes = (str) => {
    const paddedPlanes = getZPlanes(str).map(pad2D).join('');
    squareLength += 2;
    stringLength = squareLength**2;
    return paddedPlanes;
}
const pad3D = (str) => {
    return padZSpace(padAll2DPlanes(str));
}

// TRIM SPACES
const isOuter = (i) => i < squareLength || i > stringLength-squareLength || i%squareLength === 0 || i%squareLength === squareLength-1;
const trimZSpace = (str) => {
    return getZPlanes(str).filter(plane => plane.split('').every(c => c === padChar) ? (zLength-=1, false) : true).join('');
}
const trim2D = (str) => {
    return str.split('').map((c, i) => isOuter(i) ? '' : c).join('');
}
const trimAll2DPlanes = (str) => {
    const removeExcess = getZPlanes(str).every(plane => plane.split('').every((c, i) => isOuter(i) ? c === inactive : true));
    if (!removeExcess) {
        return str;
    } else {
        const trimmedPlanes = getZPlanes(str).map(trim2D).join('');
        squareLength-=2;
        stringLength=squareLength**2;
        return trimmedPlanes;
    }
}
const trim3D = (str) => {
    return trimAll2DPlanes(trimZSpace(str));
}

// console.log(input1, input1.length, zLength, squareLength, stringLength);
// tempSpace = pad3D(input1);
// console.log(tempSpace, tempSpace.length, zLength, squareLength, stringLength);
// tempSpace = trim3D(tempSpace);
// console.log(tempSpace, tempSpace.length, zLength, squareLength, stringLength);

const getNeighbors = (str, pos) => {
    str.split('').filter((_, i) => {
        return i === pos-squareLength
            || i === pos+squareLength
            ;
    })
}

const simulate = (str) => {
    let result = str;
    
    result = pad3D(result);

    result.split('').map((c, i) => {
        const neighbors = getNeighbors(str, i);
        const activeNeighborCount = neighbors.reduce((count, neighbor) => neighbor === active ? count+1 : count, 0);
        
        switch(c) {
            case active:
                return (activeNeighborCount !== 2 && activeNeighborCount !== 3) ? inactive : active;
            case inactive:
                return (activeNeighborCount === 3) ? active : inactive;
            default:
        }
    });

    result = trim3D(result);
    return result;
};

const fullSixCycleBoot = (str) => {
    let counter = 0
    while(counter < 6) {
        if (arr[0].some(row => row.some(v => v==='#'))) {
            const planeLength = arr[0][0].length;
            const template = Array.from(new Array(planeLength).fill('.'));
            const plane = new Array(planeLength).fill(0).map(_ => [...template]);
            arr.unshift(plane);
        }
        simulate(arr);
        counter++;
    }
    return counter;
}




// const surround1D = (arr, val) => {
//     arr.unshift(val);
//     arr.push(val);
// }

// const surround2D = (arr2D, val) => {
//     const curLength = arr2D[0].length;
//     const template = new Array(curLength).fill(val);

//     arr2D.forEach(row => surround1D(row, val));
//     arr2D.unshift([...template]);
//     arr2D.push([...template]);
// }

// const surround3D = (arr3D, val) => {
//     const curLength = arr[0].length;
//     const template = new Array(curLength).fill(val);

//     arr2D.forEach(row => surround1D(row, val));
//     arr2D.unshift([...template]);
//     arr2D.push([...template]);
// }

// const simulate = (arr) => {
//     const orig = JSON.parse(JSON.stringify(arr));

//     arr.forEach((row, y) => {
//         row.map((seat, x) => {


//             const UL = orig[y-1] && orig[y-1][x-1] ? orig[y-1][x-1] : '.';
//             const U  = orig[y-1] && orig[y-1][x]   ? orig[y-1][x]   : '.';
//             const UR = orig[y-1] && orig[y-1][x+1] ? orig[y-1][x+1] : '.';
//             const L  = orig[y]   && orig[y][x-1]   ? orig[y][x-1]   : '.';
//             const R  = orig[y]   && orig[y][x+1]   ? orig[y][x+1]   : '.';
//             const DL = orig[y+1] && orig[y+1][x-1] ? orig[y+1][x-1] : '.';
//             const D  = orig[y+1] && orig[y+1][x]   ? orig[y+1][x]   : '.';
//             const DR = orig[y+1] && orig[y+1][x+1] ? orig[y+1][x+1] : '.';

//             const adjSeats = [UL, U, UR, L, R, DL, D, DR];

//             switch(seat) {
//                 case '.':
//                     if (adjSeats.every(adjSeat => adjSeat !== '#')) arr[y][x] = '#';
//                     break;
//                 case '#':
//                     if (adjSeats.reduce((tot, adjSeat) => adjSeat === '#' ? tot+1 : tot, 0) >= 4) arr[y][x] = 'L';
//                     break; 
//                 default:
//             }
//         });
//     });

//     return JSON.stringify(arr) === JSON.stringify(orig);
// };

// const fullSixCycleBoot = (arr, simulate) => {
//     let counter = 0
//     while(counter < 6) {
//         if (arr[0].some(row => row.some(v => v==='#'))) {
//             const planeLength = arr[0][0].length;
//             const template = Array.from(new Array(planeLength).fill('.'));
//             const plane = new Array(planeLength).fill(0).map(_ => [...template]);
//             arr.unshift(plane);
//         }
//         simulate(arr);
//         counter++;
//     }
//     return counter;
// }

// // const numberOfScenarios = simulateAllScenarios(input1, simulate);
// // const result1 = input1.reduce((tot, row) => row.reduce((subtot, seat) => seat === '#' ? subtot+1 : subtot, 0) + tot, 0);
// // console.log(numberOfScenarios, result1);

// const result1 = input1;
// // console.log(result1);



// // PART II
// // const result2 = input1;
// // console.log(result2);