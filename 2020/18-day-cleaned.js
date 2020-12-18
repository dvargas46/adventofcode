const inputFile = './inputs/18-input.txt';
const processFile = require('./file-processor');

String.prototype.replaceBetween = function(start, end, replacement) {
    return this.substring(0, start) + replacement + this.substring(end);
}

const input = processFile(inputFile, {
    lineSeparator: new RegExp('\\n', 'g')
});

const parenthesisMatch = /\((\d[^(]+?\d)\)/;
const additionMatch = /\d+\s[+]\s\d+/;
const multiplicationMatch = /\d+\s[*]\s\d+/;

const evalLeftToRight = (originalExpression) => {
    let expressionStack = originalExpression.split(' ');
    if (expressionStack.length > 3) {
        expressionStack = expressionStack.reduce((stack, val) => {
            if (stack.length === 3) stack = [eval(stack.join('')).toString()];
            stack.push(val);
            return stack;
        }, []);
    }
    return eval(expressionStack.join('')).toString();
}
const evalInOrder = (originalExpression, operation) => {
    let lastExpression = originalExpression;
    switch (operation) {
        case 'x':
            lastExpression = evalMultiplication(originalExpression);
            break;
        case '+':
            lastExpression = evalAddition(originalExpression);
            break;
        default:
            lastExpression = evalLeftToRight(originalExpression);
    }
    return lastExpression;
}
const evalParenthesis = (originalExpression, orderOfOperations = ['x', '+']) => {
    let lastExpression = originalExpression;
    let parenthesis;
    while (parenthesis = lastExpression.match(parenthesisMatch)) {
        const parentheticalExpression = parenthesis[1];
        const answer = evalMath(parentheticalExpression, orderOfOperations);
        lastExpression = lastExpression.replaceBetween(parenthesis.index, parenthesis.index + parenthesis[0].length, answer);
    }
    return lastExpression;
}
const evalSubOperation = (originalExpression, operation) => {
    let lastExpression = originalExpression;
    let match;
    const subExpressionMatch = operation === '+' ? additionMatch : multiplicationMatch;
    while(match = lastExpression.match(subExpressionMatch)) {
        const subExpression = match[0];
        const answer = evalLeftToRight(subExpression);
        lastExpression = lastExpression.replaceBetween(match.index, match.index + subExpression.length, answer);
    }
    return lastExpression;
}
const evalMultiplication = (originalExpression) => evalSubOperation(originalExpression, 'x');
const evalAddition = (originalExpression) => evalSubOperation(originalExpression, '+');
const evalMath = (originalExpression, orderOfOperations = ['x', '+']) => {
    let lastExpression = originalExpression;
    lastExpression = evalParenthesis(originalExpression, orderOfOperations);
    orderOfOperations.forEach(op => lastExpression = evalInOrder(lastExpression, op));
    return evalLeftToRight(lastExpression);
}

// PART I
const result1 = input.map(expr => evalMath(expr, []));
console.log(result1);
console.log(result1.reduce((sum, val) => sum+parseInt(val), 0));

// PART II
const result2 = input.map(expr => evalMath(expr, ['+', '*']));
console.log(result2);
console.log(result2.reduce((sum, val) => sum+parseInt(val), 0));