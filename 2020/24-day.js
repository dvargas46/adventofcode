// const inputfile = './inputs/24-input.txt';
const inputfile = './inputs/24-example.txt';
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

console.log(locations, whiteHexagons, blackHexagons);
console.log(locations.length, whiteHexagons.length, blackHexagons.length);


// PART II
// Add remaining white tiles

// WHS = whiteHexagons.map(w => JSON.stringify(w));
// for (let i=-50; i<=50; i++) {
//     for (let j=-50; j<=50; j++) {
//         const loc = [i, j];
//         const locStr = `${i}${j}`
//         if (!WHS.some(w => locStr === w)) {
//             whiteHexagons.push(loc);
//         }
//     }
// }
// console.log(whiteHexagons);
// process.exit(0);

const runDay = (i) => {
    const newBlackTiles = [];
    const newWhiteTiles = [];
    whiteHexagons.forEach(w => {
        let x = y = 0;
        let blackTileCount = 0;
        let tileExists = false;
        // check all neighbors
        // 'sw'
        y = w[0]+1;
        x = w[1]-1;
        tileExists = blackHexagons.some((b) => JSON.stringify([y,x]) === JSON.stringify(b));
        if (!tileExists) {
            whiteHexagons.push([y,x]);
        } else {
            blackTileCount++;
        }
        // 'se'
        y = w[0]+1;
        x = w[1]+1;
        tileExists = blackHexagons.some((b) => JSON.stringify([y,x]) === JSON.stringify(b));
        if (!tileExists) {
            whiteHexagons.push([y,x]);
        } else {
            blackTileCount++;
        }
        // 'ny = w'
        y = w[0]-1;
        x = w[1]-1;
        tileExists = blackHexagons.some((b) => JSON.stringify([y,x]) === JSON.stringify(b));
        if (!tileExists) {
            whiteHexagons.push([y,x]);
        } else {
            blackTileCount++;
        }
        // 'ne'
        y = w[0]-1;
        x = w[1]+1;
        tileExists = blackHexagons.some((b) => JSON.stringify([y,x]) === JSON.stringify(b));
        if (!tileExists) {
            whiteHexagons.push([y,x]);
        } else {
            blackTileCount++;
        }
        // 'y = w'
        y = w[0];
        x = w[1]-2;
        tileExists = blackHexagons.some((b) => JSON.stringify([y,x]) === JSON.stringify(b));
        if (!tileExists) {
            whiteHexagons.push([y,x]);
        } else {
            blackTileCount++;
        }
        // 'e'
        y = w[0];
        x = w[1]+2;
        tileExists = blackHexagons.some((b) => JSON.stringify([y,x]) === JSON.stringify(b));
        if (!tileExists) {
            whiteHexagons.push([y,x]);
        } else {
            blackTileCount++;
        }
    
        if (blackTileCount == 2) {
            newBlackTiles.push(w);
        } else {
            newWhiteTiles.push(w);
        }
    });
    blackHexagons.forEach(b => {
        let x, y;
        let whiteTileCount = 0;
        let tileExists = false;
        // check all neighbors
        // 'sw'
        y = b[0]+1;
        x = b[1]-1;
        tileExists = whiteHexagons.some((b) => JSON.stringify([y,x]) === JSON.stringify(b));
        if (!tileExists) {
            whiteHexagons.push([y,x]);
        } else {
            whiteTileCount++;
        }
        // 'se'
        y = b[0]+1;
        x = b[1]+1;
        tileExists = whiteHexagons.some((b) => JSON.stringify([y,x]) === JSON.stringify(b));
        if (!tileExists) {
            whiteHexagons.push([y,x]);
        } else {
            whiteTileCount++;
        }
        // 'nw'
        y = b[0]-1;
        x = b[1]-1;
        tileExists = whiteHexagons.some((b) => JSON.stringify([y,x]) === JSON.stringify(b));
        if (!tileExists) {
            whiteHexagons.push([y,x]);
        } else {
            whiteTileCount++;
        }
        // 'ne'
        y = b[0]-1;
        x = b[1]+1;
        tileExists = whiteHexagons.some((b) => JSON.stringify([y,x]) === JSON.stringify(b));
        if (!tileExists) {
            whiteHexagons.push([y,x]);
        } else {
            whiteTileCount++;
        }
        // 'y = w'
        y = b[0];
        x = b[1]-2;
        tileExists = whiteHexagons.some((b) => JSON.stringify([y,x]) === JSON.stringify(b));
        if (!tileExists) {
            whiteHexagons.push([y,x]);
        } else {
            whiteTileCount++;
        }
        // 'e'
        y = b[0];
        x = b[1]+2;
        tileExists = whiteHexagons.some((b) => JSON.stringify([y,x]) === JSON.stringify(b));
        if (!tileExists) {
            whiteHexagons.push([y,x]);
        } else {
            whiteTileCount++;
        }
    
        if (whiteTileCount == 0 || whiteTileCount > 2) {
            newWhiteTiles.push(b);
        } else {
            newBlackTiles.push(b);
        }
    });
    whiteHexagons = newWhiteTiles;
    blackHexagons = newBlackTiles;

    console.log('day', i+1, 'w', whiteHexagons.length, 'b', blackHexagons.length);
}

Array.from({length: 10}, (_, i) => {
    runDay(i);
})

// console.log(locations, whiteHexagons, blackHexagons);
console.log(whiteHexagons.length, blackHexagons.length);