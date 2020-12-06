const input = require('./inputs/3-input.json');
const factor = input[0].length;

// PART I
// Find tree trajectory for slope 3,1
const treesInTrajectory = input
    .map((r,i) => r[i*3%factor] === '#' ? 1 : 0)
    .reduce((t, a) => t+a);
console.log(`Trees in your trajectory with -1/3 slope: ${treesInTrajectory}`);

// PART II
// Find for other slopes and multiple together
/*

    Right 1, down 1.
    Right 3, down 1. (This is the slope you already checked.)
    Right 5, down 1.
    Right 7, down 1.
    Right 1, down 2.

*/
const slopes = [
    [1,1],
    [3,1],
    [5,1],
    [7,1],
    [1,2],
];
const resultsMultiplied = slopes.reduce((res, s) => {
    const treesInSlopeTrajectory = input
        .map((r, i) => (i%s[1] === 0 && r[i*s[0]/s[1]%factor] === '#') ? 1 : 0)
        .reduce((a, t) => t+a);
    console.log(`Slope:-${s[1]}/${s[0]}, Trees in trajectory:${treesInSlopeTrajectory}, Product:${res * treesInSlopeTrajectory}`);
    return treesInSlopeTrajectory * res;
}, 1);
console.log(`Tree trajectory in all slopes multiplied together: ${resultsMultiplied}`);