const inputFile = './inputs/13-input.txt';
// const inputFile = './inputs/13-example.txt';
const processFile = require('./file-processor');


// PART I
const input1 = processFile(inputFile, {
    lineSeparator: new RegExp('\\n', 'g'),
    groupSeparator: new RegExp(',', 'g'),
});

const timestamp = BigInt(input1.shift());
const ids = input1.flat().filter(id => id !== 'x').map(BigInt);
const earliestBusIdData = ids
    .map(id => [id, id * (timestamp / id + 1n) - timestamp])
    .sort((a, b) => parseInt(a[1] - b[1]))[0];
const result1 = earliestBusIdData[0] * earliestBusIdData[1];

console.log('Your timestamp:', timestamp);
console.log('Answer:', result1);



// PART II
const input2 = input1.flat().map((id, index) => [index, id]).filter(data => !isNaN(data[1])).map(data => [BigInt(data[0]), BigInt(data[1])]);
console.log(input2);

const periodAndPhase = input2.reduce((combinedPeriodAndPhase, nextPeriodAndPhase) => {
    return combinePeriodAndPhase(
        combinedPeriodAndPhase[1],
        -combinedPeriodAndPhase[0],
        nextPeriodAndPhase[1],
        -nextPeriodAndPhase[0]
    );
});

console.log('Combined period and phase:', periodAndPhase)
console.log('Answer:', periodAndPhase[1] - periodAndPhase[0]);

// Python modulus
function mod(a, b) {
    const [quo, mod] = divmod(a, b);
    return mod;
}

// Python divmod
function divmod(a, b) {
    const part = a / b;
    const quo = a%b===0n ? part : (a<0n && b>0n) || (a>0n && b<0n) ? part - 1n : part;
    const raw = quo * b - a
    const mod = raw < 0n ? -raw : raw;
    return [quo, mod];
}

// Below functions are found here: https://math.stackexchange.com/questions/2218763/how-to-find-lcm-of-two-numbers-when-one-starts-with-an-offset#comment8142700_3864593
// The code was originally in Python, which I converted over to es6 along with the Python divmod/mod functions above
// NOTE: These functions utilize BigInt parameters in order to work properly with large integers greater than 2^53-1
function combinePeriodAndPhase(a, aAdv, b, bAdv) {
    const [period, phase] = combinedPhaseRotation(a, mod(-aAdv, a), b, mod(-bAdv, b));
    return [phase, period];
}

function combinedPhaseRotation(aPeriod, aPhase, bPeriod, bPhase) {
    const [gcd, s, t] = extendedGCD(aPeriod, bPeriod);
    const paseDiff = aPhase - bPhase;
    const [pdMult, pdRemainder] = divmod(paseDiff, gcd);

    if (pdRemainder) throw 'Rotation reference points never synchronize.';

    const [quotient, remainder] = divmod(aPeriod, gcd);
    const combinedPeriod = quotient * bPeriod;
    const combinedPhase = mod((aPhase - s * pdMult * aPeriod), combinedPeriod);
    return [combinedPeriod, combinedPhase];
}

function extendedGCD(a, b) {
    let [old_r, r] = [a, b];
    let [old_s, s] = [1n, 0n];
    let [old_t, t] = [0n, 1n];
    while(r) {
        let [quotient, remainder] = divmod(old_r, r);
        let new_s, new_t;
        old_r = r;
        r = remainder;
        new_s = old_s - quotient * s;
        old_s = s;
        s = new_s;
        new_t = old_t - quotient * t;
        old_t = t;
        t = new_t;
    }
    return [old_r, old_s, old_t];
}