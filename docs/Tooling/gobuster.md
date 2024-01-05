---
slug: /tooling/gobuster
pagination_next: null
pagination_prev: null
---

https://github.com/OJ/gobuster

gobuster performs dir busting on a web server. It discovers available paths using a word list.

The following examples checks all the words in `/usr/share/dict/american-english-small` dictionary and searches for paths with `php` extensions and stores the results in `/tmp/found` and uses 20 threads:

```bash
gobuster -x php -u http://<ip> -w /usr/share/dict/american-english-small -o /tmp/found -t 20  
```

gobuster can also perform sub-domain enumeration (by dns records or by virtual host) e.g:

```bash
gobuster vhost --url http://thetoppers.htb -w /usr/share/workdlists/subdomains-top1million-5000.txt -t 50 --append-domain
```

Consider using different wordlist for subdomains and for directories