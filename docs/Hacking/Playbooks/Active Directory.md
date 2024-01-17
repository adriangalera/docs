---
slug: /playbooks/active-directory
pagination_next: null
pagination_prev: null
---

Reference: https://learn.microsoft.com/en-us/powershell/module/activedirectory/?view=windowsserver2022-ps

## Users

Add to the domain

```powershell
 New-ADUser -Name "Orion Starchaser" -Accountpassword (ConvertTo-SecureString -AsPlainText (Read-Host "Enter a secure password") -Force ) -Enabled $true -OtherAttributes @{'title'="Analyst";'mail'="o.starchaser@inlanefreight.local"} -ChangePasswordAtLogon $true 
```

Add to particular organization unit
```powershell
New-ADUser -Name "KarimBuzdar" -GivenName "Karim" -Surname "Buzdar" -SamAccountName "kbuzdar" -UserPrincipalName "kbuzdar@faqforge.com" -Path "OU=Users,DC=faqforge,DC=com" -AccountPassword (ConvertTo-SecureString "P@ssw0rd!" -AsPlainText -Force) -Enabled $true
```

```powershell
Remove-ADUser -Identity pvalencia
```

Get a particular user
```powershell
Get-ADUser -Identity m.ohare
```

Get all users in organization unit:
```powershell
Get-ADUser -Filter * -SearchBase "OU=Finance,OU=UserAccounts,DC=FABRIKAM,DC=COM"
```

Search for user with a filter:
```powershell
Get-ADUser -Filter 'Name -like "*SvcAccount"' | Format-Table Name,SamAccountName -A
```

Get all properties:
```powershell
Get-ADUser -Identity amasters -Properties *
```

## Unlock account

Unlock account:

```powershell
Unlock-ADAccount -Identity amasters 
```

Set new password:
```powershell
Set-ADAccountPassword -Identity amasters -NewPassword (ConvertTo-SecureString -AsPlainText "qwert@12345" -Force)
```

Force change password after next logon:
```powershell
Set-ADUser -Identity amasters -ChangePasswordAtLogon $true
```

## Organization unit

Create a new OU under some path
```powershell
New-ADOrganizationalUnit -Name "Analysts" -Path "OU=IT,OU=HQ-NYC,OU=Employees,OU=Corp,DC=INLANEFREIGHT,DC=LOCAL"
```
 
Move created user to the new created OU
```powershell
Move-ADObject -Identity a.callisto -TargetPath "OU=Analysts,OU=IT,OU=HQ-NYC,OU=Employees,OU=Corp,DC=INLANEFREIGHT,DC=LOCAL"
```

or by Common name:
```powershell
Move-ADObject -Identity "CN=a.callisto,OU=IT,OU=HQ-NYC,OU=Employees,OU=Corp,DC=INLANEFREIGHT,DC=LOCAL" -TargetPath "OU=Analysts,OU=IT,OU=HQ-NYC,OU=Employees,OU=Corp,DC=INLANEFREIGHT,DC=LOCAL"
```

## Security group

```powershell
New-ADGroup -Name "Security Analysts" -SamAccountName analysts -GroupCategory Security -GroupScope Global -DisplayName "Security Analysts" -Path "OU=Analysts,OU=IT,OU=HQ-NYC,OU=Employees,OU=Corp,DC=INLANEFREIGHT,DC=LOCAL" -Description "Members of this group are Security Analysts under the IT OU"
```

Add users to the group:
```powershell
Add-ADGroupMember -Identity analysts -Members ACepheus,OStarchaser,ACallisto
```

## Security group policy

Get by name:

```powershell
Get-GPO -Name "Group Policy Test"
```

Copy and rename GPO (Group policy Object):

```powershell
Copy-GPO -SourceName "Logon Banner" -TargetName "Security Analysts Control"
```

Link the GPO to a OU:

```powershell
New-GPLink -Name "Security Analysts Control" -Target "ou=Analysts,ou=IT,OU=HQ-NYC,OU=Employees,OU=Corp,dc=INLANEFREIGHT,dc=LOCAL" -LinkEnabled Yes
```

To edit the security group policy it's better to do it from the UI, using the Group Policy Management Center (GPMC) available in Server Management > Tools.

## Computer

Add a computer to the domain, credentials refer to the user whose credentials we will use to authorize the join:

```powershell
Add-Computer -DomainName 'INLANEFREIGHT.LOCAL' -Credential 'INLANEFREIGHT\HTB-student_adm' -Restart
```

That command must be run from the computer that did not join the domain yet.

You can do the same but remotely:

```powershell
Add-Computer -ComputerName ACADEMY-IAD-W10 -LocalCredential ACADEMY-IAD-W10\image -DomainName INLANEFREIGHT.LOCAL -Credential INLANEFREIGHT\htb-student_adm -Restart
```

We can we the details of a computer in the domain by running:

```powershell
Get-ADComputer -Identity "name" -Properties * | select CN,CanonicalName,IPv4Address
```

You can move the computer to another OU by running:

```powershell
Move-ADObject -Identity "name" -TargetPath "OU=Analysts,OU=IT,OU=HQ-NYC,OU=Employees,OU=Corp,DC=INLANEFREIGHT,DC=LOCAL"
```