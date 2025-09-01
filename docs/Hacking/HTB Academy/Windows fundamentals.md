# Windows fundamentals

Windows OS have many different versions. In order to determine the version in PowerShell, we can use this command:

```ps1
PS C:\htb> Get-WmiObject -Class win32_OperatingSystem | select Version,BuildNumber
```

There are many ways to access remotely to a Windows server:

- Secure Shell: `SSH`
- File transfer protocol: `FTP`
- Virtual Network Computing: `VNC`
- Windows Remote Management (or Powershell Remoting): `WinRM`
- Remote Desktop Protocol: `RDP`

We can use RDP to connect to a Windows target from an attack host running Linux or Windows. In Linux, we'll use any RDP client such as `xfreerdp`:

```bash
xfreerdp /v:<targetIp> /u:htb-student /p:Password
```

While in Windows, we'll use the builtin Remote Desktop Connection (mstsc.exe). For this to work, remote access must already be allowed on the target Windows system.

## OS Structure

In Windows operating systems, the root directory is `<drive_letter>:\` (commonly C drive). The root directory (also known as the boot partition) is where the operating system is installed. Other physical and virtual drives are assigned other letters, for example, Data (E:). The directory structure of the boot partition is as follows:

| **Folder**              | **Description** |
|-------------------------|-----------------|
| **Perflogs**            | Can hold Windows performance logs but is empty by default. |
| **Program Files**       | On 32-bit systems, all 16-bit and 32-bit programs are installed here. On 64-bit systems, only 64-bit programs are installed here. |
| **Program Files (x86)** | 32-bit and 16-bit programs are installed here on 64-bit editions of Windows. |
| **ProgramData**         | A hidden folder that contains data essential for certain installed programs to run. This data is accessible by the program regardless of which user is running it. |
| **Users**               | Contains user profiles for each user who logs onto the system. Includes the **Public** and **Default** folders. |
| **Default**             | Default user profile template used when a new user is created. The new profile is based on this template. |
| **Public**              | Used to share files among all users. Accessible by all users and shared over the network by default (requires a valid network account). |
| **AppData**             | Hidden per-user application data folder (e.g., `cliff.moore\AppData`) containing: <br/> - **Roaming**: Machine-independent data (e.g., custom dictionaries).<br/> - **Local**: Machine-specific data, not synchronized.<br/> - **LocalLow**: Lower integrity level, used by apps in safe mode (e.g., browsers). |
| **Windows**             | Contains most files required for the Windows operating system. |
| **System, System32, SysWOW64** | Contains essential DLLs for Windows and the Windows API. These folders are searched when programs load DLLs without an absolute path. |
| **WinSxS**              | The Windows Component Store. Contains copies of all Windows components, updates, and service packs. |

We can use the `dir` command to list the contents of a folder. Also `ls` will work in modern Windows. 

`tree` command is very useful to see the directory structure. `tree` command can be piped to `more` to page the output: `tree c:\ /f | more`

## File system

There are 5 types of Windows file systems: FAT12, FAT16, FAT32, NTFS, and exFAT. FAT12 and FAT16 are no longer used on modern Windows operating systems.

### FAT32

FAT32 (File Allocation Table) is widely used across many types of storage devices such as USB memory sticks and SD cards but can also be used to format hard drives. The "32" in the name refers to the fact that FAT32 uses 32 bits of data for identifying data clusters on a storage device.

Pros of FAT32:

- Device compatibility - it can be used on computers, digital cameras, gaming consoles, smartphones, tablets, and more.
- Operating system cross-compatibility - It works on all Windows operating systems starting from Windows 95 and is also supported by MacOS and Linux.

Cons of FAT32:

- Can only be used with files that are less than 4GB.
- No built-in data protection or file compression features.
- Must use third-party tools for file encryption.

### NTFS

NTFS (New Technology File System) is the default Windows file system since Windows NT 3.1. In addition to making up for the shortcomings of FAT32, NTFS also has better support for metadata and better performance due to improved data structuring.

Pros of NTFS:

- NTFS is reliable and can restore the consistency of the file system in the event of a system failure or power loss.
- Provides security by allowing us to set granular permissions on both files and folders.
- Supports very large-sized partitions.
- Has journaling built-in, meaning that file modifications (addition, modification, deletion) are logged.

Cons of NTFS:

- Most mobile devices do not support NTFS natively.
- Older media devices such as TVs and digital cameras do not offer support for NTFS storage devices.

The NTFS file system has many basic and advanced permissions. Some of the key permission types are:

| **Permission**         | **Description** |
|------------------------|-----------------|
| **Full Control**       | Allows reading, writing, changing, and deleting of files/folders. |
| **Modify**             | Allows reading, writing, and deleting of files/folders. |
| **List Folder Contents** | Allows viewing and listing folders and subfolders, as well as executing files. Folders only inherit this permission. |
| **Read and Execute**   | Allows viewing and listing files and subfolders, as well as executing files. Inherited by both files and folders. |
| **Write**              | Allows adding files to folders/subfolders and writing to files. |
| **Read**               | Allows viewing and listing of folders/subfolders and viewing file contents. |
| **Traverse Folder**    | Allows moving through folders to reach other files/folders without needing permission to list folder contents. For example, with this permission, a user can access a file like `c:\users\bsmith\documents\webapps\backups\backup_02042020.zip` even without access to intermediate folders. |

Files and folders inherit the NTFS permissions of their parent folder for ease of administration. If permissions do need to be set explicitly, an administrator can disable permissions inheritance for the necessary files and folders and then set the permissions directly on each.

We can use the UI to setup the permissions, or the `icacls` command:

```ps1
C:\htb> icacls c:\windows
c:\windows NT SERVICE\TrustedInstaller:(F)
           NT SERVICE\TrustedInstaller:(CI)(IO)(F)
           NT AUTHORITY\SYSTEM:(M)
           NT AUTHORITY\SYSTEM:(OI)(CI)(IO)(F)
           BUILTIN\Administrators:(M)
           BUILTIN\Administrators:(OI)(CI)(IO)(F)
           BUILTIN\Users:(RX)
           BUILTIN\Users:(OI)(CI)(IO)(GR,GE)
           CREATOR OWNER:(OI)(CI)(IO)(F)
           APPLICATION PACKAGE AUTHORITY\ALL APPLICATION PACKAGES:(RX)
           APPLICATION PACKAGE AUTHORITY\ALL APPLICATION PACKAGES:(OI)(CI)(IO)(GR,GE)
           APPLICATION PACKAGE AUTHORITY\ALL RESTRICTED APPLICATION PACKAGES:(RX)
           APPLICATION PACKAGE AUTHORITY\ALL RESTRICTED APPLICATION PACKAGES:(OI)(CI)(IO)(GR,GE)

Successfully processed 1 files; Failed processing 0 files
```

The codes at the end mean:

- (CI): container inherit
- (OI): object inherit
- (IO): inherit only
- (NP): do not propagate inherit
- (I): permission inherited from parent container
- F : full access
- D :  delete access
- N :  no access
- M :  modify access
- RX :  read and execute access
- R :  read-only access
- W :  write-only access

Refer to https://ss64.com/nt/icacls.html for a full guide on the `icacls` command.

## Sharing

The Server Message Block protocol (SMB) is used in Windows to connect shared resources like files and printers.

NTFS permissions and share permissions are often understood to be the same. Please know that they are not the same but often apply to the same shared resource.

- Share permissions:

| **Permission**   | **Description** |
|------------------|-----------------|
| **Full Control** | Users are permitted to perform all actions given by **Change** and **Read** permissions, as well as change permissions for NTFS files and subfolders. |
| **Change**       | Users are permitted to read, edit, delete, and add files and subfolders. |
| **Read**         | Users are allowed to view file and subfolder contents. |

- NTFS permissions:

| **Permission**         | **Description** |
|------------------------|-----------------|
| **Full Control**       | Users are permitted to add, edit, move, and delete files & folders, as well as change NTFS permissions that apply to all allowed folders. |
| **Modify**             | Users are permitted or denied permissions to view and modify files and folders, including adding or deleting files. |
| **Read & Execute**     | Users are permitted or denied permissions to read the contents of files and execute programs. |
| **List Folder Contents** | Users are permitted or denied permissions to view a listing of files and subfolders. |
| **Read**               | Users are permitted or denied permissions to read the contents of files. |
| **Write**              | Users are permitted or denied permissions to write changes to a file and add new files to a folder. |
| **Traverse Folder / Execute File** | Users are permitted or denied permissions to access a subfolder within a directory structure even if access to the parent folder is denied. Also allows execution of programs. |
| **List Folder / Read Data**     | Users are permitted or denied permissions to view files and folders in the parent folder. Also allows opening and viewing files. |
| **Read Attributes**             | Users are permitted or denied permissions to view basic attributes of a file or folder (e.g., system, archive, read-only, hidden). |
| **Read Extended Attributes**    | Users are permitted or denied permissions to view extended attributes of a file or folder. These vary by program. |
| **Create Files / Write Data**   | Users are permitted or denied permissions to create files within a folder and modify file contents. |
| **Create Folders / Append Data**| Users are permitted or denied permissions to create subfolders. Allows data to be appended to existing files without overwriting. |
| **Write Attributes**            | Users are permitted or denied permissions to change file attributes. Does not allow creating files or folders. |
| **Write Extended Attributes**   | Users are permitted or denied permissions to change extended attributes of a file or folder. These vary by program. |
| **Delete Subfolders and Files** | Users are permitted or denied permissions to delete subfolders and files, but not the parent folder itself. |
| **Delete**                      | Users are permitted or denied permissions to delete parent folders, subfolders, and files. |
| **Read Permissions**            | Users are permitted or denied permissions to read the permissions set on a file or folder. |
| **Change Permissions**          | Users are permitted or denied permissions to change the permissions on a file or folder. |
| **Take Ownership**              | Users are permitted or denied permissions to take ownership of a file or folder. File owners can change any permissions. |

Keep in mind that NTFS permissions apply to the system where the folder and files are hosted. Folders created in NTFS inherit permissions from parent folders by default.

The share permissions apply when the folder is being accessed through SMB, typically from a different system over the network.

This means someone logged in locally to the machine or via RDP can access the shared folder and files by simply navigating to the location on the file system and only need to consider NTFS permissions. 

The permissions at the NTFS level provide administrators much more granular control over what users can do within a folder or file.

  > Windows Defender Firewall Considerations:
  >
  > The Windows Defender Firewall could potentially be blocking access to the SMB share. If we are connecting from a Linux-based system the firewall will block access since it will block access from any device that is not joined to the same workgroup.
  >
  > It is also important to note that when a Windows system is part of a workgroup, all `netlogon` requests are authenticated against that particular Windows system's SAM database. When a Windows system is joined to a Windows Domain environment, all `netlogon` requests are authenticated against Active Directory.
  >
  >- Local SAM database is used for login with workgroup
  >- Active Directory is used for login with Windows Domain

Once a SMB share is ready, we can mount it in a Linux machine by running:

```bash
sudo mount -t cifs -o username=htb-student,password=Academy_WinFun! //ipaddoftarget/"Company Data" /home/user/Desktop/
```

In Windows, we can use `net share` command to see what is actually sharing. Surprisingly, we see that C:\ is shared:

```ps1
C:\Users\htb-student> net share

Share name   Resource                        Remark

-------------------------------------------------------------------------------
C$           C:\                             Default share
IPC$                                         Remote IPC
ADMIN$       C:\WINDOWS                      Remote Admin
Company Data C:\Users\htb-student\Desktop\Company Data

The command completed successfully.
```

We didn't manually share C:. The most important drive with the most critical files on a Windows system is shared via SMB at install. This means anyone with the proper access could remotely access the entire C:\ of each Windows system on a network.

You can also use `Computer Management` if you want a GUI to manage Shares, Sessions or Open files.

You can view access logs of the shared data in `Event Viewer`. For example, we can view the logs created for every action we performed when accessing the Windows 10 target box, as well as when creating, editing and accessing the shared folder.

## Windows Services and processes

Services are a major component of the Windows operating system. They allow for the creation and management of long-running processes. Windows services can be started automatically at system boot without user intervention. These services can continue to run in the background even after the user logs out of their account on the system.

Windows services are managed via the Service Control Manager (SCM) system, accessible via the services.msc MMC add-in. It is also possible to query and manage services via the command line using sc.exe using PowerShell cmdlets such as Get-Service.

```ps1
  PS C:\htb> Get-Service | ? {$_.Status -eq "Running"} | select -First 2 |fl


Name                : AdobeARMservice
DisplayName         : Adobe Acrobat Update Service
Status              : Running
DependentServices   : {}
ServicesDependedOn  : {}
CanPauseAndContinue : False
CanShutdown         : False
CanStop             : True
ServiceType         : Win32OwnProcess

Name                : Appinfo
DisplayName         : Application Information
Status              : Running
DependentServices   : {}
ServicesDependedOn  : {RpcSs, ProfSvc}
CanPauseAndContinue : False
CanShutdown         : False
CanStop             : True
ServiceType         : Win32OwnProcess, Win32ShareProcess
```

Service statuses can appear as Running, Stopped, or Paused, and they can be set to start manually, automatically, or on a delay at system boot. Services can also be shown in the state of Starting or Stopping if some action has triggered them to either start or stop. Windows has three categories of services: Local Services, Network Services, and System Services. Services can usually only be created, modified, and deleted by users with administrative privileges. 

**Misconfigurations around service permissions are a common privilege escalation vector on Windows systems.**

You can see a list of services here: https://en.wikipedia.org/wiki/List_of_Microsoft_Windows_components#Services

Think of services as the `daemon` equivalent of Linux.

### Processes

Processes run in the background on Windows systems. They either run automatically as part of the Windows operating system or are started by other installed applications.

Processes run in the background on Windows systems. They either run automatically as part of the Windows operating system or are started by other installed applications.

Processes associated with installed applications can often be terminated without causing a severe impact on the operating system. Certain processes are critical and, if terminated, will stop certain components of the operating system from running properly. Some examples include the Windows Logon Application, System, System Idle Process, Windows Start-Up Application, Client Server Runtime, Windows Session Manager, Service Host, and Local Security Authority Subsystem Service (LSASS) process.

`lsass.exe` is the process that is responsible for enforcing the security policy on Windows systems. When a user attempts to log on to the system, this process verifies their log on attempt and creates access tokens based on the user's permission levels. LSASS is also responsible for user account password changes. All events associated with this process (logon/logoff attempts, etc.) are logged within the Windows Security Log. LSASS is an extremely high-value target as several tools exist to extract both cleartext and hashed credentials stored in memory by this process.

There are some tools provided by Microsoft that allow pentester to explore processes and discover possible privilege escalation paths as well as lateral movements.

The tools are called `SysInternals Tools Suite` and can be downloaded here: https://docs.microsoft.com/en-us/sysinternals.

They even can be accessed via a Public share without the need to download them:

```ps1
C:\htb> \\live.sysinternals.com\tools\procdump.exe -accepteula

ProcDump v9.0 - Sysinternals process dump utility
Copyright (C) 2009-2017 Mark Russinovich and Andrew Richards
Sysinternals - www.sysinternals.com

Monitors a process and writes a dump file when the process exceeds the
specified criteria or has an exception.

Capture Usage:
   procdump.exe [-mm] [-ma] [-mp] [-mc Mask] [-md Callback_DLL] [-mk]
                [-n Count]
                [-s Seconds]
                [-c|-cl CPU_Usage [-u]]
...
```

We can see the processes running using the `Task Manager`. The typical CTRL + ALT + DEL or running `taskmgr` from shell.

## Service permissions

Services usually can be abused for privilege escalations due to permission miss-configurations, put in place by 3rd party software and easy to make mistakes by admins during install processes.

We can use services.msc to view and manage just about every detail regarding all services. Here we can see things like `Service name`, `Path to the executable`, `Log on account`.

 Knowing the service name is especially useful when using command-line tools to examine and manage services. 
 
 Path to the executable is the full path to the program and command to execute when the service starts. If the NTFS permissions of the destination directory are configured with weak permissions, an attacker could replace the original executable with one created for malicious purposes.

 Most services run with LocalSystem privileges by default which is the highest level of access allowed on an individual Windows OS. Not all applications need Local System account-level permissions

 The recovery tab allows steps to be configured should a service fail. Notice how this service can be set to run a program after the first failure. This is yet another vector that an attacker could use to run malicious programs by utilizing a legitimate service.

 We can do the same with `sc` command line utility:

 ```ps1
 C:\Users\htb-student>sc qc wuauserv
[SC] QueryServiceConfig SUCCESS

SERVICE_NAME: wuauserv
        TYPE               : 20  WIN32_SHARE_PROCESS
        START_TYPE         : 3   DEMAND_START
        ERROR_CONTROL      : 1   NORMAL
        BINARY_PATH_NAME   : C:\WINDOWS\system32\svchost.exe -k netsvcs -p
        LOAD_ORDER_GROUP   :
        TAG                : 0
        DISPLAY_NAME       : Windows Update
        DEPENDENCIES       : rpcss
        SERVICE_START_NAME : LocalSystem
```

- `qc` is for querying

We can run it in network:

```ps1
sc //hostname or ip of box query ServiceName
```

Or, we can use it to manage services:

```ps1
C:\Users\htb-student> sc stop wuauserv

[SC] OpenService FAILED 5:

Access is denied.
```

or modify the config of the services:

```ps1
C:\WINDOWS\system32> sc config wuauserv binPath=C:\Winbows\Perfectlylegitprogram.exe

[SC] ChangeServiceConfig SUCCESS

C:\WINDOWS\system32> sc qc wuauserv

[SC] QueryServiceConfig SUCCESS

SERVICE_NAME: wuauserv
        TYPE               : 20  WIN32_SHARE_PROCESS
        START_TYPE         : 3   DEMAND_START
        ERROR_CONTROL      : 1   NORMAL
        BINARY_PATH_NAME   : C:\Winbows\Perfectlylegitprogram.exe
        LOAD_ORDER_GROUP   :
        TAG                : 0
        DISPLAY_NAME       : Windows Update
        DEPENDENCIES       : rpcss
        SERVICE_START_NAME : LocalSystem
```

Another helpful way we can examine service permissions using sc is through the sdshow command:

```ps1
C:\WINDOWS\system32> sc sdshow wuauserv

D:(A;;CCLCSWRPLORC;;;AU)(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;BA)(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;SY)S:(AU;FA;CCDCLCSWRPWPDTLOSDRCWDWO;;;WD)
```

This gibberish is the `security descriptor (SD)` of the service and uses `Security Descriptor Definition Language (SDDL)` which describes an access control list of the service.

Similarly, we can run `Get-Acl` in Powershell:

```ps1
PS C:\Users\htb-student> Get-ACL -Path HKLM:\System\CurrentControlSet\Services\wuauserv | Format-List

Path   : Microsoft.PowerShell.Core\Registry::HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\wuauserv
Owner  : NT AUTHORITY\SYSTEM
Group  : NT AUTHORITY\SYSTEM
Access : BUILTIN\Users Allow  ReadKey
         BUILTIN\Users Allow  -2147483648
         BUILTIN\Administrators Allow  FullControl
         BUILTIN\Administrators Allow  268435456
         NT AUTHORITY\SYSTEM Allow  FullControl
         NT AUTHORITY\SYSTEM Allow  268435456
         CREATOR OWNER Allow  268435456
         APPLICATION PACKAGE AUTHORITY\ALL APPLICATION PACKAGES Allow  ReadKey
         APPLICATION PACKAGE AUTHORITY\ALL APPLICATION PACKAGES Allow  -2147483648
         S-1-15-3-1024-1065365936-1281604716-3511738428-1654721687-432734479-3232135806-4053264122-3456934681 Allow
         ReadKey
         S-1-15-3-1024-1065365936-1281604716-3511738428-1654721687-432734479-3232135806-4053264122-3456934681 Allow
         -2147483648
Audit  :
Sddl   : O:SYG:SYD:AI(A;ID;KR;;;BU)(A;CIIOID;GR;;;BU)(A;ID;KA;;;BA)(A;CIIOID;GA;;;BA)(A;ID;KA;;;SY)(A;CIIOID;GA;;;SY)(A
         ;CIIOID;GA;;;CO)(A;ID;KR;;;AC)(A;CIIOID;GR;;;AC)(A;ID;KR;;;S-1-15-3-1024-1065365936-1281604716-3511738428-1654
         721687-432734479-3232135806-4053264122-3456934681)(A;CIIOID;GR;;;S-1-15-3-1024-1065365936-1281604716-351173842
         8-1654721687-432734479-3232135806-4053264122-3456934681)
```

Notice how this command returns specific account permissions in an easy-to-read format and in SDDL. Also, the SID that represents each security principal (User and/or Group) is present in the SDDL. This is something we do not get when running sc from the command prompt.

## Windows Sessions

- Interactive: An interactive, or local logon session, is initiated by a user authenticating to a local or domain system by entering their credentials. An interactive logon can be initiated by logging directly into the system, by requesting a secondary logon session using the `runas` command via the command line, or through a Remote Desktop connection.

- Non-interactive: they do not require login credentials. on-interactive accounts are generally used by the Windows operating system to automatically start services and applications without requiring user interaction. These accounts have no password associated with them and are usually used to start services when the system boots or to run scheduled tasks.

There are three types:

- Local System Account or (`NT AUTHORITY\SYSTEM `):  It is used for a variety of OS-related tasks, such as starting Windows services. This account is more powerful than accounts in the local administrators group.
- Local Service Account	or (`NT AUTHORITY\LocalService`): this is a less privileged version of the SYSTEM account and has similar privileges to a local user account. It is granted limited functionality and can start some services.
- Network Service Account or (`NT AUTHORITY\NetworkService`): similar to a standard domain user account. It has similar privileges to the Local Service Account on the local machine. It can establish authenticated sessions for certain network services.

## Interacting with Windows

- GUI: using mouse and keyboard.
- RDP: access the GUI from another networked device
- Windows Command Line: automate things, create scripts, etc. We can distinguish two types of command lines:
  - CMD: The Command Prompt (cmd.exe) is used to enter and execute commands.
  - Powershell: built on top of the .NET Framework, which is used for building and running applications on Windows. This makes it a very powerful tool for interfacing directly with the operating system. PowerShell utilizes cmdlets, which are small single-function tools built into the shell.

> Many cmdlets in PowerShell also have aliases. For example, the aliases for the cmdlet `Set-Location`, to change directories, is either `cd` or `sl`. Meanwhile, the aliases for `Get-ChildItem` are `ls` and `gci`. We can view all available aliases by typing `Get-Alias`.

One common way to work with a script in PowerShell is to import it so that all functions are then available within our current PowerShell console session: Import-Module .\PowerView.ps1. 

Sometimes we will find that we are unable to run scripts on a system. This is due to a security feature called the `execution policy`. Here, there are the different values:

| **Policy**       | **Description** |
|------------------|-----------------|
| **AllSigned**    | All scripts can run, but a trusted publisher must sign scripts and configuration files (both remote and local). A prompt appears before running scripts signed by publishers not yet marked as trusted or untrusted. |
| **Bypass**       | No scripts or configuration files are blocked, and the user receives no warnings or prompts. |
| **Default**      | Sets the default execution policy: **Restricted** on Windows desktop systems, **RemoteSigned** on Windows Server systems. |
| **RemoteSigned** | Scripts can run, but downloaded scripts must be digitally signed. Locally written scripts do not require signatures. |
| **Restricted**   | Only individual commands are allowed; scripts are blocked. Blocks all script file types (e.g., `.ps1xml`, `.psm1`, `.ps1`). |
| **Undefined**    | No execution policy is set for the current scope. If all scopes are set to undefined, the system defaults to **Restricted**. |
| **Unrestricted** | Default for non-Windows computers and cannot be changed. Allows all scripts to run. |

The execution policy is not meant to be a security control that restricts user actions. A user can easily bypass the policy by either typing the script contents directly into the PowerShell window, downloading and invoking the script, or specifying the script as an encoded command. It can also be bypassed by adjusting the execution policy (if the user has the proper rights) or setting the execution policy for the current process scope (which can be done by almost any user as it does not require a configuration change and will only be set for the duration of the user's session).

## Windows Management Instrumentation (WMI)

WMI is a subsystem of PowerShell that provides system administrators with powerful tools for system monitoring. Some of the uses for WMI are:

- Status information for local/remote systems
- Configuring security settings on remote machines/applications
- Setting and changing user and group permissions
- Setting/modifying system properties
- Code execution
- Scheduling processes
- Setting up logging

For example:

```ps1
wmic os list brief
```

To use it from PowerShell, we can use `Get-WmiObject`:

```ps1
Get-WmiObject -Class Win32_OperatingSystem | select SystemDirectory,BuildNumber,SerialNumber,Version | ft
```

and `Invoke-WmiObject`:

```ps1
Invoke-WmiMethod -Path "CIM_DataFile.Name='C:\users\public\spns.csv'" -Name Rename -ArgumentList "C:\Users\Public\kerberoasted_users.csv"
```

## Microsoft Management Console (MMC)

The MMC can be used to group snap-ins, or administrative tools, to manage hardware, software, and network components within a Windows host. To start it, type `mmc` in the Start Menu.

From here, we can browse to File --> Add or Remove Snap-ins, and begin customizing our administrative console.

## Windows Subsystem for Linux (WSL)

WSL is a feature that allows Linux binaries to be run natively on Windows 10 and Windows Server 2019.

WSL can be installed by running the PowerShell command Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux as an Administrator.

WSL installs an application called Bash.exe, which can be run by merely typing bash into a Windows console to spawn a Bash shell.

## Windows security

Security is a critical topic in Windows operating systems. Windows systems have many moving parts that present a vast attack surface. Due to the many built-in applications, features, and layers of settings, Windows systems can be easily misconfigured, thus opening them up to attack even if they are fully patched.

### Security Identifier (SID)

Each of the security principals on the system has a unique security identifier (SID). The system automatically generates SIDs. This means that even if, for example, we have two identical users on the system, Windows can distinguish the two and their rights based on their SIDs. SIDs are string values with different lengths, which are stored in the security database. These SIDs are added to the user's access token to identify all actions that the user is authorized to take.

A SID consists of the Identifier Authority and the Relative ID (RID). In an Active Directory (AD) domain environment, the SID also includes the domain SID.

```ps1
PS C:\htb> whoami /user

USER INFORMATION
----------------

User Name           SID
=================== =============================================
ws01\bob S-1-5-21-674899381-4069889467-2080702030-1002
```

The format is `(SID)-(revision level)-(identifier-authority)-(subauthority1)-(subauthority2)-(etc)`.

In this example:

| **Number**                                | **Meaning**             | **Description** |
|-------------------------------------------|--------------------------|-----------------|
| **S**                                     | **SID**                  | Identifies the string as a SID. |
| **1**                                     | **Revision Level**       | To date, this has never changed and has always been 1. |
| **5**                                     | **Identifier Authority** | A 48-bit string that identifies the authority (the computer or network) that created the SID. |
| **21**                                    | **Subauthority1**        | A variable number identifying the user's relation or group to the authority that created the SID. Indicates the order in which the account was created. |
| **674899381-4069889467-2080702030**       | **Subauthority2**        | Identifies which computer or domain created the number. |
| **1002**                                  | **Subauthority3**        | The RID (Relative Identifier) that distinguishes one account from another. Indicates whether the user is a normal user, guest, administrator, or part of another group. |


### Security Accounts Manager (SAM) and Access Control Entries (ACE)

SAM grants rights to a network to execute specific processes.

The access rights themselves are managed by Access Control Entries (ACE) in Access Control Lists (ACL). The ACLs contain ACEs that define which users, groups, or processes have access to a file or to execute a process, for example.

The permissions to access a securable object are given by the security descriptor, classified into two types of ACLs: the Discretionary Access Control List (DACL) or System Access Control List (SACL). Every thread and process started or initiated by a user goes through an authorization process. An integral part of this process is access tokens, validated by the Local Security Authority (LSA). In addition to the SID, these access tokens contain other security-relevant information. Understanding these functionalities is an essential part of learning how to use and work around these security mechanisms during the privilege escalation phase.

### User Account Control (UAC)

User Account Control (UAC) is a security feature in Windows to prevent malware from running or manipulating processes that could damage the computer or its contents.

There is the Admin Approval Mode in UAC, which is designed to prevent unwanted software from being installed without the administrator's knowledge or to prevent system-wide changes from being made.

This is the typical display that ask for consent to install a software on Windows because the install process requires Admin privileges.

You can find how the UAC works here: https://docs.microsoft.com/en-us/windows/security/identity-protection/user-account-control/how-user-account-control-works

### Registry

The Registry is a hierarchical database in Windows critical for the operating system. It stores low-level settings for the Windows operating system and applications that choose to use it. To see, you just need to execute `regedit` command. It has a tree structure.

Each folder under Computer is a key. The root keys all start with HKEY. A key such as HKEY-LOCAL-MACHINE is abbreviated to HKLM.

The following keys:

- HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Run
- HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run
- HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\RunOnce
- HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\RunOnce

are useful for maintaining access to the system. For example:

```ps1
PS C:\htb> reg query HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run

HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run
    OneDrive    REG_SZ    "C:\Users\bob\AppData\Local\Microsoft\OneDrive\OneDrive.exe" /background
    OPENVPN-GUI    REG_SZ    C:\Program Files\OpenVPN\bin\openvpn-gui.exe
    Docker Desktop    REG_SZ    C:\Program Files\Docker\Docker\Docker Desktop.exe
```

Shows the current applications ran by the user.

### AppLocker: Application Whitelist

An application whitelist is a list of approved software applications or executables allowed to be present and run on a system.

Applocker is the Windows whitelist mechanism. AppLocker gives system administrators control over which applications and files users can run. It gives granular control over executables, scripts, Windows installer files, DLLs, packaged apps, and packed app installers.

### Local Group Policy

Group Policy allows administrators to set, configure, and adjust a variety of settings. In a domain environment, group policies are pushed down from a Domain Controller onto all domain-joined machines that Group Policy objects (GPOs) are linked to. These settings can also be defined on individual machines using Local Group Policy.

Local Group Policy can be used to tweak certain graphical and network settings that are otherwise not accessible via the Control Panel. It can also be used to lock down an individual computer policy with stringent security settings, such as only allowing certain programs to be installed/run or enforcing strict user account password requirements.

The editor can be opened with `gpedit.msc` command.

### Windows Defender Antivirus

Modern windows comes with Windows Defender Antivirus enabled by default.

We can use the PowerShell cmdlet `Get-MpComputerStatus` to check which protection settings are enabled:

```ps1
PS C:\htb> Get-MpComputerStatus | findstr "True"
AMServiceEnabled                : True
AntispywareEnabled              : True
AntivirusEnabled                : True
BehaviorMonitorEnabled          : True
IoavProtectionEnabled           : True
IsTamperProtected               : True
NISEnabled                      : True
OnAccessProtectionEnabled       : True
RealTimeProtectionEnabled       : True
```