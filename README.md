# MyBits

[ A little play with repeatable obfuscation. ]

### A password generator that requires a password to generate??

Relies on a set string [ in the file named "my_bits" ] to generate an identical final string every time.
"my_bits_md5sum" must have an md5sum that matches "my_bits".> `$md5sum my_bits > my_bits_md5sum`

Any file can be used as long as you follow the md5 criteria and filenames. Some odd behaviour may happen with none ascii data.

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
!But clear bash history etc.

--
Generate your own bits file in linux: 

`$ head -c 100000 /dev/urandom | tr -dc A-Za-z0-9\^\-_+=\% | head -c 8192 > my_bits && md5sum my_bits > my_bits_md5sum; echo ''`

OR

Copy a large text file e.g a shakepseare chapter, remove punctuation and replace spaces with random digits

`awk 'BEGIN { srand(); } { line=$0; for (i=1; i<=length(line); i++) { if (substr(line, i, 1) ~ /[[:punct:] ]/) { r = int(rand() * 10); sub(substr(line, i, 1), r, line); } } print line > "output" }' shakespeare.txt && mv output my_bits && md5sum my_bits > my_bits_md5sum`

THANKS CHATGPT! 

There you have your own static file of bits to use.

This could create a situation where you delete keyfiles after unlocking Veracypt volumes then remake again. [untested]

## files: my_bits and my_bits_md5sum **MUST** stay unchanged once you start using this for things like keyfiles.
