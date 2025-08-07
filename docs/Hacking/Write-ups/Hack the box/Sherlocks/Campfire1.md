---
slug: /write-up/htb/sherlocks/campfire1
pagination_next: null
pagination_prev: null
---

# Campfire 1

https://app.hackthebox.com/sherlocks/737

Alonzo Spotted Weird files on his computer and informed the newly assembled SOC Team. Assessing the situation it is believed a Kerberoasting attack may have occurred in the network. It is your job to confirm the findings by analyzing the provided evidence. You are provided with: 1- Security Logs from the Domain Controller 2- PowerShell-Operational Logs from the affected workstation 3- Prefetch Files from the affected workstation

https://www.crowdstrike.com/en-us/cybersecurity-101/cyberattacks/kerberoasting/
https://www.hackthebox.com/blog/kerberoasting-attack-detection
https://techantidote.com/dfir-analyze-windows-event-logs-evtx-from-a-linux-machine-using-sigma-rules-chainsaw-and-evtx-dump/
https://www.hackingarticles.in/forensic-investigation-prefetch-file/
https://ericzimmerman.github.io/#!index.md

Install:

- https://github.com/WithSecureLabs/chainsaw a tool to search what happened inside Windows Forensic artifacts
- https://github.com/SigmaHQ/sigma rules to detect threats
- https://ericzimmerman.github.io/#!index.md

And execute chainsaw to analyze the event logs:

```bash
./chainsaw hunt ~/workspace/gal/htb/Sherlocks/Campfire-1/Triage/Domain\ Controller -s ~/workspace/tools/sigma --mapping mappings/sigma-event-logs-all.yml -r ~/workspace/tools/sigma/rules --csv --output ~/workspace/gal/htb/Sherlocks/Campfire-1/Triage/Domain\ Controller/chainsaw
```

To analyze prefetch files, we'll move to a Windows VM.

There use `pecmd` application (from https://ericzimmerman.github.io/#!index.md) to generate the CSV:

```powershell
.\PECmd.exe -d C:\Users\gal\Desktop\campfire1\Workstation\2024-05-21T033012_triage_asset\ --csv . --csvf C:\Users\gal\Desktop\prefetch.csv
```

Now, we'll use the Timeline explorer tool (from https://ericzimmerman.github.io/#!index.md) to analyze the csv
