const expense_report = require('./inputs/1-input.json');
const MAGIC_NUM = 2020;

// PART I
console.log('PART I');
two_nums_add_to_2020 = expense_report.filter(expense => {
    return expense_report.some(other_expense => (expense !== other_expense) && (expense + other_expense) === MAGIC_NUM)
});
console.log(`Two numbers in the list that add up to ${MAGIC_NUM}:`, two_nums_add_to_2020);
console.log('Multiplied together equals:', two_nums_add_to_2020.reduce((a,b) => a*b, 1));

// PART II
console.log('\nPART II');
three_nums_add_to_2020 = expense_report.filter(expense => {
    return expense_report.some(other_expense => {
        return expense_report.some(another_expense => {
            return (expense !== other_expense) && 
                (expense !== another_expense) && 
                (other_expense !== another_expense) &&
                (expense + other_expense + another_expense) === MAGIC_NUM;
        })
    })
});
console.log(`Three numbers in the list that add up to ${MAGIC_NUM}:`, three_nums_add_to_2020);
console.log('Multiplied together equals:', three_nums_add_to_2020.reduce((a,b) => a*b, 1));