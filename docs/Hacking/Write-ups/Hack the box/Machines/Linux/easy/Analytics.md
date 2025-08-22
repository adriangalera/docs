---
slug: /write-up/htb/machines/easy/analytics
pagination_next: null
pagination_prev: null
---

## Enumeration

```bash
nmap 10.10.11.233 -A -oA machines/analytics/enumeration/scans/all-ports -p- --min-rate 1000
```
Shows ports 22 and 80.

SSH version looks quite recent, let's focus on port 80:

```bash
http://analytical.htb [200 OK] Bootstrap, Country[RESERVED][ZZ], Email[demo@analytical.com,due@analytical.com], Frame, HTML5, HTTPServer[Ubuntu Linux][nginx/1.18.0 (Ubuntu)], IP[10.10.11.233], JQuery[3.0.0], Script, Title[Analytical], X-UA-Compatible[IE=edge], nginx[1.18.0]
```

Checking the website, I see a `Login` section that redirects to another subdomain: `data.analytical.htb`. Let's add it to the /etc/hosts. It shows the login page of Metabase, let's try some default credentials.

The metabase version looks like it's v0.46.6.

## Foothold

Found a POC for this precise version: https://blog.assetnote.io/2023/07/22/pre-auth-rce-metabase/

With the payload in the description and modifying it with our local IP,port we got foothold!

```bash
e4396eead2c0:/$ id
id
uid=2000(metabase) gid=2000(metabase) groups=2000(metabase),2000(metabase)
```

However, we cannot see any relevant users:
```
e4396eead2c0:~$ cat /etc/passwd|grep "home"
cat /etc/passwd|grep "home"
metabase:x:2000:2000:Linux User,,,:/home/metabase:/bin/ash
```

In that `/home/metabase` folder there's nothing and we see it's using `/bin/ash`, there's a high chance this is running inside a docker container. We'll need to investigate how to bypass it.

Right now we have access to the docker container, but we cannot exit it. 

We can exfil the database which looks like a H2 instance.

We can check the environment variables:

```bash
5d711b9d670a:/metabase.db$ env
env
SHELL=/bin/sh
MB_DB_PASS=
HOSTNAME=5d711b9d670a
LANGUAGE=en_US:en
MB_JETTY_HOST=0.0.0.0
JAVA_HOME=/opt/java/openjdk
MB_DB_FILE=//metabase.db/metabase.db
PWD=/metabase.db
LOGNAME=metabase
MB_EMAIL_SMTP_USERNAME=
HOME=/home/metabase
LANG=en_US.UTF-8
META_USER=metalytics
META_PASS=An4lytics_dsXXXX#
MB_EMAIL_SMTP_PASSWORD=
USER=metabase
SHLVL=4
MB_DB_USER=
FC_LANG=en-US
LD_LIBRARY_PATH=/opt/java/openjdk/lib/server:/opt/java/openjdk/lib:/opt/java/openjdk/../lib
LC_CTYPE=en_US.UTF-8
MB_LDAP_BIND_DN=
LC_ALL=en_US.UTF-8
MB_LDAP_PASSWORD=
PATH=/opt/java/openjdk/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
MB_DB_CONNECTION_URI=
JAVA_VERSION=jdk-11.0.19+7
_=/usr/bin/env
OLDPWD=/
```

We tried to use the user/password in env var and boom, we got user access.

## Privilege escalation

Search OS version and kernel for CVEs:

```
uname -a
Linux analytics 6.2.0-25-generic #25~22.04.2-Ubuntu SMP PREEMPT_DYNAMIC Wed Jun 28 09:55:23 UTC 2 x86_64 x86_64 x86_64 GNU/Linux
```

If we look in Google for `6.2.0-25-generic #25~22.04.2-Ubuntu CVE` you'll see this link: https://www.wiz.io/blog/ubuntu-overlayfs-vulnerability and this link https://github.com/g1vi/CVE-2023-2640-CVE-2023-32629

Now it's just a matter of cloning the repo and run the exploit and you get `root` access directly and pwned!