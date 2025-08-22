---
slug: /write-up/htb/machines/easy/codetwo
pagination_next: null
pagination_prev: null
draft: true
---

# CodeTwo

## Enumeration

Web Application running in port 8000:

```
At CodeTwo, we provide a platform designed to help developers quickly write, save, and run their JavaScript code
```

It is a webpage that allows to execute JS, but there's a catch.. looks like the server is a `gunicorn` one, so most likely there's a python backend. Looks like we're dealing with a server running python and a JS sandbox library such as `js2py` or something similar.

There's a cookie named `session` that looks like a JWT token, but it is not. It's a Flask signed cookie:

```bash
flask-unsign --decode --cookie 'eyJ1c2VyX2lkIjozLCJ1c2VybmFtZSI6IjEyMzQifQ.aKdBbw.jd5pRsxNMAaHejkYelD8Nea3Zq4'
{'user_id': 3, 'username': '1234'}
```

In the download button, we can download the source code and we have the source code and the secret key to generate the signed cookie.

Trying to forge it was successful in local but unsuccessful in the target, so probably the secret key is not the same in the target.

## Foothold

Checking the source code, it was easy to identify the JS sandbox: `js2py` which has some available pocs in github. Since we have the source code, we can even determine if the app is vulnerable or not: the poc had an utility to verify if the app is vulnerable or not.

After that, we can create a payload and put a reverse shell on it.

## Lateral movement

The reverse shell user was `app`. To get a real users, we can leverage on the database to reveal the user `marco` with a hash that was bruteforced with hashcat easily:

```shell
hashcat -m 0 -a 0 hashes.txt /usr/share/wordlists/rockyou.txt
```

And we got user flag!

## Privilege escalation

No weird applications running on port.

Looks like the machine is using https://github.com/netinvent/npbackup to do backups.

Our user can run some `npbackup` command as root without password:

```bash
marco@codetwo:/opt/npbackup-cli$ sudo -l
Matching Defaults entries for marco on codetwo:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User marco may run the following commands on codetwo:
    (ALL : ALL) NOPASSWD: /usr/local/bin/npbackup-cli
```

The idea is to abuse of the `sudo` permission to create a backup of the root folder and later retrieve the flag.

```bash
sudo /usr/local/bin/npbackup-cli -c npbackup.conf --backup
sudo /usr/local/bin/npbackup-cli -c npbackup.conf --dump /root/root.txt --snapshot-id 9575e23c
```
