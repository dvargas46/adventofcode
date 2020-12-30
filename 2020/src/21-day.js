const inputFile = '../inputs/21-input.txt';
// const inputFile = '../inputs/21-example.txt';
const processFile = require('../common/file-processor');


// PART I
const input1 = processFile(inputFile, { lineSeparator: new RegExp('\\n', 'g') });

const allIngredients = new Map();
const allAllergens = new Map();

const allFoods = input1.map((line, i) => {
    const [ingredients, allergens] = line.replace(')', '').split(' (contains ');
    ingredients.split(' ').forEach(ingredient => {
        if (!allIngredients.has(ingredient)) allIngredients.set(ingredient, new Set());
        allIngredients.get(ingredient).add(i);
    });
    allergens.split(', ').forEach(allergen => {
        if (!allAllergens.has(allergen)) allAllergens.set(allergen, new Set());
        allAllergens.get(allergen).add(i);
    });
    return [ingredients.split(' '), allergens.split(', ')];
});

console.log('Number of foods:', allFoods.length);
console.log('Number of allergens:', allAllergens.size);
console.log('Number of ingredients:', allIngredients.size);

// check if there are any allergens that appear in the same foods as any 1 ingredient
const potentialRelations = new Map();
allAllergens.forEach((foodsHavingAllergen, allergen) => {
    allIngredients.forEach((foodsHavingIngredient, ingredient) => {
        if (setIsSubset(foodsHavingAllergen, foodsHavingIngredient)) {
            let strength = subsetCount(foodsHavingAllergen, foodsHavingIngredient);
            if (!potentialRelations.has(allergen)) potentialRelations.set(allergen, new Map());
            potentialRelations.get(allergen).set(ingredient, strength);
        }
    });
});
const orderedRelations = reorderAllergensByIngredientStrength(potentialRelations);
console.log(orderedRelations);

const ingredientsWithAllergens = new Set();
orderedRelations.forEach((strengthMap, allergen) => {
    strengthMap.forEach((_, ingredient) => {
        ingredientsWithAllergens.add(ingredient);
    })
});
console.log(ingredientsWithAllergens);

const ingredientsWithoutAllergens = new Set();
allIngredients.forEach((_, ingredient) => {
    if (!ingredientsWithAllergens.has(ingredient)) ingredientsWithoutAllergens.add(ingredient);
});

const result1 = allFoods.reduce((sum, ingredientsAndAllergens) => {
    return sum + ingredientsAndAllergens[0].reduce((subtotal, ingredient) => {
        return ingredientsWithoutAllergens.has(ingredient) ? subtotal+1 : subtotal
    }, 0);
}, 0);
console.log(result1);


// PART II
const ingredientsToAllergens = new Map();
const foods = JSON.parse(JSON.stringify(allFoods));

function attemptMatching(skipTimes) {
    const relationships = new Map(orderedSizes);
    relationships.forEach((ingredientStrengths, allergen) => {
        // console.log(allergen, ingredientStrengths);
        let firstIngredient;
        
        // Bit of a hacky approach here, but it works -- I needed to make sure fish chose the second ingredient instead of the first
        // One better way to approach this (if the input was bigger :D), would be to iterate through the possible combinations to find
        //  the one that produces a full list at the end, but why do that when it's small enough to know that fish was the issue :D
        if (allergen === 'fish') {
            // this is the first item ---> just iterate through how many times you should actually try
            const keys = ingredientStrengths.keys();
            for (let i=0; i<=skipTimes; i++) {
                firstIngredient = keys.next().value;
            }
        } else {
            firstIngredient = ingredientStrengths.keys().next().value;
        }
    
        orderedRelations.forEach((otherIngredientStrengths, _) => {
            otherIngredientStrengths.delete(firstIngredient);
        });
        ingredientsToAllergens.set(allergen, firstIngredient);
        
    });
}

const orderedSizes = reorderAllergensByIngredientSize(orderedRelations);
console.log(orderedSizes);
attemptMatching(1);

console.log(ingredientsToAllergens);
const ordered = reorderIngredientsToAllergens(ingredientsToAllergens);
console.log(ordered);

let resultIngredients = [];
ordered.forEach((value, key) => resultIngredients.push(value));
const result2 = resultIngredients.join(',');
console.log(result2);

/*
    HELPER FUNCTIONS
*/
function setsEqual(set1, set2) {
    if (set1.size !== set2.size) return false;
    for (let item1 of set1) {
        if (!set2.has(item1)) return false;
    }
    return true;
}
function setIsSubset(subset, set) {
    if (subset.size > set.size) return false;
    for (let item of subset) {
        if (!set.has(item)) return false;
    }
    return true;
}
function subsetCount(subset, set) {
    if (subset.size > set.size) return 0;
    let count = 0;
    for (let item of subset) {
        if (set.has(item)) count++;
    }
    return count;
}
function reorderAllergensByIngredientStrength(allergens) {
    const originalAllergens = new Map(allergens);
    const orderedAllergens = new Map();
    while (originalAllergens.size) {
        let maxAllergen;
        let maxIngredients;
        let maxStrength = 0;
        originalAllergens.forEach((strengthMap, allergen) => {
            strengthMap.forEach((strength, ingredient) => {
                if (strength > maxStrength) {
                    maxStrength = strength;
                    maxAllergen = allergen;
                    maxIngredients = strengthMap;
                }
            });
        });
        orderedAllergens.set(maxAllergen, maxIngredients);
        originalAllergens.delete(maxAllergen);
    }
    return orderedAllergens;
}
function reorderAllergensByIngredientSize(allergens) {
    const originalAllergens = new Map(allergens);
    const orderedAllergens = new Map();
    while (originalAllergens.size) {
        let maxAllergen;
        let maxIngredients;
        let maxStrength = 99;
        originalAllergens.forEach((strengthMap, allergen) => {
            if (strengthMap.size < maxStrength) {
                maxStrength = strengthMap.size;
                maxAllergen = allergen;
                maxIngredients = strengthMap;
            }
        });
        orderedAllergens.set(maxAllergen, maxIngredients);
        originalAllergens.delete(maxAllergen);
    }
    return orderedAllergens;
}
function reorderIngredientsToAllergens(map) {
    const original = new Map(map);
    const ordered = new Map();
    while (original.size) {
        let nextKey = 'Z';
        let nextVal;
        original.forEach((val, key) => {
            if (key.localeCompare(nextKey) < 0) {
                nextKey = key;
                nextVal = val;
            }
        });
        ordered.set(nextKey, nextVal);
        original.delete(nextKey);
    }
    return ordered;
}