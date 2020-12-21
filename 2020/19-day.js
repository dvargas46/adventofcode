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
// console.log(rules);

let finishedRules = [];
let unfinishedRules = [];
// let myMap = new Map();
rules.forEach((value, key) => {
    if (value.flat().every(flatSpace => flatSpace === flatSpace.toString() && flatSpace.match(/^[a-z]+$/m))) {
        rules.set(key, value.flat());
        finishedRules.push(key);
        // myMap.set(key, value.flat());
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
                // next.reverse().forEach(s => combined.push(f+s));
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
                // myMap.set(unfinishedKey, orSpace);
            } else {
                newUnfinishedRules.push(unfinishedKey);
            }
        });
        unfinishedRules = [...newUnfinishedRules.splice(0)];
    });
    finishedRules = newFinishedRules;
    // console.log(rules);
}

// while(unfinishedRules.length) {
//     runMerge();
//     console.log(rules);
// }

runMerge();
runMerge();
runMerge();
runMerge();
runMerge(); // still works here
runMerge();
runMerge();
runMerge();
runMerge();


// rules.forEach((value, key) => {
//     console.log(key, value);
// });
// console.log('fr',finishedRules, 'ur',unfinishedRules);



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
// myMap.set('0', [...new Set(allCombined)])
// // console.log(rules.get('0'), messages);

// const result = messages.reduce((sum, message) => rules.get('0').some(rule => rule === message) ? sum+1 : sum, 0);
// console.log(result);




const rule8 = rules.get('8');
const rule11 = rules.get('11');
// console.log(rules.get('0'), rule8, rule11);

const combined = [];
rule8.forEach(f => {
    rule11.forEach(s => combined.push(f + s));
    // rule11.reverse().forEach(s => combined.push(f+s));
});
rules.set('0', [...new Set(combined)]);
// myMap.set('0', [...new Set(combined)])
const rule0 = rules.get('0');
// console.log(rule0, rule0.length);
const remainingMessage = [];
const result = messages.reduce((sum, message) => rules.get('0').some(rule => rule === message) ? sum+1 : (remainingMessage.push(message), sum), 0);
console.log(result);
// console.log(messages.reduce((a,b) => b.length === 24 ? a+1 : a, 0));

let com = [];
// let com2 = [];
const rule42 = rules.get('42');
const rule31 = rules.get('31');
rules.clear();

console.log('the crunching...', messages.length);
rule42.forEach(f => {
    rule42.forEach(f2 => {
        rule31.forEach(s => {
            // const reg = "^" + f + ".*$;^(" + f + ")+(" + f2 + ").*$;^(" + f + ")+(" + f2 + ")+(" + s +"){1,2}$";
            const reg = f + f2 + s;
            com.push(reg);
            // com2.push(f + f2 + s);
        });
    });
});
// const result9 = messages.reduce((sum, message) => com2.some(rule => rule === message) ? sum+1 : sum, 0);
// console.log(result9);
// console.log(com, com.length);
// 2097152
// const remainingMessage = [];
// const result2 = messages.reduce((sum, message, i) => com.some(rule => {
//     if (message === rule.replace(/[()+^$]/g, '')) { 
//         console.log('found', i, message, rule.replace(/[()+^$]/g, '')); 
//         return true; 
//     } else {
//         remainingMessage.push(message);
//     }
// }) ? (sum+1) : sum, 0);
// console.log(result2);
// com = [...new Set(com)];
console.log('the final stretch', remainingMessage.length, com.length);
console.log(remainingMessage.reduce((s,m) => m.length > s ? m.length : s, 0));
console.log(com.reduce((s,m) => m.length > s ? m.length : s, 0), com[0]);

// const result3 = remainingMessage.reduce((sum, message, i) => {
//     console.log('searching', i, new Date(), message);
//     return com.some(rule => {
//         const [a,b,c] = rule.split(';');
//         let m1 = message.match(new RegExp(a, 'm'));
//         let m2 = m1 && message.match(new RegExp(b, 'm'));
//         if (m2) console.log('partial', i, new Date(), message, new RegExp(c, 'm'))
//         let m = m2 && message.match(new RegExp(c, 'm')); 
//         if (m) console.log('found', i, new Date(), message, new RegExp(c, 'm')); 
//         return m;
//     }) ? (sum+1) : sum;
// }, 0);
// console.log(result + result3);


//  bbabbbbabbabbbba  bbabbbba   bbbabaab
// (bbabbbbabbabbbba)(bbabbbba)*(bbbabaab)


//  bbabbbba   bbabbbba   bbbabaab
// (bbabbbba)+(bbabbbba)+(bbbabaab)


//  bbabbbba   bbabbbba   bbbabbab
// (bbabbbba)+(bbabbbba)+(bbbabbab)