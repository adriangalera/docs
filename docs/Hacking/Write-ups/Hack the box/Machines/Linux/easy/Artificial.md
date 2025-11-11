---
slug: /write-up/htb/machines/easy/artificial
pagination_next: null
pagination_prev: null
---

# Enumeration

A simple nmap scan reveals interesting stuff:

```shell
└─$ nmap 10.10.11.74                          
Starting Nmap 7.95 ( https://nmap.org ) at 2025-07-29 11:16 CEST
Nmap scan report for 10.10.11.74
Host is up (0.035s latency).
Not shown: 997 closed tcp ports (reset)
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
8000/tcp open  http-alt

Nmap done: 1 IP address (1 host up) scanned in 0.88 seconds
```

In port 80 is a nginx server redirecting to http://artificial.htb

In port 8000 is a python `SimpleHTTP` server:
```
0000: Server: SimpleHTTP/0.6 Python/3.8.10
```
It's displaying the directory contents of some python application

Exploring the nginx server, we come up with a login page: http://artificial.htb/register we can try to explore SQL injections and so on.

We can register a user and login to see a form that allows to upload an AI model in h5 (????) format


# Foothold

In the 8000 we can see the app source code and the database. We can explore the database to see if we see something interesting.

Looks like there are user/password stored hashed only with md5 (and no salt), we can try to do a rainbow tables attack to reveal the passwords. Maybe one of the passwords of the xx@artificial.htb users will grant us access via ssh to the machine:

```shell
hashcat --show -m 0 -a 0 hashes.txt rockyou.txt
```

We got lucky and got two user/password from artificial.htb, let's try SSH. Bingo! User `gael` give us access to the user flag.

# Lateral movement

Now, we have a user to try to escalate privileges.

Running `ps aux` shows some weird usage of `xxd` command. Nothing important, looks like it's something related with the internal usage of DNS.

Checking what's listening in the server, we got some weird service ports:

```shell
tcp        0      0 0.0.0.0:8000            0.0.0.0:*               LISTEN     
tcp        0      0 127.0.0.1:5000          0.0.0.0:*               LISTEN     
tcp        0      0 127.0.0.1:9898          0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN     
tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN    
```

WTF is listening in 5000 and 9898? 

In 5000 it's the application running, most likely proxied somehow to port 80
In 9898 it's running something service a small gzip file. Let's try to download it and see what's inside.

Let's do a SSH port forwarding to check the website from our attacker machine:

```
ssh -L  5000:localhost:5000 gael@artificial.htb
```

Interesting, in 9898 there's something called `Backrest` version 1.7.2 running and asking for user/password. Potentially is this: https://github.com/garethgeorge/backrest. Let's try to log in with the default credentials or the credentials we extracted before.

Everything looks good with backrest.

Another potential vector is abusing of the h5 file model:

https://hiddenlayer.com/innovation-hub/models-are-code/
https://splint.gitbook.io/cyberblog/security-research/tensorflow-remote-code-execution-with-malicious-model

So, now we can prepare a reverse shell to get RCE with `app` user and later do privilege escalation.

With the most basic reverse shell it works.

# Privilege escalation

Backrest handles backups, looks like there's a `/var/backups/` folder that contains one file owned by the same group as `gael` user:

```shell
gael@artificial:/var/backups$ ls -l
total 51220
-rw-r--r-- 1 root root      38602 Jun  9 10:48 apt.extended_states.0
-rw-r--r-- 1 root root       4253 Jun  9 09:02 apt.extended_states.1.gz
-rw-r--r-- 1 root root       4206 Jun  2 07:42 apt.extended_states.2.gz
-rw-r--r-- 1 root root       4190 May 27 13:07 apt.extended_states.3.gz
-rw-r--r-- 1 root root       4383 Oct 27  2024 apt.extended_states.4.gz
-rw-r--r-- 1 root root       4379 Oct 19  2024 apt.extended_states.5.gz
-rw-r--r-- 1 root root       4367 Oct 14  2024 apt.extended_states.6.gz
-rw-r----- 1 root sysadm 52357120 Mar  4 22:19 backrest_backup.tar.gz
gael@artificial:/var/backups$ id
uid=1000(gael) gid=1000(gael) groups=1000(gael),1007(sysadm)
```

When we decompress that file, we found out a file `backrest/.config/backrest/config.json` which contains the password with bcrypt:

```json
    "users": [
      {
        "name": "backrest_root",
        "passwordBcrypt": "JDJhJDEwJGNWR0l5OVZNWFFkMGdNNWdpbkNtamVpMmtaUi9BQ01Na1Nzc3BiUnV0WVA1OEVCWnovMFFP"
      }
    ]
```

We can do base64 decode and do a hashcat attack to guess the password:

```shell
hashcat -a 0 -m 3200 hashes-backrest.txt /usr/share/wordlists/rockyou.txt
```

Now we have access to backrest as the `root` user. According to https://gtfobins.github.io/gtfobins/restic, we can configure backrest to send a backup to a server we own. We just need to configure it to send the contents of /root folder to a server we control.

Followed this approach running https://github.com/restic/rest-server in Docker and the backup is created. Later, you need to restore it with `restic` and you'll get the root flag, plus the SSH keys for the root user.