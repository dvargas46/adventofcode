const inputfile = './inputs/22-input.txt';
// const inputfile = './inputs/22-example.txt';
const processFile = require('./file-processor');


// PART I
const input1 = processFile(inputfile, {
    lineSeparator: new RegExp('\\n\\n', 'g'),
    // groupSeparator: new RegExp('\\s', 'g'),
    // jsonSeparator: new RegExp(':', 'g')
});
const player1 = input1[0].replace(/\w+\s\d[:]\n/g, '').split(/\n/).map(Number);
const player2 = input1[1].replace(/\w+\s\d[:]\n/g, '').split(/\n/).map(Number);
const player1Deck = [...player1];
const player2Deck = [...player2];
console.log(player1, player2);

function playCombatRound() {
    const player1Card = player1.shift();
    const player2Card = player2.shift();
    if (player1Card > player2Card) {
        player1.push(player1Card);
        player1.push(player2Card);
    } else if (player2Card > player1Card) {
        player2.push(player2Card);
        player2.push(player1Card);
    } else {
        console.log('It was a tie?!');
    }
}

while (player1.length && player2.length) {
    playCombatRound();
}

if (player1.length) {
    console.log(
        'Player1 won the game!', 
        player1, 
        player1.reverse().reduce((score, card, i) => score + (card*(i+1)))
    )
}

if (player2.length) {
    console.log(
        'Player2 won the game!', 
        player2, 
        player2.reverse().reduce((score, card, i) => score + (card*(i+1)))
    )
}


// PART II
const p1 = [...player1Deck];
const p2 = [...player2Deck];
const rounds = [];

let counter = 1;
let game = 1;
function playRecursiveCombatRound() {
    console.log('--- Round', counter, '--- Game', game, '---');
    console.log(p1);
    console.log(p2);

    const p1Card = p1.shift();
    const p1DeckSize = p1.length;
    const p2Card = p2.shift();
    const p2DeckSize = p2.length;

    console.log(p1Card);
    console.log(p2Card);

    const p1HasAtLeast = p1DeckSize >= p1Card;
    const p2HasAtLeast = p2DeckSize >= p2Card;
    let p1Won = false;

    if (p1HasAtLeast && p2HasAtLeast) {
        // sub-game
        console.log('entering sub-game...');
        const p1Clone = p1.slice(0, p1Card);
        const p2Clone = p2.slice(0, p2Card);

        game++;
        p1Won = playRecursiveCombatSubRound(p1Clone, p2Clone);
    } else {
        p1Won = p1Card > p2Card;
        console.log('no sub-game needed!');
    }
    
    // end of normal round
    const winningOrder = p1Won ? [p1Card, p2Card] : [p2Card, p1Card];
    if (p1Won) { 
        console.log('Player1 won this round!\n');
        p1.push(...winningOrder);
    } else {
        console.log('Player2 won this round!\n');
        p2.push(...winningOrder);
    }
    counter++;
}


function playRecursiveCombatSubRound(p1sub, p2sub) {
    console.log('--- Round', counter, '--- Game', game, '---');
    console.log(p1sub);
    console.log(p2sub);

    const p1Card = p1sub.shift();
    const p1DeckSize = p1sub.length;
    const p2Card = p2sub.shift();
    const p2DeckSize = p2sub.length;

    console.log(p1Card);
    console.log(p2Card);

    const p1HasAtLeast = p1DeckSize > p1Card;
    const p2HasAtLeast = p2DeckSize > p2Card;

    let p1Won = false;
    if (p1HasAtLeast && p2HasAtLeast) {
        // sub-game
        const p1Clone = p1sub.slice(0, p1Card);
        const p2Clone = p2sub.slice(0, p2Card);
        game++;

        p1Won = playRecursiveCombatSubRound(p1Clone, p2Clone);
    } else {
        // normal round of combat
        p1Won = p1Card > p2Card;
        console.log('no sub-game needed!');
    }

    const winningOrder = p1Won ? [p1Card, p2Card] : [p2Card, p1Card];
    if (p1Won) { 
        console.log('Player1 won this round!\n');
        p1sub.push(...winningOrder);
    } else {
        console.log('Player2 won this round!\n');
        p2sub.push(...winningOrder);
    }

    if (p1sub.length && p2sub.length) {
        playRecursiveCombatSubRound(p1sub, p2sub);
    } else {
        return p1Won;
    }
}


while (p1.length && p2.length) {
    playRecursiveCombatRound();
}

if (p1.length) {
    console.log(
        'Player1 won the game!', 
        p1, 
        p1.reverse().reduce((score, card, i) => score + (card*(i+1)))
    )
}

if (p2.length) {
    console.log(
        'Player2 won the game!', 
        p2, 
        p2.reverse().reduce((score, card, i) => score + (card*(i+1)))
    )
}