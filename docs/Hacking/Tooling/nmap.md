---
slug: /tooling/nmap
pagination_next: null
pagination_prev: null
---

nmap is a port scanner tool. By default it scan ports from 0-1000.

## Scan all

You can pass the `-A` flag which enables OS detection, version detection, script scanning, and traceroute, however that is very easy to detect by an IDS/IPS system.

```bash
nmap -A <ip>
```

## Service version detection

To enable only service version detection:
```bash
nmap -sV <ip>
```

-sV flag does scanning and prints service and version on the found open port

To specify the default set of scripts for version identification use `-sC` 

```bash
nmap -sC <ip>
```

## Scan all ports

To scan all the ports, we need to specify this flags:

```bash
namp -p- <ip>
```

Take into account that this operation will take a long time to complete.

`--min-rate` speeds up the process by sending packets not slower than X messages per second.

## Firewall evasion

If nmap reports he has issues because could not determine if port open or closed. The machine might be protected by a firewall, instead of performing a TCP SYN scan, you can use a TCP FIN scan by providing the flag `-sF`

You can disable ping scan (blocked by firewalls) by disabling host discovery: `-Pn`.

## Disable DNS resolution

You can disable DNS resolution with `-n`
