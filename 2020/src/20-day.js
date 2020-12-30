const inputFile = '../inputs/20-input.txt';
// const inputFile = '../inputs/20-example.txt';
const processFile = require('../common/file-processor');


// PART I
String.prototype.reverse = function() {
    return this.split('').reverse().join('');
}

const input1 = processFile(inputFile, {
    lineSeparator: new RegExp('\\n\\n', 'g'),
    mapSeparator: new RegExp(':\\n', 'g')
});

const edges = new Map();
const connections = new Map();
const centers = new Map();
const wholePieces = new Map();

const removeEdges = (originalStr) => {
    const rows = originalStr.split(/\n/);
    rows.shift();
    rows.pop();
    return rows.map((row, i) => row.substring(1, row.length-1).split(''));
}
const getEdges = (originalStr) => {
    const rows = originalStr.split(/\n/);
    const topEdge = rows[0];
    const bottomEdge = rows[rows.length-1];
    const leftEdge = rows.reduce((s,v) => s+v[0], '');
    const rightEdge = rows.reduce((s,v) => s+v[v.length-1], '');
    return [topEdge, rightEdge, bottomEdge, leftEdge];
}
input1.forEach((value, key) => {
    const id = key.replace(/[^\d]/g, '');
    edges.set(id, getEdges(value));
    wholePieces.set(id, value.split('\n').map(v => v.split('')));
    centers.set(id, removeEdges(value));
});


// For part1, we just need the corner pieces - all tiles with only 2 matching edges
// - Edges should be compared with every other tile's edges, forward and reverse
// - Collect the tiles that only have 2 matching edges
const corners = [];
edges.forEach((value1, key1) => {
    connections.set(key1, []);
    let nMatches = 0;
    edges.forEach((value2, key2) => {
        if (key1 !== key2) {
            value1.forEach((v1, i1) => {
                value2.forEach((v2, i2) => {
                    if (v1 === v2) {
                        connections.get(key1).push([key2, i1, i2, 0]);
                        nMatches++;
                    } else if (v1 === v2.reverse()) {
                        connections.get(key1).push([key2, i1, i2, 1]);
                        nMatches++;
                    }
                });
            });
        }
    });
    if (nMatches === 2) corners.push(key1);
});

console.log(corners);
console.log(corners.reduce((product, cornerTileId) => product * parseInt(cornerTileId), 1));


// PART 2
const getCornerLeftId = () => corners.find(corner => {
    const piece = connections.get(corner);
    const firstMatch = piece[0][1];
    const secondMatch = piece[1][1];
    return (firstMatch === 1 || firstMatch === 2) && (secondMatch === 1 || secondMatch === 2)
});
let cornerLeftId;
while (!(cornerLeftId = getCornerLeftId())) {
    corners.forEach(rotatePieceCW);
}
const arrangementPieceLocations = new Map();
arrangementPieceLocations.set(cornerLeftId, [0,0]);
let piecesToProcess = [cornerLeftId];
const squareLength = Math.sqrt(input1.size);
const arrangedPieces = Array.from({length: squareLength}, () => Array.from({length: squareLength}, () => 0));
arrangedPieces[0][0] = cornerLeftId;

// [topEdge, rightEdge, bottomEdge, leftEdge]
// ["1831","1699","2309","2789",]
while (piecesToProcess.length) {
    const newPiecesToProcess = [];
    piecesToProcess.forEach((pieceId) => {
        const pieceConnections = connections.get(pieceId);
        pieceConnections.forEach((connection) => {
            const connectorPieceId = connection[0];
            if (!arrangedPieces.flat().some(id => id === connectorPieceId)) {
                newPiecesToProcess.push(connectorPieceId); // Add it to the next process

                const connectionEdge = connection[1];
                const connectorEdge = connection[2];
                const connectorReversed = connection[3];
    
                const edgeDiff = Math.abs(connectorEdge - connectionEdge);
                const phaseDiff = edgeDiff % 2;
                
                // Apply flip if already noted
                if (connectorReversed) {
                    if (connectorEdge === 0 || connectorEdge === 2) {
                        flipPieceHorizontally(connectorPieceId);
                    } else {
                        flipPieceVertically(connectorPieceId);
                    }
                }
    
                if (phaseDiff === 0) {
                    if (edgeDiff === 0) {
                        if (connectionEdge === 0 || connectionEdge === 2) {
                            flipPieceVertically(connectorPieceId);
                        } else {
                            flipPieceHorizontally(connectorPieceId);
                        }
                    } else if (edgeDiff === 2) {
                        //do nothing - the piece is already oriented correctly
                    }
                } else if (phaseDiff === 1) {
                    if ((connectionEdge===0 && connectorEdge===1) || (connectionEdge===1 && connectorEdge===0) 
                        || (connectionEdge===2 && connectorEdge===3) || (connectionEdge===3 && connectorEdge===2)) {
                        rotatePieceCW(connectorPieceId);
                        flipPieceHorizontally(connectorPieceId);
                    } else if ((connectionEdge===1 && connectorEdge===2) || (connectionEdge===3 && connectorEdge===0)) {
                        rotatePieceCW(connectorPieceId);
                    } else if ((connectionEdge===2 && connectorEdge===1) || (connectionEdge===0 && connectorEdge===3)) {
                        rotatePieceCCW(connectorPieceId);
                    }
                }
    
                const [y, x] = arrangementPieceLocations.get(pieceId);
                const y2 = y + (connectionEdge===0 ? -1 : connectionEdge===2 ? 1 : 0);
                const x2 = x + (connectionEdge===3 ? -1 : connectionEdge===1 ? 1 : 0);
                arrangedPieces[y2][x2] = connectorPieceId;
                arrangementPieceLocations.set(connectorPieceId, [y2, x2]);
            }
        });
    });
    piecesToProcess = newPiecesToProcess;
}

printWholeArrangement();
printCenters();

/*
                  # 
#    ##    ##    ###
 #  #  #  #  #  #   

as a regex:
    .{18}#                        ---> gives an index to use as padding
    #.{4}##.{4}##.{4}###
    .#.{2}#.{2}#.{2}#.{2}#.{2}#
*/

// get the whole image as a matrix
const image = [];
arrangedPieces.forEach(row => {
    for (let i = 0; i<8; i++) {
        let wholeRow = [];
        row.forEach(id => {
            if (id) {
                const center = centers.get(id);
                wholeRow.push(center[i]);
            }
        });
        image.push(wholeRow.flat());
    }
});

const seaMonsterHeadRegex = new RegExp('.{18}#');
const seaMonsterTailRegex = new RegExp('#.{4}##.{4}##.{4}###');
const seaMonsterBodyRegex = new RegExp('.#.{2}#.{2}#.{2}#.{2}#.{2}#');

console.log('IMAGE');
console.log(image.map(v => v.join('')).join('\n'));

let seaMonsterCount = 0;
const findSeaMonsters = () => {
    Array.from({length: 4}, () => {
        for (let i=0; i<image.length-2; i++) {
            let head = image[i].join('');
            let tail = image[i+1].join('');
            let body = image[i+2].join('');
        
            let headStr = head;
            let tailStr = tail;
            let bodyStr = body;
        
            let headMatch;
            let headIndex;
            let padding = 0;

            while((headIndex = headStr.search(seaMonsterHeadRegex)) > -1) {
                headMatch = headStr.match(seaMonsterHeadRegex)[0];
                padding += headIndex;
                tailStr = tail.substring(padding, padding+20);
                let tailIndex = tailStr.search(seaMonsterTailRegex);
                if (tailIndex > -1) {
                    bodyStr = body.substring(padding, padding+17);
                    let bodyIndex = bodyStr.search(seaMonsterBodyRegex);
                    if (bodyIndex > -1) {
                        seaMonsterCount++;
                    }
                }
                padding++;
                headStr = head.substring(padding);
            }
        }
        console.log(seaMonsterCount);
        rotateClockwise(image);
    });
}

findSeaMonsters();
flipVertically(image);
findSeaMonsters();
flipVertically(image);
flipHorizontally(image);
findSeaMonsters();
flipHorizontally(image);

const roughness = image.reduce((total, row) => total + row.reduce((subtotal, chars) => chars === '#' ? subtotal+1 : subtotal, 0), 0);
console.log('roughness', roughness);
console.log(roughness - 15*seaMonsterCount);


// PRINT FUNCTIONS
function printCenters() {
    console.log('CENTERS\n');
    arrangedPieces.forEach(row => {
        for (let i = 0; i<8; i++) {
            let allRow = ''
            row.forEach(id => {
                if (id) {
                    const center = centers.get(id);
                    allRow += ' '+center[i].join('');
                }
            })
            if (allRow) console.log(allRow);
        }
        console.log();
    });
}
function printWholeArrangement() {
    console.log('WHOLE\n');
    arrangedPieces.forEach(row => {
        for (let i = 0; i<10; i++) {
            let allRow = ''
            row.forEach(id => {
                if (id) {
                    const center = wholePieces.get(id);
                    allRow += ' '+center[i].join('');
                }
            })
            if (allRow) console.log(allRow);
        }
        console.log();
    });
}

// HELPER FUNCTIONS
function rotatePieceCW(id) {
    const pieceConnections = connections.get(id);
    const pieceCenter = centers.get(id);
    const pieceWholes = wholePieces.get(id);
    const pieceEdges = edges.get(id);

    pieceConnections.forEach(connection => { // rotate connections
        connection[3] = connection[1] === 1 || connection[1] === 3 ? (connection[3]+1)%2 : connection[3];
        connection[1] = (connection[1]+1)%4;
    });
    rotateClockwise(pieceWholes); // rotate center
    rotateClockwise(pieceCenter); // rotate center
    pieceEdges.unshift(pieceEdges.pop()); // rotate edges
    pieceEdges[0] = pieceEdges[0].reverse();
    pieceEdges[2] = pieceEdges[2].reverse();
}
function rotatePieceCCW(id) {
    const pieceConnections = connections.get(id);
    const pieceCenter = centers.get(id);
    const pieceWholes = wholePieces.get(id);
    const pieceEdges = edges.get(id);

    pieceConnections.forEach(connection => { // rotate connections
        connection[3] = connection[1] === 0 || connection[1] === 2 ? (connection[3]+1)%2 : connection[3];
        connection[1] = (connection[1]+3)%4;
    });
    rotateCounterClockwise(pieceWholes); // rotate whole piece
    rotateCounterClockwise(pieceCenter); // rotate center
    pieceEdges.push(pieceEdges.shift()); // rotate edges
    pieceEdges[1] = pieceEdges[1].reverse();
    pieceEdges[3] = pieceEdges[3].reverse();
}
function flipPieceHorizontally(id) {
    const pieceConnections = connections.get(id);
    const pieceCenter = centers.get(id);
    const pieceWholes = wholePieces.get(id);
    const pieceEdges = edges.get(id);

    pieceConnections.forEach(connection => { // flip connections
        connection[3] = connection[1] === 0 || connection[1] === 2 ? (connection[3]+1)%2 : connection[3];
        connection[1] = connection[1] === 1 || connection[1] === 3 ? (connection[1]+2)%4 : connection[1];
    });
    pieceWholes.splice(0, pieceWholes.length, ...pieceWholes.map(r => r.reverse()));
    pieceCenter.splice(0, pieceCenter.length, ...pieceCenter.map(r => r.reverse()));
    [pieceEdges[1], pieceEdges[3]] = [pieceEdges[3], pieceEdges[1]]; // flip edges
}
function flipPieceVertically(id) {
    const pieceConnections = connections.get(id);
    const pieceCenter = centers.get(id);
    const pieceWholes = wholePieces.get(id);
    const pieceEdges = edges.get(id);

    pieceConnections.forEach(connection => { // flip connections
        connection[3] = connection[1] === 1 || connection[1] === 3 ? (connection[3]+1)%2 : connection[3];
        connection[1] = connection[1] === 0 || connection[1] === 2 ? (connection[1]+2)%4 : connection[1];
    });
    pieceWholes.splice(0, pieceWholes.length, ...pieceWholes.reverse()); // flip center pieces
    pieceCenter.splice(0, pieceCenter.length, ...pieceCenter.reverse()); // flip center pieces
    [pieceEdges[0], pieceEdges[2]] = [pieceEdges[2], pieceEdges[0]]; // flip edges
}


function flipHorizontally(matrix) {
    matrix.splice(0, matrix.length, ...matrix.map(r => r.reverse()));
}
function flipVertically(matrix) {
    matrix.splice(0, matrix.length, ...matrix.reverse());
}
function rotateClockwise(matrix) {
    matrix = matrix.reverse();
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < i; j++) {
            var temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }
}
function rotateCounterClockwise(matrix) {
    matrix = matrix.map(row => row.reverse());
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < i; j++) {
            var temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }
}