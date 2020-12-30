// const input = require('../inputs/9-example.json');
const input = require('../inputs/9-input.json');

MAX_PREAMBLE = 25;

const bad_num = input.find((num, index) => {
    if (index < MAX_PREAMBLE) return false;

    const previous = input.slice(index-MAX_PREAMBLE, index+MAX_PREAMBLE);
    // console.log(previous);

    return !previous.some(prevNum1 => {
        return previous.some(prevNum2 => (prevNum1 !== prevNum2) && (prevNum1 + prevNum2) === num);
    });
});

console.log(bad_num);

// PART II
let result = [];
input.forEach((num, index) => {
    const index2 = Array.from({length: input.length-index}, (_, i) => {
        const attempt = i+index+2;
        const remaining = input.slice(index, attempt);
        // console.log(remaining);
        if (remaining.reduce((a,o) => a+o) === bad_num) console.log(remaining, remaining.reduce((a,o) => a+o));

        if (remaining.reduce((a,o) => a+o) === bad_num) {
            const rem = remaining.sort((a,b)=>a-b);
            console.log(rem);
            console.log(rem[0] +rem[rem.length-1]);
        }

        return remaining.reduce((a,o) => a+o) === bad_num;
    })
    .findIndex(a=>a);
    // if (index2 > -1) console.log(index2);

    if (index2 > -1) result = input.slice(index, index2);
});

console.log(result);