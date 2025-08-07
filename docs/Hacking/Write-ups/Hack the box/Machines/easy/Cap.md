---
slug: /write-up/htb/machines/easy/cap
pagination_next: null
pagination_prev: null
draft: true
---

# Cap

## Enumeration

Let's do network enumeration with nmap:

```bash
└─$ nmap 10.10.10.245       
Starting Nmap 7.95 ( https://nmap.org ) at 2025-08-06 22:56 CEST
Nmap scan report for 10.10.10.245
Host is up (0.034s latency).
Not shown: 997 closed tcp ports (reset)
PORT   STATE SERVICE
21/tcp open  ftp
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 0.84 seconds
```

FTP does not allow anonymous access

Whatweb reveals gunicorn server:

```bash
whatweb 10.10.10.245                
http://10.10.10.245 [200 OK] Bootstrap, Country[RESERVED][ZZ], HTML5, HTTPServer[gunicorn], IP[10.10.10.245], JQuery[2.2.4], Modernizr[2.8.3.min], Script, Title[Security Dashboard], X-UA-Compatible[ie=edge]
```

## Foothold

Looks like in the download area, we can pass a parameter and it will us access to captures that are not ours:

http://10.10.10.245/data/0

and we can see the ftp password for `nathan`. Unfortunately for him, he reused the same password for SSH and we can get the flag.

## Privilege escalation

Use linPEAS to search for possible privesc vectors

The output of linPEAS show:

```
Files with capabilities (limited to 50):
/usr/bin/python3.8 = cap_setuid,cap_net_bind_service+eip
```

python 3.8 has `setuid` capability, which will allow the process to set the userid. We can abuse this to set uid to 0 (root) and get a root shell and retrieve the root flag.