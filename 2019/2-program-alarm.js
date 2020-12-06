const intcode = require('./inputs/2-input.json');
const machine = require('./2-intcode-machine');

newcode = [...intcode];

// PART I
newcode[1] = 12;
newcode[2] = 2;
console.log(machine.run(newcode)[0]);

// PART II
const RESULTING_NUMBER_TO_GET = 19690720;
const MIN_NOUN = 0;
const MAX_NOUN = 99;
const MIN_VERB = 0;
const MAX_VERB = 99;

for (let noun=MIN_NOUN; noun<=MAX_NOUN; noun++){
    for (let verb=MIN_VERB; verb<=MAX_VERB; verb++) {
        const codes = [...intcode];
        codes[1] = noun;
        codes[2] = verb;

        if (machine.run(codes)[0] === RESULTING_NUMBER_TO_GET) {
            console.log('Found match!', `noun:${noun}, verb:${verb}`);
            console.log(`100 * noun + verb =`, 100*noun+verb);
        }        
    }
}