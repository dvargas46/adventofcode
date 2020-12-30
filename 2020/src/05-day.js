/*
    airline uses binary space partitioning to seat people. A seat might be specified like FBFBBFFRLR, where F means "front", B means "back", L means "left", and R means "right".

    The first 7 characters will either be F or B; these specify exactly one of the 128 rows on the plane (numbered 0 through 127). Each letter tells you which half of a region the given seat is in. Start with the whole list of rows; the first letter indicates whether the seat is in the front (0 through 63) or the back (64 through 127). The next letter indicates which half of that region the seat is in, and so on until you're left with exactly one row.

    The first 7 characters will either be F or B; these specify exactly one of the 128 rows on the plane (numbered 0 through 127). Each letter tells you which half of a region the given seat is in.

    The last three characters will be either L or R; these specify exactly one of the 8 columns of seats on the plane (numbered 0 through 7). The same process as above proceeds again, this time with only three steps. L means to keep the lower half, while R means to keep the upper half.

    So, decoding FBFBBFFRLR reveals that it is the seat at row 44, column 5.

    Every seat also has a unique seat ID: multiply the row by 8, then add the column. In this example, the seat has ID 44 * 8 + 5 = 357.

    BFFFBBFRRR: row 70, column 7, seat ID 567.
    FFFBBBFRRR: row 14, column 7, seat ID 119.
    BBFFBBFRLL: row 102, column 4, seat ID 820.

*/

const input = require('../inputs/5-input.json');
// const input = ['BFFFBBFRRR','FFFBBBFRRR','BBFFBBFRLL'];

const boardingPassMapper = (boardingPass) => {
    if (boardingPass.length !== 10) {
        console.log(`Length criteria not met! ${boardingPass}`);
        process.exit(0);
    }
    const FBParts = boardingPass.substr(0,7).split('');
    const RLParts = boardingPass.substr(7,10).split('');

    const row = FBParts.reduce(FBPartMapper, [0, 127]);
    const col = RLParts.reduce(RLPartMapper, [0, 7]);
    const location = [row[0], col[0]];
    // console.log(boardingPass, location);
    return location;
};
const FBPartMapper = (range, FBPart) => {
    const half = (range[1]-range[0]+1)/2;
    // console.log(range, FBPart, half);
    return FBPart === 'F' ? [range[0], range[1]-half] : [range[0]+half, range[1]];
};
const RLPartMapper = (range, RLPart) => {
    const half = (range[1]-range[0]+1)/2;
    // console.log(range, RLPart, half);
    return RLPart === 'L' ? [range[0], range[1]-half] : [range[0]+half, range[1]];
};
const uniqueIdMapper = (rowCol) => {
    const uniqueId = rowCol[0] * 8 + rowCol[1];
    // console.log(rowCol, uniqueId);
    return uniqueId;
};
const maxId = (max, uniqueId) => {
    return uniqueId >= max ? uniqueId : max;
}

// PART I
const resultPartI = input
    .map(boardingPassMapper)
    .map(uniqueIdMapper)
    .reduce(maxId, 0);
console.log(`Highest unique ID: ${resultPartI}`);

// PART II
const comparisonSorter = (first, second) => {
    if (first[0] > second[0]) {
        return 1;
    } else if (first[0] < second[0]) {
        return -1;
    } else if (first[1] > second[1]) {
        return 1;
    } else if (first[1] < second[1]) {
        return -1;
    } else {
        return 0;
    }
};


const sortedLocations = input
    .map(boardingPassMapper)
    .sort(comparisonSorter);

// CLEAN THIS UP, IT'S BASICALLY NON-FUNCTIONAL HERE....
let resultPartII = [0,0];
sortedLocations.forEach((location, index, orig) => {
    if(orig[index-1] && orig[index+1]) {
        const row = location[0];
        const col = location[1];
        const before = orig[index-1];
        const after = orig[index+1];
        const beforeRow = col === 0 ? row-1 : row;
        const beforeCol = col === 0 ? 7 : col-1;
        const afterRow = col === 7 ? row+1 : row;
        const afterCol = col ===7 ? 0 : col+1;

        if (before[0] !== beforeRow || before[1] !== beforeCol) {
            // console.log(before, [beforeRow, beforeCol], location, after);
            resultPartII = [beforeRow, beforeCol];
        }

        if (after[0] !== afterRow || after[1] !== afterCol) {
            // console.log(after, [afterRow, afterCol], location, before);
            resultPartII = [afterRow, afterCol];
        }
    }
});
resultPartII = resultPartII[0] * 8 + resultPartII[1];
console.log(`Your id is: ${resultPartII}`);