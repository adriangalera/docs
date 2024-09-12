"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[7294],{4585:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>u,frontMatter:()=>t,metadata:()=>l,toc:()=>i});var s=r(4848),a=r(8453);const t={slug:"/playbooks/active-directory",pagination_next:null,pagination_prev:null},o=void 0,l={id:"Hacking/Playbooks/Active Directory",title:"Active Directory",description:"Reference//learn.microsoft.com/en-us/powershell/module/activedirectory/?view=windowsserver2022-ps",source:"@site/docs/Hacking/Playbooks/Active Directory.md",sourceDirName:"Hacking/Playbooks",slug:"/playbooks/active-directory",permalink:"/docs/playbooks/active-directory",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{slug:"/playbooks/active-directory",pagination_next:null,pagination_prev:null},sidebar:"tutorialSidebar"},c={},i=[{value:"Users",id:"users",level:2},{value:"Unlock account",id:"unlock-account",level:2},{value:"Organization unit",id:"organization-unit",level:2},{value:"Security group",id:"security-group",level:2},{value:"Security group policy",id:"security-group-policy",level:2},{value:"Computer",id:"computer",level:2}];function d(e){const n={a:"a",code:"code",h2:"h2",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(n.p,{children:["Reference: ",(0,s.jsx)(n.a,{href:"https://learn.microsoft.com/en-us/powershell/module/activedirectory/?view=windowsserver2022-ps",children:"https://learn.microsoft.com/en-us/powershell/module/activedirectory/?view=windowsserver2022-ps"})]}),"\n",(0,s.jsx)(n.h2,{id:"users",children:"Users"}),"\n",(0,s.jsx)(n.p,{children:"Add to the domain"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:' New-ADUser -Name "Orion Starchaser" -Accountpassword (ConvertTo-SecureString -AsPlainText (Read-Host "Enter a secure password") -Force ) -Enabled $true -OtherAttributes @{\'title\'="Analyst";\'mail\'="o.starchaser@inlanefreight.local"} -ChangePasswordAtLogon $true \n'})}),"\n",(0,s.jsx)(n.p,{children:"Add to particular organization unit"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:'New-ADUser -Name "KarimBuzdar" -GivenName "Karim" -Surname "Buzdar" -SamAccountName "kbuzdar" -UserPrincipalName "kbuzdar@faqforge.com" -Path "OU=Users,DC=faqforge,DC=com" -AccountPassword (ConvertTo-SecureString "P@ssw0rd!" -AsPlainText -Force) -Enabled $true\n'})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:"Remove-ADUser -Identity pvalencia\n"})}),"\n",(0,s.jsx)(n.p,{children:"Get a particular user"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:"Get-ADUser -Identity m.ohare\n"})}),"\n",(0,s.jsx)(n.p,{children:"Get all users in organization unit:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:'Get-ADUser -Filter * -SearchBase "OU=Finance,OU=UserAccounts,DC=FABRIKAM,DC=COM"\n'})}),"\n",(0,s.jsx)(n.p,{children:"Search for user with a filter:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:"Get-ADUser -Filter 'Name -like \"*SvcAccount\"' | Format-Table Name,SamAccountName -A\n"})}),"\n",(0,s.jsx)(n.p,{children:"Get all properties:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:"Get-ADUser -Identity amasters -Properties *\n"})}),"\n",(0,s.jsx)(n.h2,{id:"unlock-account",children:"Unlock account"}),"\n",(0,s.jsx)(n.p,{children:"Unlock account:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:"Unlock-ADAccount -Identity amasters \n"})}),"\n",(0,s.jsx)(n.p,{children:"Set new password:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:'Set-ADAccountPassword -Identity amasters -NewPassword (ConvertTo-SecureString -AsPlainText "qwert@12345" -Force)\n'})}),"\n",(0,s.jsx)(n.p,{children:"Force change password after next logon:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:"Set-ADUser -Identity amasters -ChangePasswordAtLogon $true\n"})}),"\n",(0,s.jsx)(n.h2,{id:"organization-unit",children:"Organization unit"}),"\n",(0,s.jsx)(n.p,{children:"Create a new OU under some path"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:'New-ADOrganizationalUnit -Name "Analysts" -Path "OU=IT,OU=HQ-NYC,OU=Employees,OU=Corp,DC=INLANEFREIGHT,DC=LOCAL"\n'})}),"\n",(0,s.jsx)(n.p,{children:"Move created user to the new created OU"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:'Move-ADObject -Identity a.callisto -TargetPath "OU=Analysts,OU=IT,OU=HQ-NYC,OU=Employees,OU=Corp,DC=INLANEFREIGHT,DC=LOCAL"\n'})}),"\n",(0,s.jsx)(n.p,{children:"or by Common name:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:'Move-ADObject -Identity "CN=a.callisto,OU=IT,OU=HQ-NYC,OU=Employees,OU=Corp,DC=INLANEFREIGHT,DC=LOCAL" -TargetPath "OU=Analysts,OU=IT,OU=HQ-NYC,OU=Employees,OU=Corp,DC=INLANEFREIGHT,DC=LOCAL"\n'})}),"\n",(0,s.jsx)(n.h2,{id:"security-group",children:"Security group"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:'New-ADGroup -Name "Security Analysts" -SamAccountName analysts -GroupCategory Security -GroupScope Global -DisplayName "Security Analysts" -Path "OU=Analysts,OU=IT,OU=HQ-NYC,OU=Employees,OU=Corp,DC=INLANEFREIGHT,DC=LOCAL" -Description "Members of this group are Security Analysts under the IT OU"\n'})}),"\n",(0,s.jsx)(n.p,{children:"Add users to the group:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:"Add-ADGroupMember -Identity analysts -Members ACepheus,OStarchaser,ACallisto\n"})}),"\n",(0,s.jsx)(n.h2,{id:"security-group-policy",children:"Security group policy"}),"\n",(0,s.jsx)(n.p,{children:"Get by name:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:'Get-GPO -Name "Group Policy Test"\n'})}),"\n",(0,s.jsx)(n.p,{children:"Copy and rename GPO (Group policy Object):"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:'Copy-GPO -SourceName "Logon Banner" -TargetName "Security Analysts Control"\n'})}),"\n",(0,s.jsx)(n.p,{children:"Link the GPO to a OU:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:'New-GPLink -Name "Security Analysts Control" -Target "ou=Analysts,ou=IT,OU=HQ-NYC,OU=Employees,OU=Corp,dc=INLANEFREIGHT,dc=LOCAL" -LinkEnabled Yes\n'})}),"\n",(0,s.jsx)(n.p,{children:"To edit the security group policy it's better to do it from the UI, using the Group Policy Management Center (GPMC) available in Server Management > Tools."}),"\n",(0,s.jsx)(n.h2,{id:"computer",children:"Computer"}),"\n",(0,s.jsx)(n.p,{children:"Add a computer to the domain, credentials refer to the user whose credentials we will use to authorize the join:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:"Add-Computer -DomainName 'INLANEFREIGHT.LOCAL' -Credential 'INLANEFREIGHT\\HTB-student_adm' -Restart\n"})}),"\n",(0,s.jsx)(n.p,{children:"That command must be run from the computer that did not join the domain yet."}),"\n",(0,s.jsx)(n.p,{children:"You can do the same but remotely:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:"Add-Computer -ComputerName ACADEMY-IAD-W10 -LocalCredential ACADEMY-IAD-W10\\image -DomainName INLANEFREIGHT.LOCAL -Credential INLANEFREIGHT\\htb-student_adm -Restart\n"})}),"\n",(0,s.jsx)(n.p,{children:"We can we the details of a computer in the domain by running:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:'Get-ADComputer -Identity "name" -Properties * | select CN,CanonicalName,IPv4Address\n'})}),"\n",(0,s.jsx)(n.p,{children:"You can move the computer to another OU by running:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-powershell",children:'Move-ADObject -Identity "name" -TargetPath "OU=Analysts,OU=IT,OU=HQ-NYC,OU=Employees,OU=Corp,DC=INLANEFREIGHT,DC=LOCAL"\n'})})]})}function u(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},8453:(e,n,r)=>{r.d(n,{R:()=>o,x:()=>l});var s=r(6540);const a={},t=s.createContext(a);function o(e){const n=s.useContext(t);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),s.createElement(t.Provider,{value:n},e.children)}}}]);