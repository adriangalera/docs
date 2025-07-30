# Fluffy

As is common in real life Windows pentests, you will start the Fluffy box with credentials for the following account: `j.fleischman` / J0elTHEM4n1990!

## Enumeration

We are told this is a Windows box

Normal nmap scan reveals a lot of stuff opened:

```bash
└─$ nmap 10.10.11.69
Starting Nmap 7.95 ( https://nmap.org ) at 2025-07-30 13:13 CEST
Nmap scan report for 10.10.11.69
Host is up (0.034s latency).
Not shown: 989 filtered tcp ports (no-response)
PORT     STATE SERVICE
53/tcp   open  domain
88/tcp   open  kerberos-sec
139/tcp  open  netbios-ssn
389/tcp  open  ldap
445/tcp  open  microsoft-ds
464/tcp  open  kpasswd5
593/tcp  open  http-rpc-epmap
636/tcp  open  ldapssl
3268/tcp open  globalcatLDAP
3269/tcp open  globalcatLDAPssl
5985/tcp open  wsman

Nmap done: 1 IP address (1 host up) scanned in 6.77 seconds
```

Looks like SMB ports are opened, let's check what in there:

```
└─$ smbclient -L \\10.10.11.69 -N     

        Sharename       Type      Comment
        ---------       ----      -------
        ADMIN$          Disk      Remote Admin
        C$              Disk      Default share
        IPC$            IPC       Remote IPC
        IT              Disk      
        NETLOGON        Disk      Logon server share 
        SYSVOL          Disk      Logon server share 
Reconnecting with SMB1 for workgroup listing.
do_connect: Connection to 10.10.11.69 failed (Error NT_STATUS_RESOURCE_NAME_NOT_FOUND)
Unable to connect with SMB1 -- no workgroup available
```

In the IT share we see some interesting things:

```shell
└─$ smbclient \\\\10.10.11.69\\IT --user="j.fleischman"
Password for [WORKGROUP\j.fleischman]:
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Wed Jul 30 17:27:03 2025
  ..                                  D        0  Wed Jul 30 17:27:03 2025
  Everything-1.4.1.1026.x64           D        0  Fri Apr 18 17:08:44 2025
  Everything-1.4.1.1026.x64.zip       A  1827464  Fri Apr 18 17:04:05 2025
  KeePass-2.58                        D        0  Fri Apr 18 17:08:38 2025
  KeePass-2.58.zip                    A  3225346  Fri Apr 18 17:03:17 2025
  Upgrade_Notice.pdf                  A   169963  Sat May 17 16:31:07 2025

                5842943 blocks of size 4096. 2236192 blocks available
smb: \> pwd
Current directory is \\10.10.11.69\IT\
```

In the SYSVOL, there's also an interesting file:

```shell
└─$ smbclient \\\\10.10.11.69\\SYSVOL --user="j.fleischman"
Password for [WORKGROUP\j.fleischman]:
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Thu Apr 17 17:59:21 2025
  ..                                  D        0  Thu Apr 17 17:59:21 2025
  fluffy.htb                         Dr        0  Thu Apr 17 17:59:21 2025

                5842943 blocks of size 4096. 2236145 blocks available
smb: \>
```
This looks like some Active Directory policies or something similar. According to https://blog.netwrix.com/2017/01/30/sysvol-directory/ 

> The system volume (SYSVOL) is a special directory on each DC. It is made up of several folders with one being shared and referred to as the SYSVOL share.

We'll now exfiliate the files from the samba share to our computer to analyze them.

The PDF warns the sysadm to patch the system to mitigate the impact of the following CVEs:

CVE-2025-24996 - Critical
CVE-2025-24071 - Critical
CVE-2025-46785 - High
CVE-2025-29968 - High
CVE-2025-21193 - Medium
CVE-2025-3445  - Low

Most likely one of these vulnerabilities will be useful to us

The networks shares contain some zip files containing some exe files. Maybe there are useful somehow?

- everything-1.4.1.exe: https://www.voidtools.com/faq/
- kepass-2.58.exe: https://keepass.info/news/n250709_2.59.html

We can enumerate all the users in the machine with `crackmapexec`:

```bash
crackmapexec smb fluffy.htb -u anonymous -p "" --rid-brute 10000 > users     
```

And discard garbage data:

```bash
cat users|grep -i user |rev |cut -f2 -d ' ' |rev |grep FLUFFY |cut -f2 -d '\' |grep -Ev (DC|SVC) |tail -n +4 > users.txt
```