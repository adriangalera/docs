---
slug: /write-up/htb/machines/easy/editor
pagination_next: null
pagination_prev: null
draft: true
---
# Editor

https://app.hackthebox.com/machines/Editor

## Enumeration

└─$ nmap 10.10.11.80    
Starting Nmap 7.95 ( https://nmap.org ) at 2025-08-09 00:52 CEST
Nmap scan report for 10.10.11.80
Host is up (0.29s latency).
Not shown: 997 closed tcp ports (reset)
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
8080/tcp open  http-proxy

ssh, a website on 80 and a `xwiki` service on 8080. `xwiki` version is vulnerable to RCE, here's the poc:

https://github.com/dollarboysushil/CVE-2025-24893-XWiki-Unauthenticated-RCE-Exploit-POC

The reverse shell worked like a charm! But we land in xwiki user.

## Lateral movement

Digging into the configuration files, we can see the mysql credentials:

```xml
<property name="hibernate.connection.url">jdbc:mysql://localhost/xwiki?useSSL=false&connectionTimeZone=LOCAL&allowPublicKeyRetrieval=true</property>
<property name="hibernate.connection.username">xwiki</property>
<property name="hibernate.connection.password">theEd1t0rTeam99</property>
```

Checking `/etc/passwd`, we discover there's a user named `oliver` in the machine. We can try to login with SSH and the found password and boom. We got SSH access to the user!

## Privilege escalation

Interestingly oliver belongs to a group named `netdata`:

```bash
oliver@editor:~$ id
uid=1000(oliver) gid=1000(oliver) groups=1000(oliver),999(netdata)
```

Which is a service listening in localhost:

```bash
oliver@editor:~$ netstat -putona |grep "LISTEN"
tcp        0      0 127.0.0.1:33597         0.0.0.0:*               LISTEN      -                    off (0.00/0/0)
tcp        0      0 127.0.0.1:33060         0.0.0.0:*               LISTEN      -                    off (0.00/0/0)
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      -                    off (0.00/0/0)
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      -                    off (0.00/0/0)
tcp        0      0 127.0.0.1:8125          0.0.0.0:*               LISTEN      -                    off (0.00/0/0)
tcp        0      0 127.0.0.1:19999         0.0.0.0:*               LISTEN      -                    off (0.00/0/0)
tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN      -                    off (0.00/0/0)
tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN      -                    off (0.00/0/0)
tcp6       0      0 :::80                   :::*                    LISTEN      -                    off (0.00/0/0)
tcp6       0      0 :::22                   :::*                    LISTEN      -                    off (0.00/0/0)
tcp6       0      0 :::8080                 :::*                    LISTEN      -                    off (0.00/0/0)
tcp6       0      0 127.0.0.1:8079          :::*                    LISTEN      -                    off (0.00/0/0)
```

Let's do port forwarding via SSH and see what is this:

```bash
ssh -L  19999:localhost:19999 oliver@editor.htb
```

Looks there's an interesting vulnerability for privilege escalation in netdata: https://securityvulnerability.io/vulnerability/CVE-2024-32019 and looks the version installed is vulnerable to this.

Follow the steps and you'll get root shell and flag.