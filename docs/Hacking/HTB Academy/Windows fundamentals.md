# Windows fundamentals

Windows OS have many different versions. In order to determine the version in PowerShell, we can use this command:

```ps1
PS C:\htb> Get-WmiObject -Class win32_OperatingSystem | select Version,BuildNumber
```