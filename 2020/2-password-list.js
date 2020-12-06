const input = require('./inputs/2-input.json');

// PART I
const result1 = input
    .map(pwdstr => pwdstr.split(' '))
    .filter(pwdarr => {
        const MIN = parseInt(pwdarr[0].split('-')[0]);
        const MAX = parseInt(pwdarr[0].split('-')[1]);
        const validChar = pwdarr[1].replace(':', '');
        const pwd = pwdarr[2];

        const validCharReg = new RegExp(validChar, 'g');
        const validCharCount = pwd.length - pwd.replace(validCharReg, '').length;
        return validCharCount >= MIN && validCharCount <= MAX;
    });
console.log('PART I');
console.log(`Password list length: ${input.length}`);
console.log(`Number of valid passwords: ${result1.length}`);


// PART II
const result2 = input
    .map(pwdstr => pwdstr.split(' '))
    .filter(pwdarr => {
        const F = parseInt(pwdarr[0].split('-')[0]);
        const L = parseInt(pwdarr[0].split('-')[1]);
        const validChar = pwdarr[1].replace(':', '');
        const pwd = pwdarr[2];
        
        return (pwd[F-1] != validChar && pwd[L-1] == validChar) || (pwd[F-1] == validChar && pwd[L-1] != validChar);
    });
console.log('PART II');
console.log(`Password list length: ${input.length}`);
console.log(`Number of valid passwords: ${result2.length}`);