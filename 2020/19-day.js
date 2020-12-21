const inputfile = './inputs/19-input.txt';
// const inputfile = './inputs/19-example.txt';
const processFile = require('./file-processor');


// PART I
const input1 = processFile(inputfile, {
    lineSeparator: new RegExp('\\n\\n', 'g'),
    groupSeparator: new RegExp('\\n', 'g')
});

let [rules, messages] = input1;
rules = rules.reduce((j, r) => {
    const ruleData = r.split(': ');
    const key = ruleData[0];
    const value = ruleData[1].replace(/"/g, '').split(/[|]/g).map(v => v.replace(/^\s|\s$/gm, '').split(/\s/g));
    j.set(key, value);
    return j;
}, new Map());

let finishedRules = [];
let unfinishedRules = [];
rules.forEach((value, key) => {
    if (value.flat().every(flatSpace => flatSpace === flatSpace.toString() && flatSpace.match(/^[a-z]+$/m))) {
        rules.set(key, value.flat());
        finishedRules.push(key);
    } else {
        unfinishedRules.push(key);
    }
});

function combineAndSpace(originalAndSpace) {
        const allCombined = originalAndSpace.reduce((prev, next) => {
            const combined = [];
            prev.forEach(f => {
                next.forEach(s => combined.push(f + s));
            });
            return combined;
        });
        return allCombined;
        // return [...new Set(allCombined)];
}

function combineOrSpace(originalOrSpace) {
    if (originalOrSpace.every(ele => Array.isArray(ele) && ele.every(val => !Array.isArray(val) && val.match(/^[a-z]+$/m)))) {
        originalOrSpace.splice(0, originalOrSpace.length, ...originalOrSpace.flat());
        return true;
    }
    return false;
}

function runMerge() {
    let newFinishedRules = [];
    finishedRules.forEach(finishedKey => {
        const fv = rules.get(finishedKey);
        let newUnfinishedRules = [];
        unfinishedRules.forEach(unfinishedKey => {
            const orSpace = rules.get(unfinishedKey);

            // go over all andspaces in the orspace
            orSpace.forEach((andSpace, a) => {
                // now check each ele in the andspace and replace it's found subrules
                andSpace.forEach((subrule, i) => {
                    // console.log(subrule, finishedKey);
                    if (subrule === subrule.toString() && subrule === finishedKey) { // Found rule with matching subrule
                        andSpace.splice(i, 1, fv); // replace it then with what's in the final value
                    }
                });
                // check if the new andspace can be merged up now
                if (andSpace.every(flatSpace => Array.isArray(flatSpace))) {
                    andSpace.splice(0, andSpace.length, ...combineAndSpace(andSpace));
                }
            });
            // now see if our new or space can be merged too
            if (combineOrSpace(orSpace)) {
                newFinishedRules.push(unfinishedKey);
            } else {
                newUnfinishedRules.push(unfinishedKey);
            }
        });
        unfinishedRules = [...newUnfinishedRules.splice(0)];
    });
    finishedRules = newFinishedRules;
}

while(unfinishedRules.length > 1) {
    runMerge();
}

const rule8 = rules.get('8');
const rule11 = rules.get('11');

const combined = [];
rule8.forEach(f => {
    rule11.forEach(s => combined.push(f + s));
});

const remainingMessage = [];
const result = messages.reduce((sum, message) => combined.some(rule => rule === message) ? sum+1 : (remainingMessage.push(message), sum), 0);
console.log(result);

const rule42 = rules.get('42');
const rule31 = rules.get('31');
rules.clear();

console.log('the crunching...', messages.length);
console.log('the final stretch', remainingMessage.length);
console.log('max in remanining', remainingMessage.reduce((s,m) => m.length > s ? m.length : s, 0));
console.log(
    '31max',rule31.reduce((a,b) => b.length > a ? b.length : a, 0),
    '31min',rule31.reduce((a,b) => b.length < a ? b.length : a, 99),
    '42max',rule42.reduce((a,b) => b.length > a ? b.length : a, 0),
    '42min',rule42.reduce((a,b) => b.length < a ? b.length : a, 99),
)

const result3 = remainingMessage.reduce((sum, message, j) => {
    let m = false;
    const eightBytes = message.match(/.{1,8}/g);
    const fullMatch = eightBytes.every((div, i) => {
        if (i === eightBytes.length-1) {
            m = rule31.some(v => div === v);
        } else if (i > eightBytes.length/2) {
            m = rule42.some(v => div === v) || rule31.some(v => div === v);
        } else {
            m = rule42.some(v => div === v);
        }
        return m;
        
    });
    if (fullMatch) console.log('found', j, new Date(), message.length, message);
    return fullMatch ? (sum+1) : sum;
}, 0);
console.log(result + result3);


// 8: 42 | 42 8
// 11: 42 31 | 42 11 31

// 42 ... 42 31
// 42 ... 42 31 31
// 42 42 31
// 42 42 42 31
// 42 42 42 42 31
// 42 42 42 31 31
// 42 42 42 42 42 31
// 42 42 42 42 31 31
// 42 42 42 42 42 42 31
// 42 42 42 42 42 31 31
// 42 42 42 42 31 31 31
// 42 42 42 42 42 42 42 31
// 42 42 42 42 42 42 31 31
// 42 42 42 42 42 31 31 31
// 42 42 42 42 42 42 42 42 31
// 42 42 42 42 42 42 42 31 31
// 42 42 42 42 42 42 31 31 31
// 42 42 42 42 42 31 31 31 31
// 42 42 42 42 42 42 42 42 42 31
// 42 42 42 42 42 42 42 42 31 31
// 42 42 42 42 42 42 42 31 31 31
// 42 42 42 42 42 42 31 31 31 31
// 42 42 42 42 42 42 42 42 42 42 31
// 42 42 42 42 42 42 42 42 42 31 31
// 42 42 42 42 42 42 42 42 31 31 31
// 42 42 42 42 42 42 42 31 31 31 31
// 42 42 42 42 42 42 31 31 31 31 31
// 42 42 42 42 42 42 42 42 42 42 42 31
// 42 42 42 42 42 42 42 42 42 42 31 31
// 42 42 42 42 42 42 42 42 42 31 31 31
// 42 42 42 42 42 42 42 42 31 31 31 31
// 42 42 42 42 42 42 42 31 31 31 31 31


// 42 42 11 31:               11 = 42 11 31
// 42 42 42 11 31 31:         11 = 42 11 31
// 42 42 42 42 11 31 31 31:   11 = 42 31
// 42 42 42 42 42 31 31 31 31

// 42 42 11 31:                     11 = 42 11 31
// 42 42 42 11 31 31:               11 = 42 11 31
// 42 42 42 42 11 31 31 31:         11 = 42 11 31
// 42 42 42 42 42 11 31 31 31 31:   11 = 42 31
// 42 42 42 42 42 42 31 31 31 31 31

// 42 42 11 31:               11 = 42 11 31
// 42 42 42 11 31 31:         11 = 42 31
// 42 42 42 42 31 31 31