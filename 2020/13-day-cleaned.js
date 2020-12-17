const inputfile = './inputs/13-input.txt';
// const inputfile = './inputs/13-example.txt';
const processFile = require('./file-processor');


// PART I
const input1 = processFile(inputfile, {
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

const period_and_phase = input2.reduce((cmb_period_and_phase, next_period_and_phase) => {
    return arrowAlignment(
        cmb_period_and_phase[1],
        -cmb_period_and_phase[0],
        next_period_and_phase[1],
        -next_period_and_phase[0]
    );
});

console.log(period_and_phase, period_and_phase[1] - period_and_phase[0]);

function mod(a, b) {
    const [quo, mod] = divmod(a, b);
    return mod;
}

function divmod(a, b) {
    const part = a / b;
    const quo = a%b===0n ? part : (a<0n && b>0n) || (a>0n && b<0n) ? part - 1n : part;
    const raw = quo * b - a
    const mod = raw < 0n ? -raw : raw;
    return [quo, mod];
}

function arrowAlignment(a, aAdv, b, bAdv) {
    const [phase, period] = combinedPhaseRotation(a, mod(-aAdv, a), b, mod(-bAdv, b));
    return [period, phase];
}

function combinedPhaseRotation(aPeriod, aPhase, bPeriod, bPhase) {
    const [gcd, s, t] = extendedGCD(aPeriod, bPeriod);
    const paseDiff = aPhase - bPhase;
    const [pdMult, pdRemainder] = divmod(paseDiff, gcd);

    if (pdRemainder) throw 'Rotation reference points never synchronize.';

    const part = aPeriod / gcd;
    const quo = aPeriod%gcd===0n ? part : (aPeriod<0n && gcd>0n) || (aPeriod>0n && gcd<0n) ? part - 1n : part;

    const combinedPeriod = part * bPeriod;
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