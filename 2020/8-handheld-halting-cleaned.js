const processFile = require('./file-processor');
const inputfile = './inputs/8-input.txt';


// PART I
const input = processFile(inputfile);
const runProgram = (acc, index, arr) => {
    if (index === arr.length) return [acc, true]; // REACHED THE END, GRACEFULLY TERMINATE

    const op = arr[index][0];
    const val = parseInt(arr[index][1]);
    const rep = arr[index][2];

    if (rep === 1) return [acc, false]; // INFINITE LOOP FOUND! HALT!
    
    arr[index][2]++;
    switch (op) {
        case 'nop': return runProgram(acc, ++index, arr);
        case 'acc':
            acc += val;
            return runProgram(acc, ++index, arr);
        case 'jmp':
            index += val;
            return runProgram(acc, index, arr);
    }
}
const resultI = runProgram(0, 0, input);
console.log(`Accumulator value: ${resultI[0]}`);


// PART II
const input2 = processFile(inputfile);
const getArrayClone = (arr) => JSON.parse(JSON.stringify(arr));
const fixProgram = (arr) => {
    const index = arr.findIndex((instr, index) => {
        const cloneArr = getArrayClone(arr);
        switch (instr[0]) {
            case 'acc': return false;
            case 'jmp': cloneArr[index][0] = 'nop'; return runProgram(0, 0, cloneArr)[1];
            case 'nop': cloneArr[index][0] = 'jmp'; return runProgram(0, 0, cloneArr)[1];
            default: return runProgram(0, 0, cloneArr)[1];
        }
    });
    arr[index][0] = arr[index][0] === 'jmp' ? 'nop' : 'jmp'; // Fix the program
    return runProgram(0, 0, arr);
}
const resultII = fixProgram(input2);
console.log(`Accumulator value after fix: ${resultII[0]}`);