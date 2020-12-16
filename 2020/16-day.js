const inputfile = './inputs/16-input.txt';
// const inputfile = './inputs/16-example.txt';
// const inputfile = './inputs/16-example-2.txt';
const processFile = require('./file-processor');


const input1 = processFile(inputfile, {
    lineSeparator: new RegExp('\\n\\n', 'g'),
    // groupSeparator: new RegExp('\\s', 'g'),
    // jsonSeparator: new RegExp(':', 'g')
});
const rules = input1[0];
const yourTicket = input1[1];
const otherTickets = input1[2];

// PART I
const validRanges = rules.replace(/[^\d-\s]/g, '').split(/\s+/);
validRanges.shift();
const otherTicketNumbers = otherTickets.replace(/[^\d,\s]/g, '').split(/,|\s+/).map(num => parseInt(num));
otherTicketNumbers.shift();
const result1 = otherTicketNumbers.reduce((sumOfInvalid, num) => {
    const isValid = validRanges.some(range => {
        rangeArr = range.split('-');
        const low = parseInt(rangeArr[0]);
        const high = parseInt(rangeArr[1]);
        return num >= low && num <= high;
    });

    if (!isValid) {
        // console.log(num);
        return sumOfInvalid + num;
    } else {
        return sumOfInvalid;
    }
}, 0);
// console.log(validRanges, otherTicketNumbers);
// const result1 = input1;
// console.log(result1);



// PART II
const otherTicketNumbers2 = otherTickets
    .split(/\n/)
    .map(group => group.split(',').map(val => parseInt(val)));
otherTicketNumbers2.shift();
const validTickNumbers = otherTicketNumbers2.filter(tickets => {
    return tickets.every(t => {
        return validRanges.some(range => {
            rangeArr = range.split('-');
            const low = parseInt(rangeArr[0]);
            const high = parseInt(rangeArr[1]);
            return t>=low && t<=high;
        }); 
    });
});
const realRules = rules.split(/\n/).map(r => r.split(/\:\s+|\sor\s/));
const tr = validTickNumbers.reduce((t, v) => (v.forEach((a,i) => t[i] ? t[i].push(a) : t[i] = [a]), t), (new Array(realRules.length)));
// console.log(realRules);

tr.forEach((c, i) => {
    const rule = realRules.filter(rule => {
        const rl = rule.slice(1,3);
        
        console.log(rl);
        const m = c.every(n => {
            
            return rl.some(range => {
                const rangeArr = range.split('-');
                const low = parseInt(rangeArr[0]);
                const high = parseInt(rangeArr[1]);

                return n>=low && n<=high;
            });
        });
        return m;
    });
    rule.forEach(l => l.push(i));

});

const sorted = realRules.sort((a,b) => a.length - b.length);
sorted.forEach((r, i) => {
    const ix = r.slice(-1)[0];
    // console.log(ix);
    sorted.forEach((o, i2) => {
        if (i2 !== i && o.indexOf(ix) >= 0) {
            sorted[i2] = o.filter(p => p !== ix);
            // console.log(o);
        }
    });
});

const departures = sorted.filter(a => a[0].includes('departure')).map(a => a.slice(-1)[0]);
const yourTicketNums = yourTicket.split(/\n/)[1].split(/,/).map(a => parseInt(a));
console.log(yourTicketNums);
const result2 = yourTicketNums.reduce((r, v, i) => departures.includes(i) ? r*v : r, 1);

console.log(departures);
console.log(result2);
// const result2 = input1;
// console.log(result2);