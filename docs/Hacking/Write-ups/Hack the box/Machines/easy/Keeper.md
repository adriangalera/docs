---
slug: /write-up/htb/machines/easy/keeper
pagination_next: null
pagination_prev: null
---

## Enumeration

Initial scan shows only port 22 and 80, let's deep dive.

SSH: `OpenSSH 8.9p1 Ubuntu 3ubuntu0.3 (Ubuntu Linux; protocol 2.0`

Web: `nginx 1.18.0 (Ubuntu)`

`whatweb` does not show anyhing interesting...

If we get into the page, we see a link saying:

```
To raise an IT support ticket, please visit tickets.keeper.htb/rt/
```

which might indicate a domain-sub somewhere. Before we explore that topic, let's run `gobuster` to see if it sees something (no luck), only index.html is there.

If we try to access, the domain is not reachable, let's try to add it to the /etc/hosts and BINGO!

Now `whatweb` show interesting results:

```bash
└──╼ $whatweb http://tickets.keeper.htb/
http://tickets.keeper.htb/ [200 OK] Cookies[RT_SID_tickets.keeper.htb.80], Country[RESERVED][ZZ], Email[sales@bestpractical.com], HTML5, HTTPServer[Ubuntu Linux][nginx/1.18.0 (Ubuntu)], HttpOnly[RT_SID_tickets.keeper.htb.80], IP[10.10.11.227], PasswordField[pass], Request-Tracker[4.4.4+dfsg-2ubuntu1], Script[text/javascript], Title[Login], X-Frame-Options[DENY], X-UA-Compatible[IE=edge], nginx[1.18.0]
```

Looks like the server is running an instance of Best Practical Request Tracker (RT) version 4.4.4

## Foothold

After some searching I found this page: https://www.192-168-1-1-ip.co/router/bestpractical/rt/12338/, there mentions default credentials: `root/password` and boom! we are logged as Admin user in the Request Tracker.

Checking the users section, we can find a user and in the comments, we can see the password. If we try to SSH with that credentials, it just works :) and we got the user flag.

## Privilege escalation

In the home folder of the user there are some files that looks like a KeePass dump and database. Most likely, we need to extract the master password from it and import into a local instance of keepass.

Looks like keepass had a vulnerability and the master password can be extracted from a dump, see https://github.com/CMEPW/keepass-dump-masterkey

If we run that script it will generate a list of candidates that will lack the first character. We might need to think a bit on how to recover all the pass phrase. Maybe a google search with the guessed characters will help ...

Once we have the keepass passwword, we can browse the keys stored using `kpcli`. There we find the entries for root and for the user. We find the root entry as a putty key file, which we need to convert to openssh key using `puttygen`

