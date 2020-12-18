const inputFile = './inputs/17-input.txt';
// const inputFile = './inputs/17-example.txt';
const processFile = require('./file-processor');

const input1 = processFile(inputFile, { lineSeparator: /\n/g, groupSeparator: /\B/g })

let wdepth = 1;
let zdepth = 1;
let xdepth = input1[0].length;
let ydepth = input1[0].length;

let area = xdepth * ydepth;
let volume = area * zdepth;
let hypervol = volume * wdepth;
const updateArea = () => area = xdepth * ydepth;
const updateVol = () => volume = area * zdepth;
const updateHyperVol = () => hypervol = volume * wdepth;

// PADDING
const padWSpace = () => {
    const newWSpace1 = Array.from({length: zdepth}, () => {
        return Array.from({length: ydepth}, () => {
            return Array.from({length: xdepth}, () => false);
        })
    });
    const newWSpace2 = Array.from({length: zdepth}, () => {
        return Array.from({length: ydepth}, () => {
            return Array.from({length: xdepth}, () => false);
        })
    });
    wdepth += 2;
    updateHyperVol();
    activeLocations.unshift(newWSpace1);
    activeLocations.push(newWSpace2);
}
const padZSpace = () => {
    const newZSpace1 = Array.from({length: ydepth}, () => {
        return Array.from({length: xdepth}, () => false);
    });
    const newZSpace2 = Array.from({length: ydepth}, () => {
        return Array.from({length: xdepth}, () => false);
    });
    activeLocations.forEach(wSpace => {
        wSpace.unshift(newZSpace1);
        wSpace.push(newZSpace2);
    });
    zdepth += 2;
    updateVol();
}
const padYSpace = () => {
    const newYSpace1 = Array.from({length: xdepth}, () => false);
    const newYSpace2 = Array.from({length: xdepth}, () => false);
    activeLocations.forEach(wSpace => {
        wSpace.forEach(zSpace => {
            zSpace.unshift(newYSpace1);
            zSpace.push(newYSpace2);
        })
    });
    ydepth += 2;
    updateArea();
}
const padXSpace = () => {
    activeLocations.forEach(wSpace => {
        wSpace.forEach(zSpace => {
            zSpace.forEach(ySpace => {
                ySpace.unshift(false);
                ySpace.push(false);
            });
        });
    });
    xdepth += 2;
    updateArea();
}
const padWZYXSpace = () => {
    padXSpace();
    padYSpace();
    padZSpace();
    padWSpace();
    
    updateArea();
    updateVol();
    updateHyperVol();
}

// TRIMMING
const trimWSpace = () => {
    let keepTrimming = true;
    const trim = (w) => {
        if (keepTrimming) {
            if (activeLocations[w].every(zSpace => zSpace.every(ySpace => ySpace.every(x => !x)))) {
                wdepth -= 1;
                updateHyperVol();
                activeLocations[w] = false;
            } else {
                keepTrimming = false;
            }
        }
    }
    Array.from({length: wdepth}, (_, w) => trim(w));
    activeLocations = activeLocations.filter(wSpace => wSpace);
    keepTrimming = true;
    const tempWDepth = wdepth;
    Array.from({length: tempWDepth}, (_, w) => trim(tempWDepth-1-w));
    activeLocations = activeLocations.filter(wSpace => wSpace);
}
const trimZSpace = () => {
    let keepTrimming = true;
    const trim = (z) => {
        if (keepTrimming) {
            const allNone = Array.from({length: wdepth}, (_, w) => 
                activeLocations[w][z].every(ySpace => 
                    ySpace.every(xi => !xi))
            ).every(wi => wi);

            if (allNone) {
                zdepth -= 1;
                updateVol();
                Array.from({length: wdepth}, (_, w) => activeLocations[w][z] = false);
            } else {
                keepTrimming = false;
            }
        }
    }
    Array.from({length: zdepth}, (_, z) => trim(z));
    activeLocations.forEach((wSpace, w) => 
        activeLocations[w] = wSpace.filter(zSpace => zSpace));
    keepTrimming = true;
    const tempZDepth = zdepth;
    Array.from({length: tempZDepth}, (_, z) => trim(tempZDepth - 1 - z));
    activeLocations.forEach((wSpace, w) => 
        activeLocations[w] = wSpace.filter(zSpace => zSpace));
}
const trimYSpace = () => {
    let keepTrimming = true;
    const trim = (y) => {
        if (keepTrimming) {
            const allNone = Array.from({length: wdepth}, (_, w) => 
                Array.from({length: zdepth}, (_, z) => 
                    activeLocations[w][z][y].every(xi => xi)
                ).every(zi => zi)
            ).every(wi => wi);

            if (allNone) {
                ydepth -= 1;
                updateArea();
                Array.from({length: wdepth}, (_, w) => 
                    Array.from({length: zdepth}, (_, z) => 
                        activeLocations[w][z][y] = false));
            } else {
                keepTrimming = false;
            }
        }
    }
    Array.from({length: ydepth}, (_, y) => trim(y));
    activeLocations.forEach((wSpace, w) => 
        wSpace.forEach((zSpace, z) => 
            activeLocations[w][z] = zSpace.filter(ySpace => ySpace)));
    keepTrimming = true;
    const tempYDepth = ydepth;
    Array.from({length: tempYDepth}, (_, y) => trim(tempYDepth - 1 - y));
    activeLocations.forEach((wSpace, w) => 
        wSpace.forEach((zSpace, z) => 
            activeLocations[w][z] = zSpace.filter(ySpace => ySpace)));
}
const trimXSpace = () => {
    let keepTrimming = true;
    let trimFromLeftCount = 0;
    let trimFromRightCount = 0;
    const trim = (x, left) => {
        if (keepTrimming) {
            const allNone = Array.from({length: wdepth}, (_, w) => {
                return Array.from({length: zdepth}, (_, z) => {
                    return Array.from({length: ydepth}, (_, y) => {
                        return !activeLocations[w][z][y][x];
                    }).every(yi => yi);
                }).every(zi => zi);
            }).every(wi => wi);

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
    if (trimFromLeftCount) 
        Array.from({length: wdepth}, (_, w) => 
            Array.from({length: zdepth}, (_, z) => 
                Array.from({length: ydepth}, (_, y) => 
                    Array.from({length: trimFromLeftCount}, () => activeLocations[w][z][y].shift()))));

    keepTrimming = true;
    const tempXDepth = xdepth;
    Array.from({length: xdepth}, (_, x) => trim(tempXDepth - 1 - x, false));
    if (trimFromRightCount) 
    Array.from({length: wdepth}, (_, w) => 
        Array.from({length: zdepth}, (_, z) => 
            Array.from({length: ydepth}, (_, y) => 
                Array.from({length: trimFromRightCount}, () => activeLocations[w][z][y].pop()))));
}
const trimWZYXSpace = () => {
    trimWSpace();
    trimZSpace();
    trimYSpace();
    trimXSpace();

    updateArea();
    updateVol();
    updateHyperVol();
}

// MAIN
let activeLocations = [[input1.map(ySpace => ySpace.reduce((activeInY, x) => x === '#' ? [...activeInY, true] : [...activeInY, false], []))]];

const getActiveNeighbors = (w, z, y, x) => {
    let activeNeighborsCount = 0;

    const xBeforeExists = x-1 >= 0;
    const xAfterExists  = x+1 < xdepth;
    const yBeforeExists = y-1 >= 0;
    const yAfterExists  = y+1 < ydepth;
    const zBeforeExists = z-1 >= 0;
    const zAfterExists  = z+1 < zdepth;
    const wBeforeExists = w-1 >= 0;
    const wAfterExists  = w+1 < wdepth;

    //WBEFORE
    //ZBEFORE
    if (wBeforeExists && zBeforeExists && yBeforeExists && xBeforeExists && activeLocations[w-1][z-1][y-1][x-1]) activeNeighborsCount++;
    if (wBeforeExists && zBeforeExists && yBeforeExists &&                  activeLocations[w-1][z-1][y-1][x]) activeNeighborsCount++;
    if (wBeforeExists && zBeforeExists && yBeforeExists && xAfterExists &&  activeLocations[w-1][z-1][y-1][x+1]) activeNeighborsCount++;

    if (wBeforeExists && zBeforeExists && yAfterExists && xBeforeExists &&  activeLocations[w-1][z-1][y+1][x-1]) activeNeighborsCount++;
    if (wBeforeExists && zBeforeExists && yAfterExists &&                   activeLocations[w-1][z-1][y+1][x]) activeNeighborsCount++;
    if (wBeforeExists && zBeforeExists && yAfterExists && xAfterExists &&   activeLocations[w-1][z-1][y+1][x+1]) activeNeighborsCount++;

    if (wBeforeExists && zBeforeExists &&                  xBeforeExists && activeLocations[w-1][z-1][y][x-1]) activeNeighborsCount++;
    if (wBeforeExists && zBeforeExists &&                                   activeLocations[w-1][z-1][y][x]) activeNeighborsCount++;
    if (wBeforeExists && zBeforeExists &&                  xAfterExists &&  activeLocations[w-1][z-1][y][x+1]) activeNeighborsCount++;

    //ZAFTER
    if (wBeforeExists && zAfterExists && yBeforeExists && xBeforeExists &&  activeLocations[w-1][z+1][y-1][x-1]) activeNeighborsCount++;
    if (wBeforeExists && zAfterExists && yBeforeExists &&                   activeLocations[w-1][z+1][y-1][x]) activeNeighborsCount++;
    if (wBeforeExists && zAfterExists && yBeforeExists && xAfterExists &&   activeLocations[w-1][z+1][y-1][x+1]) activeNeighborsCount++;

    if (wBeforeExists && zAfterExists && yAfterExists && xBeforeExists &&   activeLocations[w-1][z+1][y+1][x-1]) activeNeighborsCount++;
    if (wBeforeExists && zAfterExists && yAfterExists &&                    activeLocations[w-1][z+1][y+1][x]) activeNeighborsCount++;
    if (wBeforeExists && zAfterExists && yAfterExists && xAfterExists &&    activeLocations[w-1][z+1][y+1][x+1]) activeNeighborsCount++;

    if (wBeforeExists && zAfterExists &&                  xBeforeExists &&  activeLocations[w-1][z+1][y][x-1]) activeNeighborsCount++;
    if (wBeforeExists && zAfterExists &&                                    activeLocations[w-1][z+1][y][x]) activeNeighborsCount++;
    if (wBeforeExists && zAfterExists &&                  xAfterExists &&   activeLocations[w-1][z+1][y][x+1]) activeNeighborsCount++;
    
    //ZON
    if (wBeforeExists &&                yBeforeExists && xBeforeExists &&   activeLocations[w-1][z][y-1][x-1]) activeNeighborsCount++;
    if (wBeforeExists &&                yBeforeExists &&                    activeLocations[w-1][z][y-1][x]) activeNeighborsCount++;
    if (wBeforeExists &&                yBeforeExists && xAfterExists &&    activeLocations[w-1][z][y-1][x+1]) activeNeighborsCount++;

    if (wBeforeExists &&                yAfterExists && xBeforeExists &&    activeLocations[w-1][z][y+1][x-1]) activeNeighborsCount++;
    if (wBeforeExists &&                yAfterExists &&                     activeLocations[w-1][z][y+1][x]) activeNeighborsCount++;
    if (wBeforeExists &&                yAfterExists && xAfterExists &&     activeLocations[w-1][z][y+1][x+1]) activeNeighborsCount++;

    if (wBeforeExists &&                                 xBeforeExists &&   activeLocations[w-1][z][y][x-1]) activeNeighborsCount++;
    if (wBeforeExists &&                                                    activeLocations[w-1][z][y][x]) activeNeighborsCount++;
    if (wBeforeExists &&                                 xAfterExists &&    activeLocations[w-1][z][y][x+1]) activeNeighborsCount++;

    //WAFTER
    //ZBEFORE
    if (wAfterExists && zBeforeExists && yBeforeExists && xBeforeExists && activeLocations[w+1][z-1][y-1][x-1]) activeNeighborsCount++;
    if (wAfterExists && zBeforeExists && yBeforeExists &&                  activeLocations[w+1][z-1][y-1][x]) activeNeighborsCount++;
    if (wAfterExists && zBeforeExists && yBeforeExists && xAfterExists &&  activeLocations[w+1][z-1][y-1][x+1]) activeNeighborsCount++;

    if (wAfterExists && zBeforeExists && yAfterExists && xBeforeExists &&  activeLocations[w+1][z-1][y+1][x-1]) activeNeighborsCount++;
    if (wAfterExists && zBeforeExists && yAfterExists &&                   activeLocations[w+1][z-1][y+1][x]) activeNeighborsCount++;
    if (wAfterExists && zBeforeExists && yAfterExists && xAfterExists &&   activeLocations[w+1][z-1][y+1][x+1]) activeNeighborsCount++;

    if (wAfterExists && zBeforeExists &&                  xBeforeExists && activeLocations[w+1][z-1][y][x-1]) activeNeighborsCount++;
    if (wAfterExists && zBeforeExists &&                                   activeLocations[w+1][z-1][y][x]) activeNeighborsCount++;
    if (wAfterExists && zBeforeExists &&                  xAfterExists &&  activeLocations[w+1][z-1][y][x+1]) activeNeighborsCount++;

    //ZAFTER
    if (wAfterExists && zAfterExists && yBeforeExists && xBeforeExists &&  activeLocations[w+1][z+1][y-1][x-1]) activeNeighborsCount++;
    if (wAfterExists && zAfterExists && yBeforeExists &&                   activeLocations[w+1][z+1][y-1][x]) activeNeighborsCount++;
    if (wAfterExists && zAfterExists && yBeforeExists && xAfterExists &&   activeLocations[w+1][z+1][y-1][x+1]) activeNeighborsCount++;

    if (wAfterExists && zAfterExists && yAfterExists && xBeforeExists &&   activeLocations[w+1][z+1][y+1][x-1]) activeNeighborsCount++;
    if (wAfterExists && zAfterExists && yAfterExists &&                    activeLocations[w+1][z+1][y+1][x]) activeNeighborsCount++;
    if (wAfterExists && zAfterExists && yAfterExists && xAfterExists &&    activeLocations[w+1][z+1][y+1][x+1]) activeNeighborsCount++;

    if (wAfterExists && zAfterExists &&                  xBeforeExists &&  activeLocations[w+1][z+1][y][x-1]) activeNeighborsCount++;
    if (wAfterExists && zAfterExists &&                                    activeLocations[w+1][z+1][y][x]) activeNeighborsCount++;
    if (wAfterExists && zAfterExists &&                  xAfterExists &&   activeLocations[w+1][z+1][y][x+1]) activeNeighborsCount++;
    
    //ZON
    if (wAfterExists &&                yBeforeExists && xBeforeExists &&   activeLocations[w+1][z][y-1][x-1]) activeNeighborsCount++;
    if (wAfterExists &&                yBeforeExists &&                    activeLocations[w+1][z][y-1][x]) activeNeighborsCount++;
    if (wAfterExists &&                yBeforeExists && xAfterExists &&    activeLocations[w+1][z][y-1][x+1]) activeNeighborsCount++;

    if (wAfterExists &&                yAfterExists && xBeforeExists &&    activeLocations[w+1][z][y+1][x-1]) activeNeighborsCount++;
    if (wAfterExists &&                yAfterExists &&                     activeLocations[w+1][z][y+1][x]) activeNeighborsCount++;
    if (wAfterExists &&                yAfterExists && xAfterExists &&     activeLocations[w+1][z][y+1][x+1]) activeNeighborsCount++;

    if (wAfterExists &&                                 xBeforeExists &&   activeLocations[w+1][z][y][x-1]) activeNeighborsCount++;
    if (wAfterExists &&                                                    activeLocations[w+1][z][y][x]) activeNeighborsCount++;
    if (wAfterExists &&                                 xAfterExists &&    activeLocations[w+1][z][y][x+1]) activeNeighborsCount++;

    //WON
    //ZBEFORE
    if (                zBeforeExists && yBeforeExists && xBeforeExists && activeLocations[w][z-1][y-1][x-1]) activeNeighborsCount++;
    if (                zBeforeExists && yBeforeExists &&                  activeLocations[w][z-1][y-1][x]) activeNeighborsCount++;
    if (                zBeforeExists && yBeforeExists && xAfterExists &&  activeLocations[w][z-1][y-1][x+1]) activeNeighborsCount++;

    if (                zBeforeExists && yAfterExists && xBeforeExists &&  activeLocations[w][z-1][y+1][x-1]) activeNeighborsCount++;
    if (                zBeforeExists && yAfterExists &&                   activeLocations[w][z-1][y+1][x]) activeNeighborsCount++;
    if (                zBeforeExists && yAfterExists && xAfterExists &&   activeLocations[w][z-1][y+1][x+1]) activeNeighborsCount++;

    if (                zBeforeExists &&                  xBeforeExists && activeLocations[w][z-1][y][x-1]) activeNeighborsCount++;
    if (                zBeforeExists &&                                   activeLocations[w][z-1][y][x]) activeNeighborsCount++;
    if (                zBeforeExists &&                  xAfterExists &&  activeLocations[w][z-1][y][x+1]) activeNeighborsCount++;

    //ZAFTER
    if (                zAfterExists && yBeforeExists && xBeforeExists &&  activeLocations[w][z+1][y-1][x-1]) activeNeighborsCount++;
    if (                zAfterExists && yBeforeExists &&                   activeLocations[w][z+1][y-1][x]) activeNeighborsCount++;
    if (                zAfterExists && yBeforeExists && xAfterExists &&   activeLocations[w][z+1][y-1][x+1]) activeNeighborsCount++;

    if (                zAfterExists && yAfterExists && xBeforeExists &&   activeLocations[w][z+1][y+1][x-1]) activeNeighborsCount++;
    if (                zAfterExists && yAfterExists &&                    activeLocations[w][z+1][y+1][x]) activeNeighborsCount++;
    if (                zAfterExists && yAfterExists && xAfterExists &&    activeLocations[w][z+1][y+1][x+1]) activeNeighborsCount++;

    if (                zAfterExists &&                  xBeforeExists &&  activeLocations[w][z+1][y][x-1]) activeNeighborsCount++;
    if (                zAfterExists &&                                    activeLocations[w][z+1][y][x]) activeNeighborsCount++;
    if (                zAfterExists &&                  xAfterExists &&   activeLocations[w][z+1][y][x+1]) activeNeighborsCount++;
    
    //ZON
    if (                               yBeforeExists && xBeforeExists &&   activeLocations[w][z][y-1][x-1]) activeNeighborsCount++;
    if (                               yBeforeExists &&                    activeLocations[w][z][y-1][x]) activeNeighborsCount++;
    if (                               yBeforeExists && xAfterExists &&    activeLocations[w][z][y-1][x+1]) activeNeighborsCount++;

    if (                               yAfterExists && xBeforeExists &&    activeLocations[w][z][y+1][x-1]) activeNeighborsCount++;
    if (                               yAfterExists &&                     activeLocations[w][z][y+1][x]) activeNeighborsCount++;
    if (                               yAfterExists && xAfterExists &&     activeLocations[w][z][y+1][x+1]) activeNeighborsCount++;

    if (                                                xBeforeExists &&   activeLocations[w][z][y][x-1]) activeNeighborsCount++;
    if (                                                xAfterExists &&    activeLocations[w][z][y][x+1]) activeNeighborsCount++;

    return activeNeighborsCount;
}

const simulate = () => {
    let updatedWSpace = [];
    let updatedZSpace = [];
    let updatedYSpace = [];
    let updatedXSpace = [];
    padWZYXSpace();
    activeLocations.forEach((wSpaces, w) => {
        wSpaces.forEach((zSpaces, z) => {
            zSpaces.forEach((ySpaces, y) => {
                ySpaces.forEach((active, x) => {
                    const activeNeighborsCount = getActiveNeighbors(w, z, y, x);
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
        updatedWSpace.push(updatedZSpace);
        updatedZSpace = [];
    });
    activeLocations = updatedWSpace;
    trimWZYXSpace();
}

const runSixCycleBoot = () => {
    Array.from({length: 6}, (_, i) => simulate());
}

runSixCycleBoot();
console.log(wdepth, zdepth, ydepth, xdepth, area, volume, hypervol);
console.log(activeLocations.flat(4).reduce((sum, active) => active ? sum+1 : sum, 0));