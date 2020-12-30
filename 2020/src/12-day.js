const inputFile = '../inputs/12-input.txt';
// const inputFile = '../inputs/12-example.txt';
const processFile = require('../common/file-processor');


// PART I
const input1 = processFile(inputFile, {
    lineSeparator: new RegExp('\\n', 'g'),
    // groupSeparator: new RegExp('\\s', 'g'),
    // jsonSeparator: new RegExp(':', 'g')
});

// const facingDirection = 0; /* 0:E, 1:S, 2:W, 3:N */
// const east = 0;
// const west = 0;
// const south = 0;
// const north = 0;

const advance = (tracking, amount) => {
    tracking[tracking[0]+1] += amount;
}
Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

// const tracking = input1
//     .reduce((tracking, dir) => {
//         const move = dir[0];
//         const amount = parseInt(dir.slice(1));

//         switch (move) {
//             case 'F':
//                 advance(tracking, amount);
//                 break;
//             case 'E':
//                 tracking[1] += amount;
//                 break;
//             case 'S':
//                 tracking[2] += amount;
//                 break;
//             case 'W':
//                 tracking[3] += amount;
//                 break;
//             case 'N':
//                 tracking[4] += amount;
//                 break;
//             case 'R':
//                 tracking[0] = (tracking[0]+(amount/90)).mod(4);
//                 break;
//             case 'L':
//                 tracking[0] = (tracking[0]-(amount/90)).mod(4);
//                 break;
//         }
//         // console.log(dir, tracking);

//         return tracking;
//     }, [facingDirection, east, west, south, north]);

// const result1 = Math.abs(tracking[1]-tracking[3]) + Math.abs(tracking[2]-tracking[4]);
// console.log(result1, tracking);



// PART II
const input2 = processFile(inputFile, {
    lineSeparator: new RegExp('\\n', 'g'),
    // groupSeparator: new RegExp('\\s', 'g'),
    // jsonSeparator: new RegExp(':', 'g')
});

/* 0:E, 1:S, 2:W, 3:N */
const east = 0;
const south = 0;
const west = 0;
const north = 0;

const Weast = 10;
const Wsouth = 0;
const Wwest = 0;
const Wnorth = 1;

const advance2 = (tracking, waypoint, amount) => {
    const adders = waypoint.map(d=>d*amount);
    // console.log(adders);
    // console.log(tracking.map((d,i)=>d+adders[i]));
    tracking[0] += adders[0];
    tracking[1] += adders[1];
    tracking[2] += adders[2];
    tracking[3] += adders[3];
    // tracking = tracking.map((d,i)=>d+adders[i]);
}
const rotate2 = (waypoint, degrees) => {
    const amount = (degrees/90);
    // console.log(amount);
    const newEast = waypoint[(0+amount).mod(4)];
    const newSouth = waypoint[(1+amount).mod(4)];
    const newWest = waypoint[(2+amount).mod(4)];
    const newNorth = waypoint[(3+amount).mod(4)];

    waypoint[0] = newEast;
    waypoint[1] = newSouth;
    waypoint[2] = newWest;
    waypoint[3] = newNorth;
}

const tracking = input1
    .reduce((tracking, dir) => {
        const move = dir[0];
        const amount = parseInt(dir.slice(1));

        switch (move) {
            case 'F':
                advance2(tracking[0], tracking[1], amount);
                break;
            case 'E':
                tracking[1][0] += amount;
                break;
            case 'S':
                tracking[1][1] += amount;
                break;
            case 'W':
                tracking[1][2] += amount;
                break;
            case 'N':
                tracking[1][3] += amount;
                break;
            case 'R':
                rotate2(tracking[1], -amount);
                break;
            case 'L':
                rotate2(tracking[1], amount);
                break;
        }
        console.log(dir, tracking);

        return tracking;
    }, [[east, south, west, north], [Weast, Wsouth, Wwest, Wnorth]]);

const result1 = Math.abs(tracking[0][0]-tracking[0][2]) + Math.abs(tracking[0][1]-tracking[0][3]);
console.log(result1, tracking);