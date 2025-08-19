---
slug: /tooling/ffuf
pagination_next: null
pagination_prev: null
---

https://github.com/ffuf/ffuf

It's a fuzzing tool like gobuster. It can be used to do directory fuzzing, subdomain, etc..

It's way easier to use it than gobuster, you just need to set the keyword where you want ffuf to replace it.

We can always use two wordlists and have a unique keyword for each, and then do FUZZ_1.FUZZ_2 to fuzz for both.

## Fuzzing html pages

```bash
ffuf -w /opt/github/SecLists/Discovery/Web-Content/common.txt:FUFF -u http://devvortex.htb/FUFF.html
```

## Fuzzing sub-domains

```bash
ffuf -w /opt/github/SecLists/Discovery/DNS/subdomains-top1million-5000.txt -H "Host: FUZZ.devvortex.htb" -u http://devvortex.htb -fl 8
```

## Fuzzing extensions

```bash
ffuf -w /opt/github/SecLists/Discovery/Web-Content/web-extensions.txt:FUZZ -u http://SERVER_IP:PORT/blog/indexFUZZ
```

The wordlist has the `.` extension, so no need to add it to the command.

## Fuzzing with recursion

You can fuzz directories, sub-directories and pages by using recursion:

```bash
ffuf -w /opt/github/SecLists/Discovery/Web-Content/directory-list-2.3-small.txt:FUZZ -u http://94.237.54.75:59384/FUZZ -ic -v -recursion -recursion-depth 1 -e .php
```

- `-ic` ignore comments in the wordlist
- `-v` prints the whole URL
- `-recursion` enable recursive scanning
- `-recursion-depth 1` only allow one level of recursion, otherwise the scan will take too much time
- `-e .php` set the extension to add when scanning for concrete page in directory.

## Fuzzing paramters

```bash
ffuf -w /opt/github/SecLists/Discovery/Web-Content/burp-parameter-names.txt:FUZZ -u http://admin.academy.htb:30373/admin/admin.php?FUZZ=value -fs 798
```

`-fs 798` filter by pages returning different size of 798 bytes. This is useful to identify different page contents.

You can also fuzz POST data:

```bash
ffuf -w /opt/github/SecLists/Discovery/Web-Content/burp-parameter-names.txt:FUZZ -u http://admin.academy.htb:PORT/admin/admin.php -X POST -d 'FUZZ=key' -H 'Content-Type: application/x-www-form-urlencoded' -fs xxx
```

If you identify a parameter, you can also fuzz the values:

```bash
ffuf -w /tmp/ids.txt:FUZZ -u http://admin.academy.htb:30373/admin/admin.php -X POST -d 'id=FUZZ' -H 'Content-Type: application/x-www-form-urlencoded'  -fs 768
```

If the parameter is a username, you can try to enumerate the users with `SecList` names.txt:

```bash
 ffuf -w /opt/github/SecLists/Usernames/Names/names.txt:FUFF -u "http://nocturnal.htb/view.php?username=FUFF&file=test.pdf" -H "Cookie: PHPSESSID=xxx" -fw 1170
```

In this case, the brute-force was only available for authenticated users. Luckily, we can pass cookies to fuff. It's a bit confusing as you need to set the `-H` flag, the same as a header, but prefix it with `Cookie: `. 

