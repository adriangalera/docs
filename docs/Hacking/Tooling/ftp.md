---
slug: /tooling/ftp
pagination_next: null
pagination_prev: null
---

Stands for File transfer protocol. It listens on port 21 by deault and is unencrypted (the secure version is called sftp)

The first thing to try while trying to access ftp is user `anonymous` whitout password.

Commands:
- `ls`: list directory contents
- `pass`: set passive mode
- `get`: retrieve file to computer

Examples

```
ftp <ip>
Connected to <ip>.
220 (vsFTPd 3.0.3)
Name (<ip>:gal): anonymous
331 Please specify the password.
Password:
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls
500 Illegal PORT command.
ftp: bind: Address already in use
ftp> pass
Passive mode on.
ftp> ls
227 Entering Passive Mode (10,129,103,239,82,68).
150 Here comes the directory listing.
-rw-r--r--    1 0        0              32 Jun 04  2021 flag.txt
226 Directory send OK.
ftp> get flag.txt /tmp/flag.txt
local: /tmp/flag.txt remote: flag.txt
227 Entering Passive Mode (10,129,103,239,159,232).
150 Opening BINARY mode data connection for flag.txt (32 bytes).
226 Transfer complete.
32 bytes received in 0.00 secs (21.1291 kB/s)
```

* in order to use the `ls` command, we need to set the Passive mode by issuing the `pass` command

Download all contents of ftp-server:

```
wget -m ftp://username:password@ip.of.old.host
```

To see hidden files:

```
ls -la
```
