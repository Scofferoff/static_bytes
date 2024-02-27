    Relies on a set string to generate an identical string every time.
    [ A little play with repeatable obfuscation. ]
    Reads the url parameters to select chunks of data from a set string.
    ?s=0&c=24&o=0 will start at the beginning, create chunks of 24 and deliver every 2nd chunk until the end of the string.
    Example http://localhost/textGen/?s=29&c=33&o=1&p=234567

    OPTIONS
        s: Start offset = Number
        c: chunk size = Number
        o: 1=Odd / 0=Even / 2=All chunks
        p: suffix each chunk with this. String

    This could also be used to generate your password logins, if only you know the parameters.
    Remote hosting would have logs of parameters used, so run this locally only.

    --
    Generate your own string in linux: 
    $ head -c 100000 /dev/urandom | tr -dc A-Za-z0-9\^\-_+=\% | head -c 8192; echo ''
    That in itself could be used as a keyfile. But How do you recreate it again? It's random.