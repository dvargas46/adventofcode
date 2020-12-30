const inputFile = '../../inputs/11-input.txt';
const processFile = require('../../common/file-processor');

const input = processFile(inputFile, {
    lineSeparator: new RegExp('\\n', 'g'),
    groupSeparator: new RegExp('', 'g'),
});
const cloneDeepArray = (arr) => JSON.parse(JSON.stringify(arr));
const array2DToString = (arr) => arr.reduce((str, row) => str + row.join('') + '\n', '');

const MAX_ADJ_FILLED_SEATS_PART1 = 4;
const MAX_ADJ_FILLED_SEATS_PART2 = 5;

// Determines whether the seat is 'seen' in the given direction and position
const seatSeen = (dir, pos, arr, initial_seen) => {
    const y = pos[0];
    const x = pos[1];
    let dirX = dir[0];
    let dirY = dir[1];

    let seen = initial_seen;
    do {
        seen = arr[y+dirY] && arr[y+dirY][x+dirX] 
            ? (arr[y+dirY][x+dirX] === '.' ? seen : arr[y+dirY][x+dirX]) 
            : '.';
        
        dirX = dirX === 0 ? 0 : dirX > 0 ? dirX+1 : dirX-1;
        dirY = dirY === 0 ? 0 : dirY > 0 ? dirY+1 : dirY-1;
    } while (!seen);
    return seen;
}

// Runs the next simulation of the current seat mapping (modifies the passed array, purposefully)
const simulate = (arr, initial_seen, max_filled) => {
    const orig = cloneDeepArray(arr);

    arr.forEach((row, y) => {
        row.forEach((seat, x) => {
            const pos = [y, x];
            const UL = seatSeen([-1, -1], pos, orig, initial_seen);
            const U  = seatSeen([-1,  0], pos, orig, initial_seen);
            const UR = seatSeen([-1,  1], pos, orig, initial_seen);
            const L  = seatSeen([ 0, -1], pos, orig, initial_seen);
            const R  = seatSeen([ 0,  1], pos, orig, initial_seen);
            const DL = seatSeen([ 1, -1], pos, orig, initial_seen);
            const D  = seatSeen([ 1,  0], pos, orig, initial_seen);
            const DR = seatSeen([ 1,  1], pos, orig, initial_seen);
            const adjSeats = [UL, U, UR, L, R, DL, D, DR];

            switch(seat) {
                case 'L':
                    if (adjSeats.every(adjSeat => adjSeat !== '#')) arr[y][x] = '#';
                    break;
                case '#':
                    if (adjSeats.reduce((tot, adjSeat) => adjSeat === '#' ? tot+1 : tot, 0) >= max_filled) arr[y][x] = 'L';
                    break; 
                case '.':
                default:
            }
        });
    });

    return JSON.stringify(arr) === JSON.stringify(orig);
};

// Runs all simulations against the passed seat mapping until stabilization occurs and returns number of simulations
const simulateAllScenarios = (arr, sim, initial_seen, max_filled) => {
    let counter = 0
    while(!sim(arr, initial_seen, max_filled)) {
        counter++;
    }
    return counter;
}

// PART I
const input1 = cloneDeepArray(input);
const numberOfScenarios1 = simulateAllScenarios(input1, simulate, '.', MAX_ADJ_FILLED_SEATS_PART1);
const result1 = input1.reduce((tot, row) => row.reduce((subtot, seat) => seat === '#' ? subtot+1 : subtot, 0) + tot, 0);
console.log('PART I');
console.log(array2DToString(input1));
console.log(`Number of simulations run: ${numberOfScenarios1}`,);
console.log(`Number of filled seats: ${result1}\n`);


// PART II
const input2 = cloneDeepArray(input);
const numberOfScenarios2 = simulateAllScenarios(input2, simulate, '', MAX_ADJ_FILLED_SEATS_PART2);
const result2 = input2.reduce((tot, row) => row.reduce((subtot, seat) => seat === '#' ? subtot+1 : subtot, 0) + tot, 0);
console.log('PART II');
console.log(array2DToString(input2));
console.log(`Number of simulations run: ${numberOfScenarios2}`);
console.log(`Number of filled seats: ${result2}`);
