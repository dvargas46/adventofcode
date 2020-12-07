// const input = require('./inputs/7-example.json'); console.log(input);
// const input = require('./inputs/7-example2.json'); console.log(input);
const input = require('./inputs/7-input.json');

// PartI
const bag_colors = input.map(rule => {
    const words = rule.split(' ');
    return words[0] + "\\s" + words[1];
});

let contains_gold = [];
const find_bags = (bag_color) => {
    const reg = new RegExp(`^.*contain\\s.*${bag_color}\\sbag.*$`, 'gi');
    input
        .filter(rule => rule.match(reg))
        .forEach(rule => {
            contains_gold.push(rule);
            const words = rule.split(' ');
            find_bags(words[0] + "\\s" + words[1]);
        });
};
find_bags("shiny\\sgold");
contains_gold = [...new Set(contains_gold)];

// console.log(contains_gold);
console.log(`Number of bags: ${contains_gold.length}`);

let within_gold = 0;
const find_bags_within = (bag_color, prevFactor) => {
    const reg = new RegExp(`^${bag_color}.*$`, 'gi');
    const res = input
        .filter(rule => rule.match(reg))
        .filter(rule => !rule.includes('no'))
        .map(rule => rule.replace(/^.*contain\s|[.]|bags|bag/g,'').split(' , '))
        .flat()
        .map(bag => bag.split(' '));

    res.forEach(bag => within_gold += prevFactor * parseInt(bag[0]));
    res.forEach(bag => find_bags_within(bag[1] + "\\s" + bag[2], prevFactor*bag[0]));
}

find_bags_within("shiny\\sgold", 1);
console.log(`Number of bags within the gold bag: ${within_gold}`);
