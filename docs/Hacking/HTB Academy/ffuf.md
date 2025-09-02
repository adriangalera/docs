# Fuzzing with ffuf

Tools such as `ffuf` provide us with a handy automated way to fuzz the web application's individual components or a web page. This means, for example, that we use a list that is used to send requests to the webserver if the page with the name from our list exists on the webserver. If we get a response code 200, then we know that this page exists on the webserver, and we can look at it manually.

The term fuzzing refers to a testing technique that sends various types of user input to a certain interface to study how it would react.

We usually utilize pre-defined wordlists of commonly used terms for each type of test for web fuzzing to see if the webserver would accept them. We will not have to reinvent the wheel by manually creating these wordlists, as great efforts have been made to search the web and determine the most commonly used words for each type of fuzzing. Some of the most commonly used wordlists can be found under the GitHub SecLists repository, which categorizes wordlists under various types of fuzzing,

## Directory fuzzing

This type of fuzzing tries to reveal accessible directories in a web server. In order to do so, we need to place the keyword `FUZZ` in the part of the URL we want to fuzz:

```bash
ffuf -w <SNIP> -u http://SERVER_IP:PORT/FUZZ
```

e.g:

```bash
ffuf -w /opt/useful/seclists/Discovery/Web-Content/directory-list-2.3-small.txt:FUZZ -u http://SERVER_IP:PORT/FUZZ
```

In general, all usages of `fuff` will be like this. `FUZZ` keyword needs to be specified in the wordlist so that the variable is populated from the wordlist and in the part that needs to be "fuzzed"

## Extension fuzzing

We can try to find the technology of the web server by fuzzing the extensions of the webpages:

```bash
ffuf -w /opt/useful/seclists/Discovery/Web-Content/web-extensions.txt:FUZZ -u http://SERVER_IP:PORT/blog/indexFUZZ
```

This will try with: `.php`, `.asp`, etc..

## Page fuzzing

Once we know the extension, we now can fuzz what pages are available with that extension:

```bash
ffuf -w /opt/useful/seclists/Discovery/Web-Content/directory-list-2.3-small.txt:FUZZ -u http://SERVER_IP:PORT/blog/FUZZ.php
```

## Recursive fuzzing

We might have multiple directories and in each directory multiple pages. In order to fuzz all of those, we can fuzz recursively.

```bash
ffuf -w /opt/useful/seclists/Discovery/Web-Content/directory-list-2.3-small.txt:FUZZ -u http://SERVER_IP:PORT/FUZZ -recursion -recursion-depth 1 -e .php -v
```

Note that we can specify the depth of the recursion. For each directory, it will restart the wordlist and fuzz the whole directory.