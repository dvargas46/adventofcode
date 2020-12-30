const inputFile = '../inputs/18-input.txt';
// const inputFile = '../inputs/18-example.txt';
// const inputFile = '../inputs/18-example2.txt';
const processFile = require('../common/file-processor');

String.prototype.replaceBetween = function(start, end, what) {
    return this.substring(0, start) + what + this.substring(end);
};

// PART I
const input1 = processFile(inputFile, {
    lineSeparator: new RegExp('\\n', 'g')
});

const evalMath = (orig) => {
    expr = orig.replace(/[()]/g, '');
    // console.log('new',expr.split(' '));
    const fin = expr.split(' ').reduce((stack, val) => {
        // console.log('stack', stack, val)
        if (stack.length < 3) {
            stack.push(val);
            return stack;
        } else {
            stack = [eval(stack.join('')).toString()];
            stack.push(val);
            return stack;
        }
    }, []);
    // console.log('fin',fin);
    return eval(fin.join('')).toString();
}

const result1 = input1
    .map(orig => {
        let expr = orig;
        let parenthesis;
        // console.log(orig);
        while (parenthesis = expr.match(/\(\d[^(]+?\d\)/)) {
            // console.log(parenthesis);
            // console.log('ans', answer)
            let addition;
            let paren2 = parenthesis[0];
            while(addition = paren2.match(/\d+\s[+]\s\d+/)) {
                const part = evalMath(addition[0]);
                console.log(paren2, addition);
                paren2 = paren2.replaceBetween(addition.index, addition.index + addition[0].length, part);
            }
            
            const answer = evalMath(paren2);
            expr = expr.replaceBetween(parenthesis.index, parenthesis.index + parenthesis[0].length, answer);
        }

        let addition;
        while(addition = expr.match(/\d+\s[+]\s\d+/)) {
            const part = evalMath(addition[0]);
            console.log(expr, addition);
            expr = expr.replaceBetween(addition.index, addition.index + addition[0].length, part);
        }

        return evalMath(expr);
        // return [
        //     orig,
        //     orig.match(/\(\d[^(]+\d\)/),
        // ]
    });
    
console.log(result1);
console.log(result1.reduce((sum, val) => sum+parseInt(val), 0));



// PART II
// const result2 = input1;
// console.log(result2);