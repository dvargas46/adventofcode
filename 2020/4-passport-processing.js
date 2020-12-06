const inputFile = './inputs/4-input.txt';
// const inputFile = './inputs/4-example.txt';
const fs = require('fs');

partI();
partII();

// PART I
function partI() {
    const passports = processFilePartI(inputFile);
    const validKeys = [
        'byr',
        'iyr',
        'eyr',
        'hgt',
        'hcl',
        'ecl',
        'pid',
        // 'cid', THIS IS OPTIONAL
    ];
    const validPassports = passports.filter(passport => {
        // console.log(passport);
        // if (!validKeys.every(key => passport.hasOwnProperty(key))) console.log(passport);
        // return Object.keys(passport).every(key => validKeys.includes(key));
        return validKeys.every(key => passport.hasOwnProperty(key));
    });
    console.log(`Number of valid passports: ${validPassports.length}`);
}


// PART II
// byr (Birth Year) - four digits; at least 1920 and at most 2002.
// iyr (Issue Year) - four digits; at least 2010 and at most 2020.
// eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
// hgt (Height) - a number followed by either cm or in:
//     If cm, the number must be at least 150 and at most 193.
//     If in, the number must be at least 59 and at most 76.
// hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
// ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
// pid (Passport ID) - a nine-digit number, including leading zeroes.
// cid (Country ID) - ignored, missing or not.

function partII() {
    const passports = processFilePartI(inputFile);
    const validKeys = [
        'byr',
        'iyr',
        'eyr',
        'hgt',
        'hcl',
        'ecl',
        'pid',
        // 'cid', THIS IS OPTIONAL
    ];
    const validPassports = passports.filter(passport => {
        // console.log(passport);
        // if (!validKeys.every(key => passport.hasOwnProperty(key))) console.log(passport);
        if (!validKeys.every(key => passport.hasOwnProperty(key))) return false;

        const byr = passport[validKeys[0]];
        const iyr = passport[validKeys[1]];
        const eyr = passport[validKeys[2]];
        const hgt = passport[validKeys[3]];
        const hgtNum = hgt.replace(/[a-zA-Z]+/g,'');
        const hgtAlpha = hgt.replace(/[\d]+/g, '');
        const hcl = passport[validKeys[4]];
        const ecl = passport[validKeys[5]];
        const pid = passport[validKeys[6]];

        const validEyeColors = ['amb','blu','brn','gry','grn','hzl','oth'];

        // if (!(byr.length === 4 && !isNaN(byr) && parseInt(byr) >= 1920 && parseInt(byr) <= 2002)) { console.log(passport,'byr',byr); return false;}
        // if (!(iyr.length === 4 && !isNaN(iyr) && parseInt(iyr) >= 2010 && parseInt(iyr) <= 2020)) { console.log(passport,'iyr',iyr); return false;}
        // if (!(eyr.length === 4 && !isNaN(eyr) && parseInt(eyr) >= 2020 && parseInt(eyr) <= 2030)) { console.log(passport,'eyr',eyr); return false;}
        if (!(!isNaN(hgtNum) && ((hgtAlpha === 'cm' && (parseInt(hgtNum) >= 150 && parseInt(hgtNum) <= 193)) || (hgtAlpha === 'in' && (parseInt(hgtNum) >= 59 && parseInt(hgtNum) <= 76))))) { console.log(passport,'hgt',hgt); return false;}
        if (!(hcl[0] === '#' && hcl.length === 7 && hcl.replace('#','').replace(/[0-9]|[a-f]/g, '').length === 0)) { console.log(passport,'hcl',hcl); return false;}
        if (!(validEyeColors.includes(ecl))) { console.log(passport,'ecl',ecl); return false;}
        if (!(pid.length === 9 && !isNaN(pid))) { console.log(passport,'pid',pid); return false;}

        return byr.length === 4 && !isNaN(byr) && parseInt(byr) >= 1920 && parseInt(byr) <= 2002 &&
            iyr.length === 4 && !isNaN(iyr) && parseInt(iyr) >= 2010 && parseInt(iyr) <= 2020 &&
            eyr.length === 4 && !isNaN(eyr) && parseInt(eyr) >= 2020 && parseInt(eyr) <= 2030 &&
            !isNaN(hgtNum) && ((hgtAlpha === 'cm' && (parseInt(hgtNum) >= 150 && parseInt(hgtNum) <= 193)) || (hgtAlpha === 'in' && (parseInt(hgtNum) >= 59 && parseInt(hgtNum) <= 76))) && 
            hcl[0] === '#' && hcl.length === 7 && hcl.replace('#','').replace(/[0-9]|[a-f]/g, '').length === 0 &&
            validEyeColors.includes(ecl) &&
            pid.length === 9 && !isNaN(pid);
    });
    console.log(`Number of valid passports: ${validPassports.length}`);
}

function processFilePartI(file) {
    let rawText = fs.readFileSync(file, 'utf8');
    const passportSeparator = new RegExp("\n\n", 'g');
    const keyValueSeparator = new RegExp("[\s]|[\n]|[\t]|[ ]", 'g');
    const keyToValueSeparator = new RegExp(":", 'g');

    const parsedJson = rawText
        .split(passportSeparator)
        .map(passport => passport.split(keyValueSeparator))
        .map(passport => {
            const passportJSON = {};
            passport.map(keyValues => {
                keyValue = keyValues.split(keyToValueSeparator);
                passportJSON[keyValue[0]] = keyValue[1];
            });
            return passportJSON;
        });
    return parsedJson
}