const inputfile = './inputs/13-input.txt';
// const inputfile = './inputs/13-example.txt';
const processFile = require('./file-processor');


// PART I
const input1 = processFile(inputfile, {
    lineSeparator: new RegExp('\\n', 'g'),
    groupSeparator: new RegExp(',', 'g'),
});

const timestamp = parseInt(input1.shift());
const ids = input1.flat().filter(id => id !== 'x').map(Number);
const earliestBusIdData = ids
    .map(id => [id, id * Math.ceil(timestamp / id) - timestamp])
    .sort((a, b) => a[1] - b[1])[0];
const result1 = earliestBusIdData[0] * earliestBusIdData[1];

console.log('Your timestamp:', timestamp);
console.log('Answer:', result1);



// PART II
const input2 = input1.flat().map((id, index) => [index, parseInt(id)]).filter(data => !isNaN(data[1]));
console.log(input2);

const a = input2[0];
const b = input2[1];

console.log(a[1], -a[0], b[1], -b[0]);

console.log(arrowAlignment(a[1], -a[0], b[1], -b[0]));


function arrowAlignment(a, aAdv, b, bAdv) {
    const [period, phase] = combinedPhaseRotation(a, -aAdv % a, b, -bAdv % b);
    return [period, phase];
}

function combinedPhaseRotation(aPeriod, aPhase, bPeriod, bPhase) {
    const [gcd, s, t] = extendedGCD(aPeriod, bPeriod);
    const paseDiff = aPhase - bPhase;
    const pdMult = Math.floor(paseDiff / gcd);
    const pdRemainder = paseDiff % gcd;

    if (pdRemainder) throw 'Rotation reference points never synchronize.';

    const combinedPeriod = Math.floor(aPeriod / gcd) * bPeriod;
    const combinedPhase = (aPhase - s * pdMult * aPeriod) % combinedPeriod;
    console.log(aPhase, s, pdMult, aPeriod, combinedPeriod);
    return [combinedPeriod, combinedPhase];
}

function extendedGCD(a, b) {
    let [old_r, r] = [a, b];
    let [old_s, s] = [1, 0];
    let [old_t, t] = [0, 1];
    while(r) {
        let quotient = Math.floor(old_r / r);
        let remainder = old_r % r;
        old_r = r;
        r = remainder;
        old_s = s;
        s = old_s - quotient * s;
        old_t = t;
        t = old_t - quotient * t;
    }
    return [old_r, old_s, old_t];
}

// def combine_phased_rotations(a_period, a_phase, b_period, b_phase):
//     """Combine two phased rotations into a single phased rotation

//     Returns: combined_period, combined_phase

//     The combined rotation is at its reference point if and only if both a and b
//     are at their reference points.
//     """
//     gcd, s, t = extended_gcd(a_period, b_period)
//     phase_difference = a_phase - b_phase
//     pd_mult, pd_remainder = divmod(phase_difference, gcd)
//     if pd_remainder:
//         raise ValueError("Rotation reference points never synchronize.")

//     combined_period = a_period // gcd * b_period
//     combined_phase = (a_phase - s * pd_mult * a_period) % combined_period
//     return combined_period, combined_phase


// def arrow_alignment(red_len, green_len, advantage):
//     """Where the arrows first align, where green starts shifted by advantage"""
//     period, phase = combine_phased_rotations(
//         red_len, 0, green_len, -advantage % green_len
//     )
//     return -phase % period


// def extended_gcd(a, b):
//     old_r, r = a, b
//     old_s, s = 1, 0
//     old_t, t = 0, 1
//     while r:
//         quotient, remainder = divmod(old_r, r)
//         old_r, r = r, remainder
//         old_s, s = s, old_s - quotient * s
//         old_t, t = t, old_t - quotient * t

//     return old_r, old_s, old_t

/*

    - bus  7: y1 = 7a
    - bus 13: y2 = 13b
    - bus 59: y3 = 59c
    - bus 31: y4 = 31d
    - bus 19: y5 = 19e


    let's take just the first two:
    y1 = 7a and y2 = 13b

    how do they relate?

    well we know that the distance between the two buses at iteration 1 will be just the difference in IDs:
    so, at iter1, bus7 will be at 7 and bus13 will be at 13, giving a difference of 13-7=6

    now in the next iteration we notice this behavior:
    iter2, bus7 will be at 14 and bus13 will be at 26, giving a difference of 26-14=12

    the pattern observed is that the difference increases after each iteration, i.e. the difference
    between any two buses at a given iteration is the difference of their bus IDs times the iteration count.
    so, ∆i = (busID2 - busID1)*i

    but there is something still wrong here. let's take a closer look at what's happening in the iterations:
    | iter | bus7 | bus13 |
    | 1    | 7    | 13    |
    | 2    | 14   | 26    |
    | 3    | 21   | 39    |
    | 4    | 28   | 52    |

    as you can see, in reality, the distance should be calculated between the nearest other bus' timestamp

    we conclude that this approach will not work.

    in actuality, we want the ∆, such that the difference in timestamps is relative position in the input list.
    so, using the starting equations, we want ∆y = y2-y1 = 1 = 13b-7a for any given integer value of a and b
    rearranging this gives us 13b=7a+1 and we want the values of a and b that this holds true


*/