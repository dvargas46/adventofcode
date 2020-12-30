const fs = require('fs');
const file = '../inputs/6-input.txt';
// const file = '../inputs/6-example.txt';

// PART I
const input = processFilePartI(file);
const result1 = input.map(custom => {
        return custom.length;
    })
    .reduce((a,n) => a+n);
console.log(result1);

// PART II
const input2 = processFilePartII(file);
const result2 = input2.map(x => {
    const m = x.length;
    const r = {};
    x.forEach(o => {
        // console.log(p);
        o.forEach(p => {
            r[p] = r[p]===undefined ? 1 : r[p]+1;
        });
    });
    // return r
    return Object.keys(r).reduce((a,b) => {
        return r[b] === m ? a+1 : a;
    }, 0);
});
// console.log(input2);
console.log(result2.reduce((a,c) => a+c));


function processFilePartI(file) {
    let rawText = fs.readFileSync(file, 'utf8');
    const customsSep = new RegExp("\n\n", 'g');
    const rowSep = new RegExp("\n", 'g');

    const parsedJson = rawText
        .split(customsSep)
        .map(passport => [...new Set(passport.split(rowSep).map(custom => custom.split('')).flat())]);

    return parsedJson;
}

function processFilePartII(file) {
    let rawText = fs.readFileSync(file, 'utf8');
    const customsSep = new RegExp("\n\n", 'g');
    const rowSep = new RegExp("\n", 'g');

    const parsedJson = rawText
        .split(customsSep)
        .map(passport => passport.split(rowSep).map(custom => custom.split('')));

    return parsedJson;
}