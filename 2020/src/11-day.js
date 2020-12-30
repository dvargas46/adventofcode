const inputFile = '../inputs/11-input.txt';
// const inputFile = '../inputs/11-example.txt';
const processFile = require('../common/file-processor');


// PART I
const input1 = processFile(inputFile, {
    lineSeparator: new RegExp('\\n', 'g'),
    groupSeparator: new RegExp('', 'g'),
});

const simulate = (arr) => {
    const orig = JSON.parse(JSON.stringify(arr));

    arr.forEach((row, y) => {
        row.map((seat, x) => {
            const UL = orig[y-1] && orig[y-1][x-1] ? orig[y-1][x-1] : '.';
            const U  = orig[y-1] && orig[y-1][x]   ? orig[y-1][x]   : '.';
            const UR = orig[y-1] && orig[y-1][x+1] ? orig[y-1][x+1] : '.';
            const L  = orig[y]   && orig[y][x-1]   ? orig[y][x-1]   : '.';
            const R  = orig[y]   && orig[y][x+1]   ? orig[y][x+1]   : '.';
            const DL = orig[y+1] && orig[y+1][x-1] ? orig[y+1][x-1] : '.';
            const D  = orig[y+1] && orig[y+1][x]   ? orig[y+1][x]   : '.';
            const DR = orig[y+1] && orig[y+1][x+1] ? orig[y+1][x+1] : '.';
            const adjSeats = [UL, U, UR, L, R, DL, D, DR];

            switch(seat) {
                case 'L':
                    if (adjSeats.every(adjSeat => adjSeat !== '#')) arr[y][x] = '#';
                    break;
                case '#':
                    if (adjSeats.reduce((tot, adjSeat) => adjSeat === '#' ? tot+1 : tot, 0) >= 4) arr[y][x] = 'L';
                    break; 
                case '.':
                default:
            }
        });
    });

    return JSON.stringify(arr) === JSON.stringify(orig);
};

const simulateAllScenarios = (arr, sim) => {
    let counter = 0
    while(!sim(arr)) {
        counter++;
    }
    return counter;
}


const numberOfScenarios = simulateAllScenarios(input1, simulate);
const result1 = input1.reduce((tot, row) => row.reduce((subtot, seat) => seat === '#' ? subtot+1 : subtot, 0) + tot, 0);
console.log(numberOfScenarios, result1);



// PART II
const input2 = processFile(inputFile, {
    lineSeparator: new RegExp('\\n', 'g'),
    groupSeparator: new RegExp('', 'g'),
});

const seatSeen = (dir, pos, arr) => {
    const y = pos[0];
    const x = pos[1];
    let dirX = dir[0];
    let dirY = dir[1];

    let seen = '';
    do {
        seen = arr[y+dirY] && arr[y+dirY][x+dirX] 
            ? (arr[y+dirY][x+dirX] === '.' ? '' : arr[y+dirY][x+dirX]) 
            : '.';
        
        dirX = dirX === 0 ? 0 : dirX > 0 ? dirX+1 : dirX-1;
        dirY = dirY === 0 ? 0 : dirY > 0 ? dirY+1 : dirY-1;
    } while (!seen);
    return seen;
}
const simulate2 = (arr) => {
    const orig = JSON.parse(JSON.stringify(arr));

    arr.forEach((row, y) => {
        row.map((seat, x) => {
            const UL = seatSeen([-1, -1], [y, x], orig);
            const U  = seatSeen([-1,  0], [y, x], orig);
            const UR = seatSeen([-1,  1], [y, x], orig);
            const L  = seatSeen([ 0, -1], [y, x], orig);
            const R  = seatSeen([ 0,  1], [y, x], orig);
            const DL = seatSeen([ 1, -1], [y, x], orig);
            const D  = seatSeen([ 1,  0], [y, x], orig);
            const DR = seatSeen([ 1,  1], [y, x], orig);
            const adjSeats = [UL, U, UR, L, R, DL, D, DR];

            switch(seat) {
                case 'L':
                    if (adjSeats.every(adjSeat => adjSeat !== '#')) arr[y][x] = '#';
                    break;
                case '#':
                    if (adjSeats.reduce((tot, adjSeat) => adjSeat === '#' ? tot+1 : tot, 0) >= 5) arr[y][x] = 'L';
                    break; 
                case '.':
                default:
            }
        });
    });

    return JSON.stringify(arr) === JSON.stringify(orig);
};

const numberOfScenarios2 = simulateAllScenarios(input2, simulate2);
const result2 = input2.reduce((tot, row) => row.reduce((subtot, seat) => seat === '#' ? subtot+1 : subtot, 0) + tot, 0);
console.log(numberOfScenarios2, result2);
