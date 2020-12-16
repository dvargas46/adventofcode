const inputFile = './inputs/16-input.txt';
const processFile = require('./file-processor');

const input1 = processFile(inputFile, { lineSeparator: new RegExp('\\n\\n', 'g') });

// PART I
const [rules, yourTicket, otherTickets] = input1;
const ruleGroups = rules.split(/\n/).map(rule => rule.split(/\:\s+|\sor\s/)).map(ranges => ranges.map(range => range.includes('-') ? range.split('-').map(Number) : range));
const ruleRanges = ruleGroups.map(group => group.slice(1)).flat();
const otherTicketGroups = otherTickets.replace(/.*:\n|[^\d,\s]/g, '').split(/\n/).map(group => group.split(',').map(Number));
const otherTicketNumbers = otherTicketGroups.flat();
const result1 = otherTicketNumbers.reduce((sumOfInvalid, num) => {
    const isValid = ruleRanges.some(range => num >= range[0] && num <= range[1]);
    return !isValid ? sumOfInvalid + num : sumOfInvalid;
}, 0);
console.log(result1);

// PART II
const validTicketGroups = otherTicketGroups.filter(tickets => tickets.every(num => ruleRanges.some(range => num>=range[0] && num<=range[1])));
const transposedValidTicketGroups = validTicketGroups[0].map((_, colIndex) => validTicketGroups.map(row => row[colIndex]));

transposedValidTicketGroups.forEach((colNumbers, index) => {
    const ruleMatches = ruleGroups.filter(rule => colNumbers.every(num => rule.slice(1).some(range => num>=range[0] && num<=range[1])));
    ruleMatches.forEach(rule => rule.push(index));
});

const sortedRuleGroups = ruleGroups.sort((a, b) => a.length - b.length);
sortedRuleGroups.forEach((rule, index) => {
    const lastMatchingNum = rule.slice(-1)[0];
    sortedRuleGroups.forEach((o, i2) => { if (i2 !== index && o.indexOf(lastMatchingNum) >= 0) sortedRuleGroups[i2] = o.filter(p => p !== lastMatchingNum) });
});

const departures = sortedRuleGroups.filter(a => a[0].includes('departure')).map(a => a.slice(-1)[0]);
const yourTicketNumbers = yourTicket.split(/\n/)[1].split(/,/).map(a => parseInt(a));
const result2 = yourTicketNumbers.reduce((r, v, i) => departures.includes(i) ? r*v : r, 1);
console.log(result2);