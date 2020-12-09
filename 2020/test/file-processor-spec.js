// SIMPLE TESTS --- NO FRAMEWORK
const fileProcessor = require('../file-processor');
const testFilePlainArray = './test-inputs/test-file-plain-array.txt';
const testFileArrayOfArray = './test-inputs/test-file-array-of-array.txt';
const testFileJson = './test-inputs/test-file-json.txt';
const testFileArrayOfJson = './test-inputs/test-file-array-of-json.txt';

const testFilePlainArrayExpected = require('./test-inputs/test-file-plain-array.json');
const testFileArrayOfArrayExpected = require('./test-inputs/test-file-array-of-array.json');
const testFileJsonExpected = require('./test-inputs/test-file-json.json');
const testFileArrayOfJsonExpected = require('./test-inputs/test-file-array-of-json.json');


function testProcessPlainArrayWithRegex() {
    const expected = testFilePlainArrayExpected;
    const actual = fileProcessor(testFilePlainArray, {
        lineSeparator: new RegExp('\\n', 'g'),
    });
    assertTrue(expected, actual);
}

function testProcessPlainArrayNoRegex() {
    const expected = testFilePlainArrayExpected;
    const actual = fileProcessor(testFilePlainArray, {
        lineSeparator: '\n',
    });
    assertTrue(expected, actual);
}

function testProcessArrayOfArrayWithRegex() {
    const expected = testFileArrayOfArrayExpected;
    const actual = fileProcessor(testFileArrayOfArray, {
        lineSeparator: new RegExp('\\n', 'g'),
        groupSeparator: new RegExp('\\s', 'g'),
    });
    assertTrue(expected, actual);
}

function testProcessArrayOfArrayNoRegex() {
    const expected = testFileArrayOfArrayExpected;
    const actual = fileProcessor(testFileArrayOfArray, {
        lineSeparator: '\n',
        groupSeparator: ' ',
    });
    assertTrue(expected, actual);
}

function testProcessJsonWithRegex() {
    const expected = testFileJsonExpected;
    const actual = fileProcessor(testFileJson, {
        lineSeparator: new RegExp('\n', 'g'),
        jsonSeparator: new RegExp(':', 'g')
    });
    assertTrue(expected, actual);
}

function testProcessArrayOfJsonWithRegex() {
    const expected = testFileArrayOfJsonExpected;
    const actual = fileProcessor(testFileArrayOfJson, {
        lineSeparator: new RegExp('\n', 'g'),
    });
    assertTrue(expected, actual);
}

// TESTS TO RUN
testProcessPlainArrayWithRegex();
testProcessPlainArrayNoRegex();
testProcessArrayOfArrayWithRegex();
testProcessArrayOfArrayNoRegex();
testProcessJsonWithRegex();



// SUPPORTING TEST FUNCTIONS
function assert(name, expected, actual, assertion) {
    if (assertion === compareJson(expected, actual)) {
        console.log(`${name}: PASSED`);
    } else {
        console.log(`${name}: FAILED`);
        console.log('Expected:', expected);
        console.log('Actual:', actual);
    }
}
function assertTrue(expected, actual) {
    assert(assertTrue.caller.name, expected, actual, true);
}
function assertFalse(expected, actual) {
    assert(assertFalse.caller.name, expected, actual, false);
}
function compareJson(json1, json2) {
    return JSON.stringify(json1) === JSON.stringify(json2);
}