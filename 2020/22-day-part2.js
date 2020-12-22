const inputfile = './inputs/22-input.txt';
// const inputfile = './inputs/22-example.txt';
// const inputfile = './inputs/22-example-2.txt';
const processFile = require('./file-processor');

const input1 = processFile(inputfile, {
    lineSeparator: new RegExp('\\n\\n', 'g')
});
const player1Deck = input1[0].replace(/\w+\s\d[:]\n/g, '').split(/\n/).map(Number);
const player2Deck = input1[1].replace(/\w+\s\d[:]\n/g, '').split(/\n/).map(Number);

// PART II
const p1 = [...player1Deck];
const p2 = [...player2Deck];

const savedGames = [];

function playRecursiveCombatGame() {
    // get the last saved game
    const [p1sub, p2sub, rounds, pickedCards, details] = savedGames.pop();
    const [roundEnded, p1WonSubGame] = details;

    // console.log('--- Round', rounds.length+1, '--- Game', savedGames.length+1, '---');
    // console.log(p1sub);
    // console.log(p2sub);

    // check if the game is already complete
    if (roundEnded) {
        // there is already a winner for this game set from the previous sub game
        const [p1Card, p2Card] = pickedCards;
        if (p1WonSubGame) { 
            // console.log('Player 1 won round', rounds.length, 'of game', savedGames.length+1, '!\n');
            p1sub.push(p1Card, p2Card);
        } else {
            // console.log('Player 2 won round', rounds.length, 'of game', savedGames.length+1, '!\n');
            p2sub.push(p2Card, p1Card);
        }

        // normal exit stuff, reset details for next round, if exists
        const otherGamesExist = savedGames.length > 0;
        const isLastRound = p1sub.length === 0 || p2.length === 0;
        if (!isLastRound) {
            // add this game back to the saved games stack to be pulled in again for the next round
            savedGames.push([p1sub, p2sub, rounds, [], [false, false]])
        } else if (isLastRound && otherGamesExist) {
            // since it's the last round, keep this game off the stack and return the overall winner to any previous games if it exists
            const previousGame = savedGames[savedGames.length-1];
            previousGame[4][0] = true;
            previousGame[4][0] = p1WonSubGame;
        }

        return; // exit this round
    }

    // check if the current hand is the EXACT same as any previous round
    if (rounds.some(round => arrayEquals(p1sub, round[0])) && rounds.some(round => arrayEquals(p2sub, round[1]))) {
        // console.log('AN INFINITE LOOP WAS DISCOVERED!! Player 1 wins this game by default');
        // End this game prematurely
        // console.log('Player 1 won round', rounds.length, 'of game', savedGames.length+1, '!\n');
        const otherGamesExist = savedGames.length > 0;
        if (otherGamesExist) {
            // since it's the last round, keep this game off the stack and return the overall winner to any previous games if it exists
            const previousGame = savedGames[savedGames.length-1];
            previousGame[4][0] = true;
            previousGame[4][1] = true;
        }

        return; // exit this round, game
    }

    // track this round's starting point
    rounds.push([[...p1sub], [...p2sub]]);

    // pull a card from the top of each player's deck
    const p1Card = p1sub.shift();
    const p2Card = p2sub.shift();
    // console.log("Player 1's card is", p1Card);
    // console.log("Player 2's card is", p2Card);

    // check if both players have at least as many cards remaining in their deck as the value of the card they just drew
    if (p1sub.length >= p1Card && p2sub.length >= p2Card) {
        // a new game of recursive combat should be played
        // console.log('Playing a sub-game to determine the winner...\n');
        const p1Clone = p1sub.slice(0, p1Card);
        const p2Clone = p2sub.slice(0, p2Card);
        savedGames.push([p1sub, p2sub, rounds, [p1Card, p2Card], [false, false]]);
        savedGames.push([p1Clone, p2Clone, [], [], [false, false]]);
    } else {
        // normal round of combat
        const otherGamesExist = savedGames.length > 0;
        if (p1Card > p2Card) {
            // console.log('Player 1 won round', rounds.length, 'of game', savedGames.length+1, '!\n');
            p1sub.push(p1Card, p2Card);

            const isLastRound = p1sub.length === 0 || p2sub.length === 0;
            if (!isLastRound) {
                // add this game back to the saved games stack to be pulled in again for the next round
                savedGames.push([p1sub, p2sub, rounds, [], [false, false]])
            } else if (isLastRound && otherGamesExist) {
                // since it's the last round, keep this game off the stack and return the overall winner to any previous games if it exists
                const previousGame = savedGames[savedGames.length-1];
                previousGame[4][0] = true;
                previousGame[4][1] = true;
            }
        } else {
            // console.log('Player 2 won round', rounds.length, 'of game', savedGames.length+1, '!\n');
            p2sub.push(p2Card, p1Card);

            const isLastRound = p1sub.length === 0 || p2sub.length === 0;
            if (!isLastRound) {
                // add this game back to the saved games stack to be pulled in again for the next round
                savedGames.push([p1sub, p2sub, rounds, [], [false, false]])
            } else if (isLastRound && otherGamesExist) {
                // since it's the last round, keep this game off the stack and return the overall winner to any previous games if it exists
                const previousGame = savedGames[savedGames.length-1];
                previousGame[4][0] = true;
                previousGame[4][1] = false;
            }
        }
    }
}


function playAGameOfRecursiveCombat() {
    // add a game to the saved games, i.e. the first game is your input cards
    savedGames.push([p1, p2, [], [], [false, false]]);
    while (savedGames.length) {
        playRecursiveCombatGame();
    }
}

playAGameOfRecursiveCombat();

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


/*
    HELPER FUNCTIONS
*/
function arrayEquals(a, b) {
    return Array.isArray(a)
        && Array.isArray(b)
        && a.length === b.length
        && a.every((val, index) => val === b[index]);
}