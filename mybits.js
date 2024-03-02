// changing original code to read a file using streams and chunks to handle much larger files.

const fs = require('fs');
const crypto = require('crypto');

let md5HashWithFilename, _content;

// Verify we are working with known data (unless a gremlin replaced it all - how would you know!?)
try {
    _content = fs.readFileSync('./my_bits', 'utf8');
} catch (err) {
    console.error('Missing data file: ', err);
    process.exit(1);
}
try {
    md5HashWithFilename = fs.readFileSync('./my_bits_md5sum', 'utf8').trim();
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
    console.log("File MD5 hash does not match!\nThis should not happen!\nDo you have backups?\nOr generate a new hash using: '$ md5sum ./my_bits > ./my_bits_md5sum'");
    process.exit(1); // kill everything. 
}


const args = process.argv.slice(2);

const rndNum = (min, max) => {
    return Math.floor(Math.random() * (max-min)+min);
}

// argument parsing
const setDefaultValues = parsedArgs => {
    let defaults;
    // A random generator exists, but goes against the repeatability of the output. It's still useful though.
    if (parsedArgs['-r']) { // This overrides any other value
        defaults = {
            '-s' : rndNum(0,41), // start offset
            '-i' : rndNum(2,51), // Iterations
            '-c' : rndNum(3,65), // Chunk size
            '-o' : rndNum(0,5), // skip every # chunks
        };
    } else {
        defaults = {
            '-s' : 0, // start offset
            '-i' : 20, // Iterations
            '-c' : 64, // Chunk size
            '-o' : 0, // skip every # chunks
        };
    }
    defaults['-p'] = ''; // Easily exposes the chunk size used. But it's all reversible. just easier when this is used.
    defaults['-f'] = '-';

    for (const key in defaults) { // check all defaults
        if (!(key in parsedArgs)) { // if option omitted           
            parsedArgs[key] = defaults[key]; // Set default value
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

console.log(parsedArgs);

let _start = parsedArgs['-s']; 
let _end = parsedArgs['-i']; // how many chunks to output
let _count = 0;
let _output = ''; // final data string
let _skip = 0;

const readStream = fs.createReadStream('./my_bits', {encoding: 'utf-8', start: _start, highWaterMark: parsedArgs['-c']});

const onData = (chunk) => {
    if (_count < _end) {
        if (_skip < parsedArgs['-o'] || parsedArgs['-o'] === 0) {
            _output += chunk + parsedArgs['-p'];
            _skip++;
            _count++; // this is equal to iterations and not actual loops
        } else {
            _skip = 0;
        }
    } else {
        readStream.close();
        if (_output.length == 0) {
            console.error("Zero length result, please check parameters");
            process.exit(1);
        } else {
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
        }
    }
}

readStream.on('data', onData);

readStream.on('end', () => {
    console.log('premature end of data, try shorter chunks or iterations, increase data file size etc.');
})