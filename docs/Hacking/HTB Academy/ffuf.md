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

## Sub-domain fuzzing

Sub-domains can be fuzzed in the same as other components of the website, think of examples such as `photos.google.com`, etc...

Similarly to other fuzzing attacks, we just need a word list and where to inject the fuzzed word. For example:

```bash
ffuf -w /opt/useful/seclists/Discovery/DNS/subdomains-top1million-5000.txt:FUZZ -u https://FUZZ.inlanefreight.com/
```

## Virtual host fuzzing

The key difference between VHosts and sub-domains is that a VHost is basically a 'sub-domain' served on the same server and has the same IP, such that a single IP could be serving two or more different websites. VHosts may or may not have public DNS records.

To fuzz virtual hosts, you need to specify the host using the HTTP Header `Host`. For example:

```bash
ffuf -w /opt/useful/seclists/Discovery/DNS/subdomains-top1million-5000.txt:FUZZ -u http://academy.htb:PORT/ -H 'Host: FUZZ.academy.htb'
```

## Filtering

The results automatically discard `404 Not found` and keeps the rest.

```bash
FILTER OPTIONS:
  -fc              Filter HTTP status codes from response. Comma separated list of codes and ranges
  -fl              Filter by amount of lines in response. Comma separated list of line counts and ranges
  -fr              Filter regexp
  -fs              Filter HTTP response size. Comma separated list of sizes and ranges
  -fw              Filter by amount of words in response. Comma separated list of word counts and ranges
```

Sometimes, the response is 200 OK, but just showing an error or a not found. In this case, let's say the size of the page is 900 bytes. So, in this case, we'll set the `-fs` parameter specify we only want to see results whose size is bigger than 900 Bytes:

```bash
ffuf -w /opt/useful/seclists/Discovery/DNS/subdomains-top1million-5000.txt:FUZZ -u http://academy.htb:PORT/ -H 'Host: FUZZ.academy.htb' -fs 900
```

## Parameter Fuzzing - GET

Fuzzing parameters may expose unpublished parameters that are publicly accessible. Such parameters tend to be less tested and less secured.

GET Parameters are passed in the URL, e.g:

`http://admin.academy.htb:PORT/admin/admin.php?param1=value`

So, we need to place the `FUZZ` keyword in the URL:

```bash
ffuf -w /opt/useful/seclists/Discovery/Web-Content/burp-parameter-names.txt:FUZZ -u http://admin.academy.htb:PORT/admin/admin.php?FUZZ=value
```

## Parameter Fuzzing - POST

The main difference between POST requests and GET requests is that POST requests are not passed with the URL and cannot simply be appended after a ? symbol. POST requests are passed in the data field within the HTTP request.

Now, in `fuff` we can add the `FUZZ` parameter in the post data:

```bash
ffuf -w /opt/useful/seclists/Discovery/Web-Content/burp-parameter-names.txt:FUZZ -u http://admin.academy.htb:PORT/admin/admin.php -X POST -d 'FUZZ=key' -H 'Content-Type: application/x-www-form-urlencoded'
```

## Value fuzzing

Once we discovered GET or POST parameters, we can fuzz if there's a special value or something interesting. Since every application is a different word, we might need to build our own word list.

Let's imagine that in our case, we spotted `id` parameter and can accept a number input of some sort. These ids can be in a custom format, or can be sequential, like from 1-1000 or 1-1000000, and so on. We'll start with a wordlist containing all numbers from 1-1000:

```bash
for i in $(seq 1 1000); do echo $i >> ids.txt; done
```

Now we can use this wordlist in fuff:

```bash
ffuf -w ids.txt:FUZZ -u http://admin.academy.htb:PORT/admin/admin.php -X POST -d 'id=FUZZ' -H 'Content-Type: application/x-www-form-urlencoded'
```
