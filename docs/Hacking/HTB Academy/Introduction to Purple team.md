# Introduction to Purple team

Purple team is a mix of Red team (offensive) and Blue team (defensive) security teams.

## Windows tooling

System monitoring, event logging

| Name   | Description                                   |
| ------ | --------------------------------------------- |
| Sysmon | Provides detailed event logging and detection |

Log analysis

| Name                 | Description                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------- |
| Eric Zimmerman Tools | Forensic utilities for analyzing digital evidence, such as registry hives and event logs. |

Threat detection & Monitoring

| Name         | Description                                                           |
| ------------ | --------------------------------------------------------------------- |
| Yara         | Signature-based file scanning tool.                                   |
| Chainsaw     | Command-line tool for parsing and hunting through Windows Event Logs. |
| Sigma        | Generic signature format for SIEM rule creation.                      |
| Zircolite    | Sigma-based EVTX log analysis.                                        |
| Osquery      | Endpoint monitoring using SQL-like queries.                           |
| Velociraptor | Endpoint monitoring, collection, and response.                        |
| Velociraptor | Endpoint monitoring, collection, and response.                        |

Traffic Capturing

| Name      | Description                               |
| --------- | ----------------------------------------- |
| Wireshark | Packet capture tool for network analysis. |

Memory dumping

| Name    | Description                                  |
| ------- | -------------------------------------------- |
| DumpIt  | Memory dumping utility for memory forensics. |
| WinPmem | Memory dumping utility for memory forensics. |

Memory Forensics

| Name          | Description                                       |
| ------------- | ------------------------------------------------- |
| Volatility v2 | Memory forensics tool for analyzing memory dumps. |
| Volatility v3 | Memory forensics tool for analyzing memory dumps. |

Additional Telemetry

| Name                   | Description                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| SilkETW                | C# wrappers for ETW.                                                                      |
| SealighterTI           | Running Microsoft-Windows-Threat-Intelligence without a driver.                           |
| AMSI-Monitoring-Script | Extracting script contents using the AMSI ETW provider.                                   |
| JonMon                 | Collection of open-source telemetry sensors.                                              |
| Fibratus               | Adversary tradecraft detection using behavior-driven rule engine and YARA memory scanner. |

Adversary Simulation

| Name            | Description                                                        |
| --------------- | ------------------------------------------------------------------ |
| Atomic Red Team | Small and highly portable detection tests based on MITRE's ATT&CK. |

Malware/Process/PE Analysis

| Name               | Description                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| CFF-Explorer       | Examine and edit Portable Executable (PE)                                                                           |
| Ghidra             | Reverse engineering framework                                                                                       |
| x64dbg             | x64/x32 debugger for windows                                                                                        |
| SpeakEasy          | Binary emulator to emulate Windows kernel and user mode malware                                                     |
| SysInternalsSuite  | Sysinternals Troubleshooting Utilities                                                                              |
| Get-InjectedThread | Looks for threads that were created as a result of code injection.                                                  |
| Hollows Hunder     | Scan all running processes. Recognizes and dumps a variety of implants.                                             |
| Moneta             | Live usermode memory analysis tool for Windows                                                                      |
| PE-Sleve           | Detects malware running on the system, as well as collects the potentially malicious material for further analysis. |
| API-Monitor        | Monitors and controls API calls made by applications and services.                                                  |
| PE-Bear            | Multiplatform reversing tool for PE files.                                                                          |
| ProcessHacker      | Monitors system resources, debugs software and detects malware.                                                     |
| ProcMonX           | Extended Process Monitor-like tool based on Event Tracing for Windows.                                              |
| Frida              | Dynamic instrumentation toolkit for reverse-engineers. Helps to trace, instrument, debug and hook API functions     |
| LitterBox          | Malware sandbox environment for payload behavior testing.                                                           |

## Windows logging

- Sysmon

Sysmon (System Monitor) is a powerful system activity monitoring tool within the Microsoft Sysinternals suite. Sysmon logs can be viewed in the Event Viewer by navigating to Applications and Services Logs > Microsoft > Windows > Sysmon.

Sysmon logs are stored as part of the Windows Event Log system. The logs are located on disk at the following default path:

`C:\Windows\System32\winevt\Logs\Microsoft-Windows-Sysmon%4Operational.evtx`

Event ID 1 in sysmon logs are events for process creation.

- Command Line Logging

Command Line Logging captures information about processes and their command-line arguments, which is useful for detecting suspicious activity, such as unauthorized execution of commands. The relevant Windows event ID is 4688 (A new process has been created). These can be seen in Windows Event Log, Sysmon and JonMon.

Stored in disk in `C:\Windows\System32\winevt\Logs\Security.evtx`

- PowerShell Logging

 Script block logging captures the full content of scripts that are executed, including obfuscated or dynamically generated code. This is crucial for detecting sophisticated attacks. The Event ID for Script Block Logging is 4104. PowerShell logs can be viewed in the Event Viewer by navigating to Applications and Services Logs > Microsoft > Windows > PowerShell.

 Stored in disk in `C:\Windows\System32\winevt\Logs\Microsoft-Windows-PowerShell%4Operational.evtx`

 - Console History

The console history is stored in the user's profile directory at the following location:

C:\Users\%username%\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadline\ConsoleHost_history.txt

- Audit policies

Verbose auditing provides comprehensive tracking of both success and failure events across the system. Audit policy logs provide detailed insights into system access, privilege usage, and security settings modifications.

They are stored by default in `C:\Windows\System32\winevt\Logs\Security.evtx`.

- Windows Firewall Logs

Windows Firewall logs provide detailed information about inbound and outbound network connections, including allowed and blocked connections.

Stored in `C:\Windows\System32\LogFiles\Firewall\pfirewall.log`

here is another event (Event ID 5156) that is logged by the Windows Filtering Platform (WFP), which is responsible for processing network packets.

- JonMon

By combining data from both the kernel-level and user-mode components, JonMon provides users with a comprehensive view of their security activity. This is installed as a service in the host. JonMon-generated logs can be viewed in the Event Viewer by navigating to Applications and Services Logs > JonMon.

- SealighterTI

The Microsoft-Windows-Threat-Intelligence Event Tracing for Windows (ETW) provider is a robust tool for detecting process injection and other types of attacks.  SealighterTI facilitates the logging of events from the Microsoft-Windows-Threat-Intelligence provider into the Windows Event Log, enhancing visibility into such activities. Runs in the background via a scheduled task.  Applications and Service Logs > Sealighter

## Dumping and analyzing Windows Memory

Memory dumping is a vital capability in forensic investigations, enabling the capture of the current state of a system's volatile memory for detailed post-incident analysis. This snapshot provides a wealth of information, such as active processes, loaded drivers, network connections, and potential malicious artifacts that may not be visible on disk.

We can use `DumpIt` or `WinPmem` to create a full memory dump.

To analyze the memory, we'll use `Volatility v2/3`.

## Linux toolings

System monitoring and auditing

| Tool           | Path             | Description                                    |
| -------------- | ---------------- | ---------------------------------------------- |
| Sysmon (Linux) | /usr/bin/sysmon  | Provides detailed event logging and detection. |
| Auditd         | /usr/sbin/auditd | Auditing tool to track system-level events.    |


Threat detection and monitoring

| Tool         | Path                         | Description                                               |
| ------------ | ---------------------------- | --------------------------------------------------------- |
| YARA         | /usr/local/bin/yara          | Signature-based file scanning tool.                       |
| Sigma        | /usr/local/bin/sigma         | Generic signature format for SIEM rule creation.          |
| Suricata     | /usr/bin/suricata            | Open-source IDS/IPS with network monitoring capabilities. |
| osquery      | /usr/bin/osqueryi            | Endpoint monitoring using SQL-like queries.               |
| Zircolite    | /root/zircolite/zircolite.py | Sigma-based EVTX log analysis.                            |
| Velociraptor | /usr/local/bin/velociraptor  | Endpoint monitoring, collection, and response.            |
| bpftrace     | /usr/bin/bpftrace            | High-level tracing language for Linux                     |


Traffic capturing: tcpdump / wireshark

Memory extractor: LiME: `/root/LiME/src/lime-5.15.0-71-generic.ko`

Memory dump analysis: Volatility v2: `/root/volatility-master/vol.py`

Adversary simulation: Atomic Read team: `/root/AtomicRedTeam`. Small and highly portable detection tests based on MITRE's ATT&CK.

## Linux logging

Sysmon exists in Linux as well and you can see the output in syslog:

```bash
cat /var/log/syslog | /opt/sysmon/sysmonLogView
```

`audit` is a Linux daemon that collects, processes, and records audit log events to disk.

The logs are stored in `/var/log/audit/audit.log`. You can use `aureport` or `ausearch` to analyze them efficiently:

```bash
ausearch -k rootcmd -i
```

## Dumping memory in Linux

We'll use LiME (Linux Memory Extractor) kernel module to dump memory:

```bash
sudo insmod lime-5.15.0-71-generic.ko "path=/tmp/dump.mem format=lime"
```

To analyze the dump, one can use `Volatily v2`. In this example, we are interested in knowing which active tasks are in the memory dump:

```bash
python2.7 vol.py -f /tmp/dump.mem --profile=LinuxUbuntu_5_15_0-71-generic_profilex64 linux_pslist
```

- `--profile=LinuxUbuntu_5_15_0-71-generic_profilex64` specifies the memory format
- `linux_pslist` is a volatility plugin to retrieve the list of processes in the particular dump.