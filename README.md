# MyBits

[ A little play with repeatable obfuscation. ]

### A password generator that requires a password to generate??

Relies on a set string [ in the file named "my_bits" ] to generate an identical final string every time.
"my_bits_md5sum" must have an md5sum that matches "my_bits".> `$md5sum my_bits > my_bits_md5sum`
Reads the parameters to select chunks of data from a set string.

**Requires:** Node.js

**Usage:** node app.js [options]

**OPTIONS**
* -s : Start offset = Number
* -c : chunk size = Number
* -o : 1=Odd / 0=Even / 2=All chunks
* -i : How many loops/chunks to get from data file ("my_bits")
* -p : suffix each chunk with this. String
* -f : file name to write data to. Otherwise written to console.

This could also be used to generate your password logins, if only you know the parameters.
!Clear bash history etc.

--
Generate your own bits file in linux: 
`$ head -c 100000 /dev/urandom | tr -dc A-Za-z0-9\^\-_+=\% | head -c 8192 > my_bits; echo ''`
That in itself could be used as a keyfile. But How do you recreate it again if lost? It's random.

This could create a situation where you delete keyfiles after unlocking Veracypt volumes then remake again. [untested]

## files: my_bits and my_bits_md5sum **MUST** stay unchanged once you start using this for things like keyfiles.