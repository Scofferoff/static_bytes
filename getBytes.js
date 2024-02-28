"use strict";

const fs = require('fs');
const crypto = require('crypto');

let md5HashWithFilename, _content;

// Verify we are working with known data (unless a gremlin replaced it all - how would you know!?)
try {
    _content = fs.readFileSync('./random', 'utf8');
} catch (err) {
    console.error('Missing data file: ', err);
    process.exit(1);
}
try {
    md5HashWithFilename = fs.readFileSync('./random_md5sum', 'utf8').trim();
} catch (err) {
    console.error("missing MD5 hash file: ", err);
    process.exit(1);
}

// get hash value from file
const md5hash = md5HashWithFilename.split(' ')[0];

const hash = crypto.createHash('md5');
hash.update(_content);
const computedMD5Hash = hash.digest('hex');

if (computedMD5Hash !== md5hash) {
    console.log("MD5 hash computed: " + computedMD5Hash);
    console.log("MD5 from file: " + md5hash);
    console.log("File MD5 hash does not match!\nThis should not happen!\nDo you have backups?\nOr generate a new hash using: '$ md5sum ./random > ./random_md5sum'");
    process.exit(1); // kill everything. 
}

const _strLength = _content.length;

const args = process.argv.slice(2);
// argument parsing
const setDefaultValues = parsedArgs => {
    const defaults = {
        '-s' : 0, // start offset
        '-i' : 20, // Iterations
        '-c' : 64, // Chunk size
        '-o' : 0, // Ordering
        '-p' : '', // padding between chunks
        '-f' : '-' // no option supplied = no file written.
    };

    for (const key in defaults) {
        if (!(key in parsedArgs)) {            
            parsedArgs[key] = defaults[key];
        }
    }
}

const parseArguments = args => {
    const parsedArgs = [];
    let currentArg = null;

    for (const arg of args) {
        if (arg.startsWith('-')) {
            currentArg = arg;
            parsedArgs[currentArg] = [];

        } else if (currentArg) { // found argument
            switch (currentArg) {
                case '-s':
                case '-c':
                case '-i':
                case '-o':
                    parsedArgs[currentArg].push(+arg); // force integer/number type
                    break;
            
                default:
                    parsedArgs[currentArg].push(arg); // standard or string data type
                    break;
            }
        }
    }

    // convert arrays to single values if needed
    // args are set as arrays which is not desired.
    for (const key in parsedArgs) {
        if (parsedArgs[key].length === 1) {
            parsedArgs[key] = parsedArgs[key][0];
        }
    }

    // Set defaults for missing parameters
    setDefaultValues(parsedArgs);

    return parsedArgs; // an array
}

// Set/get arguments for output parameters.
const parsedArgs = parseArguments(args);

let _count = parsedArgs['-s']; 
let _iter = 0; 
let _tmp = '';
let _output = '';

while ((_count < _strLength) && (_iter < parsedArgs['-i'])) {

    _tmp = _content.slice(_count, (_count + parsedArgs['-c'])); // may contain a partial length string.

    if (parsedArgs['-o'] === 2 || // output for all iteractions
        (parsedArgs['-o'] === 1 && _iter % 2 !== 0) || // output for ODD iterations: loop number 1,3,5,7 etc
        (parsedArgs['-o'] === 0 && _iter % 2 === 0)) { // output for Even iterations: loop number 0,2,4,6,8 etc
            // build the output string.
            _output += _tmp + parsedArgs['-p'];
    }
    _iter++;
    _count += parsedArgs['-c']; // next block
}

if (parsedArgs['-f'] !== "-") {
    fs.writeFile(parsedArgs['-f'], _output, {flag: 'w' }, (err) => {
        if (err) {
            console.error('Error writing output to file: ', err);
            process.exit(1);
        } else {
            console.log(fs.readFileSync(parsedArgs['-f'], 'utf8') + "\n") // spit out new file contents.. what could go wrong?!
            console.log("Data written to file: " + parsedArgs['-f']);
        }
    });
} else { // Just spit out data to console
    console.log(_output);
}