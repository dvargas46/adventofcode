const input = require('./inputs/1-input.json');
const fuelCalculation = (mass) => Math.floor(mass/3)-2;

// PART I
const massFuelRequirement = input
    .map(fuelCalculation)
    .reduce((fuel, tot) => tot + fuel);
console.log('Fuel requirements are', massFuelRequirement, 'of fuel');

// PART II
let fuelRequirements = input
    .map(mass => {
        let massFuel = fuelCalculation(mass);
        
        let remainingFuel = fuelCalculation(massFuel);
        while(remainingFuel > 0) {
            massFuel += remainingFuel;
            remainingFuel = fuelCalculation(remainingFuel);
        }
        return massFuel;
    })
    .reduce((fuel, tot) => tot + fuel);
console.log('Total fuel requirements are', fuelRequirements, 'of fuel');