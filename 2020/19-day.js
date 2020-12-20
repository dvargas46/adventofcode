// const inputfile = './inputs/19-input.txt';
const inputfile = './inputs/19-example.txt';
const processFile = require('./file-processor');


// PART I
const input1 = processFile(inputfile, {
    lineSeparator: new RegExp('\\n\\n', 'g'),
    groupSeparator: new RegExp('\\n', 'g'),
    // jsonSeparator: new RegExp(': ', 'g')
});

let [rules, messages] = input1;
rules = rules.reduce((j, r) => {
    const ruleData = r.split(': ');
    const key = parseInt(ruleData[0]);
    const value = ruleData[1].replace(/"/g, '').split(/[|]/g).map(v => v.replace(/^\s|\s$/gm, '').split(/\s/g));
    j.set(key, value);
    return j;
}, new Map());

let finishedRules = [];
let unfinishedRules = [];
rules.forEach((value, key) => {
    if (value.flat().every(andSpace => andSpace === andSpace.toString() && andSpace.match(/^[a-z]+$/m))) {
        rules.set(key, value.flat());
        finishedRules.push(key);
    } else {
        unfinishedRules.push(key);
    }
});

function resolveAndSpace() {

}

finishedRules.forEach(finishedKey => {
    const fv = rules.get(finishedKey);
    unfinishedRules.forEach(unfinishedKey => {
        const uv = rules.get(unfinishedKey);
        uv.forEach(orSpace => {

        });
    });
});

console.log(rules, messages, finishedRules, unfinishedRules);





// let resolving = true;
// while (resolving) {
//     ruleKeys.forEach(key => {
//         const ruleValues = rules[key];


//         if (!ruleValues.flat(99)[0].match(/\d/)) { // If the subrules are already completed (only alpha)

//             ruleKeys = ruleKeys.filter(k => k !== key);

//         } else {

//             ruleValues.map(srkg => {

//                 srkg.map(srk => {
//                     if (!srk.match(/\d/)) return srk;

//                     const sr = rules[srk];
//                     if (sr.flat(99)[0].match(/^[a-z]*$/m)) return sr;

//                     return srk;
//                 });
//             })


//             // const subRuleKeys = ruleValues.split(/\s/g);

//             // rules[key] = subRuleKeys.map(srk => {
//             //     if (!srk.match(/\d/)) return srk;

//             //     subrule = rules[srk];
//             //     if (subrule.match(/^[a-z]*$/m)) return subrule;

//             //     return srk;
//             // }).join(' ');

//         }
//     });

//     if (ruleKeys.length <= 4) {
//         resolving = false;
//     }
// }



// const result1 = input1;
// console.log(result1);



// PART II
// const result2 = input1;
// console.log(result2);