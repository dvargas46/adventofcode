// const inputfile = './inputs/21-input.txt';
const inputfile = './inputs/21-example.txt';
const processFile = require('./file-processor');


// PART I
const input1 = processFile(inputfile, {
    lineSeparator: new RegExp('\\n', 'g'),
    // groupSeparator: new RegExp('\\s', 'g'),
    // jsonSeparator: new RegExp(':', 'g')
});

const allIngredients = new Map();
const allAllergens = new Map();
input1.forEach(line => {
    const [ingredients, allergens] = line.replace(')', '').split(' (contains ');
    ingredients.split(' ').forEach(ingredient => {
        if (!allIngredients.has(ingredient)) allIngredients.set(ingredient, new Set());
        allergens.split(', ').forEach(allergen => allIngredients.get(ingredient).add(allergen));
    });
    allergens.split(', ').forEach(allergen => {
        if (!allAllergens.has(allergen)) allAllergens.set(allergen, new Set());
        ingredients.split(' ').forEach(ingredient => allAllergens.get(allergen).add(ingredient));
    });
})

const result1 = input1;
console.log(result1);
console.log(allIngredients);
console.log(allAllergens);



// PART II
// const result2 = input1;
// console.log(result2);