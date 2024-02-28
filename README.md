    Relies on a set string [ in the file named "my_bits" ] to generate an identical string every time.
    random_md5sum must have an md5sum that matchs "my_bits". $md5sum random > my_bits_md5sum
    [ A little play with repeatable obfuscation. ]
    Reads the parameters to select chunks of data from a set string.

    Requires: Node.js

    Usage: node app.js [options]

    OPTIONS
        -s : Start offset = Number
        -c : chunk size = Number
        -o : 1=Odd / 0=Even / 2=All chunks
        -i : How many loops/chunks to get from data file ("my_bits")
        -p : suffix each chunk with this. String
        -f : file name to write data to. Otherwise written to console.

    This could also be used to generate your password logins, if only you know the parameters.
    !Clear bash history etc.

    --
    Generate your own bits file in linux: 
    $ head -c 100000 /dev/urandom | tr -dc A-Za-z0-9\^\-_+=\% | head -c 8192 > my_bits; echo ''
    That in itself could be used as a keyfile. But How do you recreate it again? It's random.