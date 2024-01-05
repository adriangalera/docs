---
slug: /tooling/ffuf
pagination_next: null
pagination_prev: null
---

https://github.com/ffuf/ffuf

It's a fuzzing tool like gobuster. It can be used to do directory fuzzing, subdomain, etc..

It's way easier to use it than gobuster, you just need to set the keyword where you want ffuf to replace it:

## Fuzzing html pages

```bash
ffuf -w /opt/github/SecLists/Discovery/Web-Content/common.txt:FUFF -u http://devvortex.htb/FUFF.html
```

## Fuzzing sub-domains

```bash
ffuf -w /opt/github/SecLists/Discovery/DNS/subdomains-top1million-5000.txt -H "Host: FUZZ.devvortex.htb" -u http://devvortex.htb -fl 8
```