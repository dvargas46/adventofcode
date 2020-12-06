const fs = require('fs');
const file = './inputs/6-input.txt';

// PART I
const input = processFile(file);
const result1 = input
    .map(custom => [...new Set(custom.flat())])
    .map(custom => custom.length)
    .reduce((a,n) => a+n);
console.log(`Number of answered: ${result1}`);


// PART II
const result2 = input
    .map(groups => {
        const numOfPeople = groups.length;
        const charFrequencyMap = {};
        groups.forEach(answers => answers.forEach(ans => charFrequencyMap[ans] = charFrequencyMap[ans] === undefined ? 1 : charFrequencyMap[ans]+1));
        return Object.keys(charFrequencyMap).reduce((tot, char) => {
            return charFrequencyMap[char] === numOfPeople ? tot+1 : tot;
        }, 0);
    })
    .reduce((a, v) => a+v);
console.log(`Number of proper answers: ${result2}`);

// file processing
function processFile(file) {
    let rawText = fs.readFileSync(file, 'utf8');
    const customSep = new RegExp("\n\n", 'g');
    const rowSep = new RegExp("\n", 'g');

    const parsedJson = rawText
        .split(customSep)
        .map(passport => passport
            .split(rowSep)
            .map(custom => custom.split(''))
        );

    return parsedJson;
}