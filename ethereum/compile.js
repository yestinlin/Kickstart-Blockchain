
const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');
// Feth path of build
const buildPath = path.resolve(__dirname, 'build');

// Removes folder build and every file in it
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contractsSol', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'UTF-8');

 // Compile all contracts
 var input = {
    language: 'Solidity',
    sources: {
        'Campaign.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
}; 
var compiled = JSON.parse(solc.compile(JSON.stringify(input)));



// Re-Create build folder for output files from each contract
fs.ensureDirSync(buildPath);

// Output contains all objects from all contracts
// Write the contents of each to different files

for (let contract in compiled.contracts['Campaign.sol']) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract + '.json'),
        compiled.contracts['Campaign.sol'][contract]
    );
}
