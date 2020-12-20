// const inputfile = './inputs/19-input.txt';
const inputfile = './inputs/19-example.txt';
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
console.log(rules);

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
// console.log(rules, finishedRules, unfinishedRules);

function combineAndSpace(originalAndSpace) {
        const allCombined = originalAndSpace.reduce((prev, next) => {
            const combined = [];
            prev.forEach(f => {
                next.forEach(s => combined.push(f + s));
                next.reverse().forEach(s => combined.push(f+s));
            });
            return combined;
        });

        // const allCombined = [];


        return [...new Set(allCombined)];
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
                    // console.log(andSpace);
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
    // console.log(rules);
}

while(unfinishedRules.length) {
    runMerge();
    console.log(rules);
}

// runMerge();
// runMerge();
// runMerge();
// runMerge();
// runMerge();
// runMerge();
// runMerge();
// runMerge();
// runMerge();


// rules.forEach((value, key) => {
//     console.log(key, value);
// });
console.log('fr',finishedRules, 'ur',unfinishedRules);



// const rule0 = rules.get('0');
// rule0[0][1] = rules.get('1');
// console.log('rule0',rule0);
// const allCombined = rule0.flat().reduce((prev, next) => {
//     const combined = [];
//     prev.forEach(f => {
//         next.forEach(s => combined.push(f + s));
//         next.reverse().forEach(s => combined.push(f+s));
//     });
//     return combined;
// });
// rules.set('0', [...new Set(allCombined)]);
console.log(rules.get('0'), messages);

const result = messages.reduce((sum, message) => rules.get('0').some(rule => rule === message) ? sum+1 : sum, 0);
console.log(result);
// process.exit(0);




// const rule8 = rules.get('8');
// const rule11 = rules.get('11');
// console.log(rules.get('0'), rule8, rule11);

// const combined = [];
// rule8.forEach(f => {
//     rule11.forEach(s => combined.push(f + s));
//     // rule11.reverse().forEach(s => combined.push(f+s));
// });
// rules.set('0', [...new Set(combined)]);
// console.log(rules.get('0'), messages);

// const result = messages.reduce((sum, message) => rules.get('0').some(rule => rule === message) ? sum+1 : sum, 0);
// console.log(result);