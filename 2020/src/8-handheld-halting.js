const fs = require('fs');
// const inputFile = '../inputs/8-example.txt';
const inputFile = '../inputs/8-input.txt';


// PART I
const input = processFile(inputFile);
const findInfiniteLoopValue = (acc, index, arr) => {
    // console.log(acc, index, arr);
    if (index === arr.length) // REACHED THE END, GRACEFULLY TERMINATE
        return [acc, true];

    const op = arr[index][0];
    const val = parseInt(arr[index][1]);
    const rep = arr[index][2];

    if (rep === 1) // INFINITE LOOP FOUND! HALT!
        return [acc, false];
    
    arr[index][2]++;
    switch (op) {
        case 'nop': {
            return findInfiniteLoopValue(acc, ++index, arr);
        }
        case 'acc': {
            acc += val;
            return findInfiniteLoopValue(acc, ++index, arr);
        }
        case 'jmp': {
            index += val;
            return findInfiniteLoopValue(acc, index, arr);
        }
    }
}
const resultI = findInfiniteLoopValue(0, 0, input);
console.log(`Accumlator value: ${resultI}`);



// PART II
const input2 = processFile(inputFile);
const getArrayClone = (arr) => JSON.parse(JSON.stringify(arr));
const fixProgram = (arr) => {
    const index = arr.findIndex((instr, index) => {
        switch (instr[0]) {
            case 'acc': {
                return false;
            }
            case 'jmp': {
                const cloneArr = getArrayClone(arr);
                cloneArr[index][0] = 'nop';
                // console.log(arr, cloneArr, cloneArr[index][0], 'nop', index);
                // console.log(findInfiniteLoopValue(0, 0, cloneArr));
                return findInfiniteLoopValue(0, 0, cloneArr)[1];
            }
            case 'nop': {
                const cloneArr = getArrayClone(arr);
                cloneArr[index][0] = 'jmp';
                // console.log(arr, cloneArr, cloneArr[index][0], 'jmp', index);
                // console.log(findInfiniteLoopValue(0, 0, cloneArr));
                return findInfiniteLoopValue(0, 0, cloneArr)[1];
            }
        }
    });
    
    arr[index][0] = arr[index][0] === 'jmp' ? 'nop' : 'jmp';
    return findInfiniteLoopValue(0, 0, arr);
}
const resultII = fixProgram(input2);
console.log(resultII);


// file processing
function processFile(file) {
    let rawText = fs.readFileSync(file, 'utf8');
    const rowSep = new RegExp("\\n", 'g');
    const lineSep = new RegExp("\\s\\+|\\s", 'g');

    const parsedJson = rawText
        .split(rowSep)
        .map(row => row.split(lineSep).concat([0]));

    return parsedJson;
}