# Digital Forensics and Incident Response

This files contains general guidelines to provide support for DFIR activities. This knowledge comes from solving the Sherlock challenges from HTB.

## auth.log and wtmp

The auth.log file is primarily used for tracking authentication mechanisms. Whenever a
user attempts to log in, switch users, or perform any task that requires authentication, an
entry is made in this log file. This includes activities involving sshd (SSH daemon), sudo
actions, and cron jobs requiring authentication.

An example entry has been detailed below:

```
The entry above shows a failed password attempt for a user named "admin" on
exampleserver from a source IP of 192.168.1.101 over port 22 (SSH). 
```

`auth.log` is human readable.

The `wtmp` file logs all login and logout events on the system. It's a binary file, typically
located at /var/log/wtmp . The last command can be used to read this file, providing a
history of user logins and logouts, system reboots, and runlevel changes.

Since it's a binary file, it worth considering that the arch of the victim might be different from the arch of the researcher, so you might want to use some kind of script such as https://gist.github.com/4n6ist/99241df331bb06f393be935f82f036a5 to perform the research.

## evtx

Windows event logs are provided with `evtx` format. Is is a binary format, in order to read it and process it, you can use chainsaw and sigma-rules to detect possible threats.

- https://github.com/WithSecureLabs/chainsaw a tool to search what happened inside Windows Forensic artifacts
- https://github.com/SigmaHQ/sigma rules to detect threats

e.g:

```bash
./chainsaw hunt ~/workspace/gal/htb/Sherlocks/Campfire-1/Triage/Domain\ Controller -s ~/workspace/tools/sigma --mapping mappings/sigma-event-logs-all.yml -r ~/workspace/tools/sigma/rules --csv --output ~/workspace/gal/htb/Sherlocks/Campfire-1/Triage/Domain\ Controller/chainsaw
```

and it can generate CSV output:

```bash
./chainsaw hunt ~/workspace/gal/htb/Sherlocks/Campfire-1/Triage/Domain\ Controller -s ~/workspace/tools/sigma --mapping mappings/sigma-event-logs-all.yml -r ~/workspace/tools/sigma/rules --csv --output ~/workspace/gal/htb/Sherlocks/Campfire-1/Triage/Domain\ Controller/chainsaw
```

## prefetch files

Windows can be configured to generate a file the first time a binary is executed. This can be very helpful while collecting evidences of attacks. You can analyze them on a Windows machine using the following tools from  https://ericzimmerman.github.io/#!index.md:

-`PECmd`: analyze the prefetch files and outputs a CSV:

.\PECmd.exe -d C:\Users\gal\Desktop\campfire1\Workstation\2024-05-21T033012_triage_asset\ --csv . --csvf C:\Users\gal\Desktop\prefetch.csv

- `Timeline Explorer`: Load the generated CSV and it will display the CSV data visually.