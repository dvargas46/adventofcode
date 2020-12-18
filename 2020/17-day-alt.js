const inputFile = './inputs/17-input.txt';
// const inputFile = './inputs/17-example.txt';
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

const input1 = processFile(inputFile, { lineSeparator: /\n/g, groupSeparator: /\B/g })

let zdepth = 1;
let xdepth = input1[0].length;
let ydepth = input1[0].length;
let area = xdepth * ydepth;
let volume = area * zdepth;
const updateArea = () => area = xdepth * ydepth;
const updateVol = () => volume = area * zdepth;

// PADDING
const padZSpace = () => {
    const newZSpace1 = Array.from({length: ydepth}, () => {
        return Array.from({length: xdepth}, () => false);
    });
    const newZSpace2 = Array.from({length: ydepth}, () => {
        return Array.from({length: xdepth}, () => false);
    });
    zdepth += 2;
    updateVol();
    activeLocations.unshift(newZSpace1);
    activeLocations.push(newZSpace2);
}
const padYSpace = () => {
    const newYSpace1 = Array.from({length: xdepth}, () => false);
    const newYSpace2 = Array.from({length: xdepth}, () => false);
    activeLocations.forEach(zSpace => {
        zSpace.unshift(newYSpace1);
        zSpace.push(newYSpace2);
    });
    ydepth += 2;
    updateArea();
}
const padXSpace = () => {
    activeLocations.forEach(zSpace => {
        zSpace.forEach(ySpace => {
            ySpace.unshift(false);
            ySpace.push(false);
        });
    });
    xdepth += 2;
    updateArea();
}
const padZYXSpace = () => {
    padXSpace();
    padYSpace();
    padZSpace();
    updateArea();
    updateVol();
}

// TRIMMING
const trimZSpace = () => {
    let keepTrimming = true;
    const trim = (z) => {
        if (keepTrimming) {
            if (activeLocations[z].every(ySpace => ySpace.every(x => !x))) {
                zdepth -= 1;
                updateVol();
                activeLocations[z] = false;
            } else {
                keepTrimming = false;
            }
        }
    }
    Array.from({length: zdepth}, (_, z) => trim(z));
    activeLocations = activeLocations.filter(zSpace => zSpace);
    keepTrimming = true;
    const tempZDepth = zdepth;
    Array.from({length: tempZDepth}, (_, z) => trim(tempZDepth-1-z));
    activeLocations = activeLocations.filter(zSpace => zSpace);
}
const trimYSpace = () => {
    let keepTrimming = true;
    const trim = (y) => {
        if (keepTrimming) {
            if (Array.from({length: zdepth}, (_, z) => activeLocations[z][y].every(x => !x)).every(yi => yi)) {
                ydepth -= 1;
                updateArea();
                Array.from({length: zdepth}, (_, z) => activeLocations[z][y] = false);
            } else {
                keepTrimming = false;
            }
        }
    }
    Array.from({length: ydepth}, (_, y) => trim(y));
    activeLocations.forEach((zSpace, z) => activeLocations[z] = zSpace.filter(ySpace => ySpace));
    keepTrimming = true;
    const tempYDepth = ydepth;
    Array.from({length: tempYDepth}, (_, y) => trim(tempYDepth - 1 - y));
    activeLocations.forEach((zSpace, z) => activeLocations[z] = zSpace.filter(ySpace => ySpace));
}
const trimXSpace = () => {
    let keepTrimming = true;
    let trimFromLeftCount = 0;
    let trimFromRightCount = 0;
    const trim = (x, left) => {
        if (keepTrimming) {
            const allNone = Array.from({length: zdepth}, (_, z) => {
                return Array.from({length: ydepth}, (_, y) => {
                    return !activeLocations[z][y][x];
                }).every(yi => yi);
            }).every(zi => zi);
            if (allNone) {
                xdepth -= 1;
                updateArea();
                left ? trimFromLeftCount++ : trimFromRightCount++;
            } else {
                keepTrimming = false;
            }
        }
    }
    Array.from({length: xdepth}, (_, x) => trim(x, true));
    if (trimFromLeftCount) Array.from({length: zdepth}, (_, z) => Array.from({length: ydepth}, (_, y) => Array.from({length: trimFromLeftCount}, () => activeLocations[z][y].shift())));
    keepTrimming = true;
    const tempXDepth = xdepth;
    Array.from({length: xdepth}, (_, x) => trim(tempXDepth - 1 - x, false));
    if (trimFromRightCount) Array.from({length: zdepth}, (_, z) => Array.from({length: ydepth}, (_, y) => Array.from({length: trimFromRightCount}, () => activeLocations[z][y].pop())));
}
const trimZYXSpace = () => {
    trimZSpace();
    trimYSpace();
    trimXSpace();
    updateArea();
    updateVol();
}

// MAIN
let activeLocations = [input1.map(ySpace => ySpace.reduce((activeInY, x, i) => x === '#' ? [...activeInY, true] : [...activeInY, false], []))];

const getActiveNeighbors = (z, y, x) => {
    let activeNeighborsCount = 0;

    const xBeforeExists = x-1 >= 0;
    const xAfterExists  = x+1 < xdepth;
    const yBeforeExists = y-1 >= 0;
    const yAfterExists  = y+1 < ydepth;
    const zBeforeExists = z-1 >= 0;
    const zAfterExists  = z+1 < zdepth;

    //ZBEFORE
    if (zBeforeExists && yBeforeExists && xBeforeExists && activeLocations[z-1][y-1][x-1]) activeNeighborsCount++;
    if (zBeforeExists && yBeforeExists &&                  activeLocations[z-1][y-1][x]) activeNeighborsCount++;
    if (zBeforeExists && yBeforeExists && xAfterExists &&  activeLocations[z-1][y-1][x+1]) activeNeighborsCount++;

    if (zBeforeExists && yAfterExists && xBeforeExists && activeLocations[z-1][y+1][x-1]) activeNeighborsCount++;
    if (zBeforeExists && yAfterExists &&                  activeLocations[z-1][y+1][x]) activeNeighborsCount++;
    if (zBeforeExists && yAfterExists && xAfterExists &&  activeLocations[z-1][y+1][x+1]) activeNeighborsCount++;

    if (zBeforeExists &&                  xBeforeExists && activeLocations[z-1][y][x-1]) activeNeighborsCount++;
    if (zBeforeExists &&                                   activeLocations[z-1][y][x]) activeNeighborsCount++;
    if (zBeforeExists &&                  xAfterExists &&  activeLocations[z-1][y][x+1]) activeNeighborsCount++;

    //ZAFTER
    if (zAfterExists && yBeforeExists && xBeforeExists && activeLocations[z+1][y-1][x-1]) activeNeighborsCount++;
    if (zAfterExists && yBeforeExists &&                  activeLocations[z+1][y-1][x]) activeNeighborsCount++;
    if (zAfterExists && yBeforeExists && xAfterExists &&  activeLocations[z+1][y-1][x+1]) activeNeighborsCount++;

    if (zAfterExists && yAfterExists && xBeforeExists && activeLocations[z+1][y+1][x-1]) activeNeighborsCount++;
    if (zAfterExists && yAfterExists &&                  activeLocations[z+1][y+1][x]) activeNeighborsCount++;
    if (zAfterExists && yAfterExists && xAfterExists &&  activeLocations[z+1][y+1][x+1]) activeNeighborsCount++;

    if (zAfterExists &&                  xBeforeExists && activeLocations[z+1][y][x-1]) activeNeighborsCount++;
    if (zAfterExists &&                                   activeLocations[z+1][y][x]) activeNeighborsCount++;
    if (zAfterExists &&                  xAfterExists &&  activeLocations[z+1][y][x+1]) activeNeighborsCount++;
    
    //ZON
    if (                yBeforeExists && xBeforeExists && activeLocations[z][y-1][x-1]) activeNeighborsCount++;
    if (                yBeforeExists &&                  activeLocations[z][y-1][x]) activeNeighborsCount++;
    if (                yBeforeExists && xAfterExists &&  activeLocations[z][y-1][x+1]) activeNeighborsCount++;

    if (                yAfterExists && xBeforeExists && activeLocations[z][y+1][x-1]) activeNeighborsCount++;
    if (                yAfterExists &&                  activeLocations[z][y+1][x]) activeNeighborsCount++;
    if (                yAfterExists && xAfterExists &&  activeLocations[z][y+1][x+1]) activeNeighborsCount++;

    if (                                 xBeforeExists && activeLocations[z][y][x-1]) activeNeighborsCount++;
    if (                                 xAfterExists &&  activeLocations[z][y][x+1]) activeNeighborsCount++;

    return activeNeighborsCount;
}

const simulate = () => {
    let updatedZSpace = [];
    let updatedYSpace = [];
    let updatedXSpace = [];
    padZYXSpace();
    activeLocations.forEach((zSpaces, z) => {
        zSpaces.forEach((ySpaces, y) => {
            ySpaces.forEach((active, x) => {
                const activeNeighborsCount = getActiveNeighbors(z, y, x);
                switch(active) {
                    case true:
                        activeNeighborsCount === 2 || activeNeighborsCount === 3 ? updatedXSpace.push(true) : updatedXSpace.push(false);
                        break;
                    case false:
                        activeNeighborsCount === 3 ? updatedXSpace.push(true) : updatedXSpace.push(false);
                        break;
                }
            });
            updatedYSpace.push(updatedXSpace);
            updatedXSpace = [];
        });
        updatedZSpace.push(updatedYSpace);
        updatedYSpace = [];
    });
    activeLocations = updatedZSpace;
    trimZYXSpace();
}

const runSixCycleBoot = () => {
    Array.from({length: 6}, () => simulate());
}

runSixCycleBoot();
console.log(zdepth, ydepth, xdepth, area, volume);
console.log(activeLocations.flat(3).reduce((sum, active) => active ? sum+1 : sum, 0));