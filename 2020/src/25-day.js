const inputFile = '../inputs/25-input.txt';
// const inputFile = '../inputs/25-example.txt';
const processFile = require('../common/file-processor');

const SUBJECT = 7;
const rem = 20201227;

// PART I
const input1 = processFile(inputFile, {lineSeparator: new RegExp('\\n', 'g')});
const cardPublicKey = parseInt(input1[0]);
const doorPublicKey = parseInt(input1[1]);

const findSecretLoopNumber = (publicKey) => {
    let counter = 0;
    let value = 1;
    while(value !== publicKey) {
        counter++;
        value = value * SUBJECT;
        value = value % rem;
    }
    return counter;
}

const transformSubject = (key, loopSize) => {
    let counter = 0;
    let value = 1;
    while(counter < loopSize) {
        counter++;
        value = value * key;
        value = value % rem;
    }
    return value;
}

const cardSecretLoopSize = findSecretLoopNumber(cardPublicKey);
console.log(cardSecretLoopSize);
const doorSecretLoopSize = findSecretLoopNumber(doorPublicKey);
console.log(doorSecretLoopSize);
const encrpytion = transformSubject(doorPublicKey, cardSecretLoopSize);
console.log(encrpytion);