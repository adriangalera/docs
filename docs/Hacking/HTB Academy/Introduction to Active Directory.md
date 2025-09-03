# Introduction to Active Directory

Active Directory (AD) is a directory service for Windows network environments. It is a distributed, hierarchical structure that allows for centralized management of an organization's resources, including users, computers, groups, network devices, file shares, group policies, devices, and trusts. AD provides authentication and authorization functions within a Windows domain environment.

AD is essentially a sizeable read-only database accessible to all users within the domain, regardless of their privilege level. This fact makes it extremely important to properly secure an AD implementation because ANY user account, regardless of their privilege level, can be used to enumerate the domain and hunt for misconfigurations and flaws thoroughly.

Researchers are continually finding new, extremely high-risk attacks that affect Active Directory environments that often require no more than a standard domain user to obtain complete administrative control over the entire domain.

## Active Directory Structure

Active Directory is arranged in a hierarchical tree structure, with a forest at the top containing one or more domains, which can themselves have nested subdomains. 

A forest is the security boundary within which all objects are under administrative control. A forest may contain multiple domains, and a domain may include further child or sub-domains. A domain is a structure within which contained objects (users, computers, and groups) are accessible. It has many built-in Organizational Units (OUs), such as Domain Controllers, Users, Computers, and new OUs can be created as required. OUs may contain objects and sub-OUs, allowing for the assignment of different group policies.

One example of such tree structure might be:

```
INLANEFREIGHT.LOCAL/
├── ADMIN.INLANEFREIGHT.LOCAL
│   ├── GPOs
│   └── OU
│       └── EMPLOYEES
│           ├── COMPUTERS
│           │   └── FILE01
│           ├── GROUPS
│           │   └── HQ Staff
│           └── USERS
│               └── barbara.jones
├── CORP.INLANEFREIGHT.LOCAL
└── DEV.INLANEFREIGHT.LOCAL
```

It is common to see multiple domains (or forests) linked together via trust relationships in organizations that perform a lot of acquisitions. It is often quicker and easier to create a trust relationship with another domain/forest than recreate all new users in the current domain. Domain trusts can introduce a slew of security issues if not appropriately administered.

## Active Directory Terminology

**Object**: An object can be defined as ANY resource present within an Active Directory environment such as OUs, printers, users, domain controllers, etc.

**Attributes**: Every object in Active Directory has an associated set of attributes used to define characteristics of the given object. A computer object contains attributes such as the hostname and DNS name. All attributes in AD have an associated LDAP name that can be used when performing LDAP queries, such as displayName for Full Name and given name for First Name.

**Schema**: The Active Directory schema is essentially the blueprint of any enterprise environment. It defines what types of objects can exist in the AD database and their associated attributes. It lists definitions corresponding to AD objects and holds information about each object.

**Domain**: A domain is a logical group of objects such as computers, users, OUs, groups, etc. We can think of each domain as a different city within a state or country. Domains can operate entirely independently of one another or be connected via trust relationships.

**Forest**: A forest is a collection of Active Directory domains. It is the topmost container and contains all of the AD objects. A forest can contain one or multiple domains and be thought of as a state in the US or a country within the EU. 

**Tree**: A tree is a collection of Active Directory domains that begins at a single root domain. A forest is a collection of AD trees. 

**Container**: Container objects hold other objects and have a defined place in the directory subtree hierarchy.

**Leaf**: Leaf objects do not contain other objects and are found at the end of the subtree hierarchy.

**Global Unique Identifier (GUID)**: A GUID is a unique 128-bit value assigned when a domain user or group is created. This GUID value is unique across the enterprise, similar to a MAC address. Every single object created by Active Directory is assigned a GUID, not only user and group objects. GUIDs are used by AD to identify objects internally. The ObjectGUID property never changes and is associated with the object for as long as that object exists in the domain.

**Security principals**: Security principals are anything that the operating system can authenticate, including users, computer accounts, or even threads/processes that run in the context of a user or computer account.  In AD, security principals are domain objects that can manage access to other resources within the domain. Do not get confused with local user accounts or groups; these are not managed by AD.

**Security Identifier (SID)**: A security identifier, or SID is used as a unique identifier for a security principal or security group. Every account, group, or process has its own unique SID, which, in an AD environment, is issued by the domain controller and stored in a secure database. A SID can only be used once. Even if the security principle is deleted, it can never be used again in that environment to identify another user or group. When a user logs in, the system creates an access token for them which contains the user's SID, the rights they have been granted, and the SIDs for any groups that the user is a member of. 

**Distinguished Name (DN)**: A Distinguished Name (DN) describes the full path to an object in AD (such as cn=bjones, ou=IT, ou=Employees, dc=inlanefreight, dc=local). In this example, the user bjones works in the IT department of the company Inlanefreight, and his account is created in an Organizational Unit (OU) that holds accounts for company employees. The Common Name (CN) bjones is just one way the user object could be searched for or accessed within the domain.

**Relative Distinguished Name (RDN)**: A Relative Distinguished Name (RDN) is a single component of the Distinguished Name that identifies the object as unique from other objects at the current level in the naming hierarchy. In our example, bjones is the Relative Distinguished Name of the object. AD does not allow two objects with the same name under the same parent container, but there can be two objects with the same RDNs that are still unique in the domain because they have different DNs. For example, the object cn=bjones,dc=dev,dc=inlanefreight,dc=local would be recognized as different from cn=bjones,dc=inlanefreight,dc=local. `DN` should be unique in the whole directory, `RDN` should be unique in an OU.

**sAMAccountName**: The sAMAccountName is the user's logon name. Here it would just be bjones. It must be a unique value and 20 or fewer characters.

**userPrincipalName**: The userPrincipalName attribute is another way to identify users in AD. This attribute consists of a prefix (the user account name) and a suffix (the domain name) in the format of bjones@inlanefreight.local. This attribute is not mandatory.

**FSMO Roles**: Flexible Single Master Operation (FSMO) roles. These give Domain Controllers (DC) the ability to continue authenticating users and granting permissions without interruption (authorization and authentication). There are five FSMO roles: Schema Master and Domain Naming Master (one of each per forest), Relative ID (RID) Master (one per domain), Primary Domain Controller (PDC) Emulator (one per domain), and Infrastructure Master (one per domain).

**Global Catalog**: A global catalog (GC) is a domain controller that stores copies of ALL objects in an Active Directory forest. The GC stores a full copy of all objects in the current domain and a partial copy of objects that belong to other domains in the forest

**Read-Only Domain Controller (RODC)**: A Read-Only Domain Controller (RODC) has a read-only Active Directory database.

**Replication**: Replication happens in AD when AD objects are updated and transferred from one Domain Controller to another.

**Service Principal Name (SPN)**: A Service Principal Name (SPN) uniquely identifies a service instance. They are used by Kerberos authentication to associate an instance of a service with a logon account, allowing a client application to request the service to authenticate an account without needing to know the account name.

**Group Policy Object (GPO)**: Group Policy Objects (GPOs) are virtual collections of policy settings. Each GPO has a unique GUID. A GPO can contain local file system settings or Active Directory settings. GPO settings can be applied to both user and computer objects. They can be applied to all users and computers within the domain or defined more granularly at the OU level.

**Access Control List (ACL)**: An Access Control List (ACL) is the ordered collection of Access Control Entries (ACEs) that apply to an object.

**Access Control Entries (ACEs)**: Each Access Control Entry (ACE) in an ACL identifies a trustee (user account, group account, or logon session) and lists the access rights that are allowed, denied, or audited for the given trustee.

**Discretionary Access Control List (DACL)**: DACLs define which security principles are granted or denied access to an object; it contains a list of ACEs. When a process tries to access a securable object, the system checks the ACEs in the object's DACL to determine whether or not to grant access. If an object does NOT have a DACL, then the system will grant full access to everyone, but if the DACL has no ACE entries, the system will deny all access attempts. ACEs in the DACL are checked in sequence until a match is found that allows the requested rights or until access is denied.

**System Access Control Lists (SACL)**: Allows for administrators to log access attempts that are made to secured objects. ACEs specify the types of access attempts that cause the system to generate a record in the security event log.

**Fully Qualified Domain Name (FQDN)**:  complete name for a specific computer or host. E.g.: DC01.INLANEFREIGHT.LOCAL. The format is `[host name].[domain name].[tld]`.

**Tombstone**: A tombstone is a container object in AD that holds deleted AD objects. When an object is deleted from AD, the object remains for a set period of time known as the Tombstone Lifetime, and the isDeleted attribute is set to TRUE. Once an object exceeds the Tombstone Lifetime, it will be entirely removed.

**AD Recycle Bin**: Makes it easier for sysadmins to restore objects, avoiding the need to restore from backups, restarting Active Directory Domain Services (AD DS), or rebooting a Domain Controller.

**SYSVOL**: The SYSVOL folder, or share, stores copies of public files in the domain such as system policies, Group Policy settings, logon/logoff scripts, and often contains other types of scripts that are executed to perform various tasks in the AD environment.

**AdminSDHolder**: The AdminSDHolder object is used to manage ACLs for members of built-in groups in AD marked as privileged. It acts as a container that holds the Security Descriptor applied to members of protected groups. The SDProp (SD Propagator) process runs on a schedule of each hour. When this process runs, it checks members of protected groups to ensure that the correct ACL is applied to them.

**dsHeuristics**: The dsHeuristics attribute is a string value set on the Directory Service object used to define multiple forest-wide configuration settings. 

**adminCount**: The adminCount attribute determines whether or not the SDProp process protects a user. If the value is set to 0 or not specified, the user is not protected. If the attribute value is set to 1, the user is protected. 

**Active Directory Users and Computers (ADUC)**: ADUC is a GUI console commonly used for managing users, groups, computers, and contacts in AD.

**ADSI Edit**: It is a powerful GUI tool that allows a user to access AD at a much deeper level.

**sIDHistory**: This attribute holds any SIDs that an object was assigned previously. It is usually used in migrations so a user can maintain the same level of access when migrated from one domain to another. This attribute can potentially be abused if set insecurely, allowing an attacker to gain prior elevated access that an account had before a migration if SID Filtering (or removing SIDs from another domain from a user's access token that could be used for elevated access) is not enabled.

**NTDS.DIT**: The NTDS.DIT file can be considered the heart of Active Directory. It is stored on a Domain Controller at C:\Windows\NTDS\ and is a database that stores AD data such as information about user and group objects, group membership, and, most important to attackers and penetration testers, the password hashes for all users in the domain. Once full domain compromise is reached, an attacker can retrieve this file, extract the hashes, and either use them to perform a pass-the-hash attack or crack them offline using a tool such as Hashcat to access additional resources in the domain.

**MSBROWSE**: MSBROWSE is a Microsoft networking protocol that was used in early versions of Windows-based local area networks (LANs) to provide browsing services. It was used to maintain a list of resources, such as shared printers and files, that were available on the network, and to allow users to easily browse and access these resources. Replace by SMB and CIFS.

## Active Directory Objects

### Users

These are the users within the organization's AD environment. A user object is considered a security principal and has a security identifier (SID) and a global unique identifier (GUID). User objects have many possible attributes, such as their display name, last login time, date of last password change, email address, account description, manager, address, and more.

### Contacts

A contact object is usually used to represent an external user and contains informational attributes such as first name, last name, email address, telephone number, etc. They are leaf objects and are NOT security principals (securable objects), so they don't have a SID, only a GUID.

### Printers

A printer object points to a printer accessible within the AD network. Like a contact, a printer is a leaf object and not a security principal, so it only has a GUID. Printers have attributes such as the printer's name, driver information, port number, etc.

### Computers

A computer object is any computer joined to the AD network (workstation or server). Computers are leaf objects because they do not contain other objects. However, they are considered security principals and have a SID and a GUID. Like users, they are prime targets for attackers since full administrative access to a computer (as the all-powerful NT AUTHORITY\SYSTEM account) grants similar rights to a standard domain user and can be used to perform the majority of the enumeration tasks that a user account can.

### Shared Folders

A shared folder object points to a shared folder on the specific computer where the folder resides. Shared folders can have stringent access control applied to them and can be either accessible to everyone (even those without a valid AD account), open to only authenticated users (which means anyone with even the lowest privileged user account OR a computer account (NT AUTHORITY\SYSTEM) could access it), or be locked down to only allow certain users/groups access. Anyone not explicitly allowed access will be denied from listing or reading its contents. Shared folders are NOT security principals and only have a GUID. A shared folder's attributes can include the name, location on the system, security access rights.

### Groups

A group is considered a container object because it can contain other objects, including users, computers, and even other groups. A group has SID and GUID. It is considered a security principal. In AD, groups are a way to manage user permissions and access to other securable objects (both users and computers).

In Active Directory, we commonly see what are called "nested groups" (a group added as a member of another group), which can lead to a user(s) obtaining unintended rights. Nested group membership is something we see and often leverage during penetration tests. The tool BloodHound helps to discover attack paths within a network and illustrate them in a graphical interface.

### Organizational Units (OUs)

An organizational unit, or OU from here on out, is a container that systems administrators can use to store similar objects for ease of administration.

For example, we may have a top-level OU called Employees and then child OUs under it for the various departments such as Marketing, HR, Finance, Help Desk, etc.

For example, we may want to set a specific password policy for privileged service accounts so these accounts could be placed in a particular OU and then have a Group Policy object assigned to it, which would enforce this password policy on all accounts placed inside of it.

### Domain

A domain is the structure of an AD network. Domains contain objects such as users and computers, which are organized into container objects: groups and OUs. Every domain has its own separate database and sets of policies that can be applied to any and all objects within the domain.

### Domain Controllers

Domain Controllers are essentially the brains of an AD network. They handle authentication requests, verify users on the network, and control who can access the various resources in the domain. All access requests are validated via the domain controller and privileged access requests are based on predetermined roles assigned to users. It also enforces security policies and stores information about every other object in the domain.

### Sites

A site in AD is a set of computers across one or more subnets connected using high-speed links. They are used to make replication across domain controllers run efficiently.

### Built-in

In AD, built-in is a container that holds default groups in an AD domain. They are predefined when an AD domain is created.

### Foreign Security Principals

A foreign security principal (FSP) is an object created in AD to represent a security principal that belongs to a trusted external forest.

## Active Directory Functionality

There are five Flexible Single Master Operation (FSMO) roles. These roles can be defined as follows:

| Roles                  | Description |
|------------------------|-------------|
| **Schema Master**      | This role manages the read/write copy of the AD schema, which defines all attributes that can apply to an object in AD. |
| **Domain Naming Master** | Manages domain names and ensures that two domains of the same name are not created in the same forest. |
| **Relative ID (RID) Master** | The RID Master assigns blocks of RIDs to other DCs within the domain that can be used for new objects. The RID Master helps ensure that multiple objects are not assigned the same SID. Domain object SIDs are the domain SID combined with the RID number assigned to the object to make the unique SID. |
| **PDC Emulator**       | The host with this role would be the authoritative DC in the domain and respond to authentication requests, password changes, and manage Group Policy Objects (GPOs). The PDC Emulator also maintains time within the domain. |
| **Infrastructure Master** | This role translates GUIDs, SIDs, and DNs between domains. This role is used in organizations with multiple domains in a single forest. The Infrastructure Master helps them to communicate. If this role is not functioning properly, Access Control Lists (ACLs) will show SIDs instead of fully resolved names. |

Depending on the organization, these roles may be assigned to specific DCs or as defaults each time a new DC is added.

### Trust

A trust is used to establish forest-forest or domain-domain authentication, allowing users to access resources in (or administer) another domain outside of the domain their account resides in. A trust creates a link between the authentication systems of two domains.

There are several trust types.


| Trust Type      | Description |
|-----------------|-------------|
| **Parent-child** | Domains within the same forest. The child domain has a two-way transitive trust with the parent domain. |
| **Cross-link**   | A trust between child domains to speed up authentication. |
| **External**     | A non-transitive trust between two separate domains in separate forests which are not already joined by a forest trust. This type of trust utilizes SID filtering. |
| **Tree-root**    | A two-way transitive trust between a forest root domain and a new tree root domain. They are created by design when you set up a new tree root domain within a forest. |
| **Forest**       | A transitive trust between two forest root domains. |

Trusts can be transitive or non-transitive.

- A transitive trust means that trust is extended to objects that the child domain trusts.
- In a non-transitive trust, only the child domain itself is trusted.

Trusts can be set up to be one-way or two-way (bidirectional).

- In bidirectional trusts, users from both trusting domains can access resources.
- In a one-way trust, only users in a trusted domain can access resources in a trusting domain, not vice-versa. The direction of trust is opposite to the direction of access.

Often, domain trusts are set up improperly and provide unintended attack paths. 

Also, trusts set up for ease of use may not be reviewed later for potential security implications. 

Mergers and acquisitions can result in bidirectional trusts with acquired companies, unknowingly introducing risk into the acquiring company’s environment. 

t is not uncommon to be able to perform an attack such as Kerberoasting against a domain outside the principal domain and obtain a user that has administrative access within the principal domain.

## Active Directory Protocols

### Kerberos

Kerberos is a stateless authentication protocol based on tickets instead of transmitting user passwords over the network. As part of Active Directory Domain Services (AD DS), Domain Controllers have a Kerberos Key Distribution Center (KDC) that issues tickets.

When a user initiates a login request to a system, they request a ticket from the KDC, encrypting the request with the user's password. If the KDC can decrypt the request (AS-REQ) using their password, it will create a Ticket Granting Ticket (TGT) and transmit it to the user.

The user then presents its TGT to a Domain Controller to request a Ticket Granting Service (TGS) ticket, encrypted with the associated service's NTLM password hash.

Finally, the client requests access to the required service by presenting the TGS to the application or service, which decrypts it with its password hash. If the entire process completes appropriately, the user will be permitted to access the requested service or application.

The password is never transmitted over the network.

The Kerberos Key Distribution Centre (KDC) does not record previous transactions (it is stateless). Instead, the Kerberos Ticket Granting Service ticket (TGS) relies on a valid Ticket Granting Ticket (TGT). It assumes that if the user has a valid TGT, they must have proven their identity.

More in depth:
1) `KRB_AS_REQ`: The user sends a timestamp encrypted with their password to the KDC. This is the request to the TGT (Ticket Granting Ticket).
2) `KRB_AS_REP`: The KDC verifies the user information and generates and encrypts the TGT message with its private key (the secret key of the krbtgt account). Then, the TGT message is passed to the user.
3) `KRB_TGS_REQ`: The user presents the TGT to the DC and request a Ticket Granting Service (TGS) to access certain service
4) `KRB_TGS_REP`: The TGS is encrypted with the hash NTLM password of the service or computer account that is running the KDC.
5) `KRB_AP_REQ`: The user presents the TGS to the service.

The Kerberos protocol uses port 88 (both TCP and UDP). When enumerating an Active Directory environment, we can often locate Domain Controllers by performing port scans looking for open port 88 using a tool such as Nmap.

### DNS

DNS is used to resolve hostnames to IP addresses. Private internal networks use Active Directory DNS namespaces to facilitate communications between servers, clients, and peers. DNS are managed by the Domain Controllers.

We can perform `nslookup` and we'll get all the IPs of Domain Controller in the network:
```ps1
PS C:\htb> nslookup INLANEFREIGHT.LOCAL

Server:  172.16.6.5
Address:  172.16.6.5

Name:    INLANEFREIGHT.LOCAL
Address:  172.16.6.5
```
This is called forward DNS lookup, we can do the opposite, reverse DNS lookup: from IP, get the hostname:

```ps1
PS C:\htb> nslookup 172.16.6.5

Server:  172.16.6.5
Address:  172.16.6.5

Name:    ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL
Address:  172.16.6.5
```

We can know the IP of certain host:
```ps1
PS C:\htb> nslookup ACADEMY-EA-DC01

Server:   172.16.6.5
Address:  172.16.6.5

Name:    ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL
Address:  172.16.6.5
```

### LDAP

Active Directory supports Lightweight Directory Access Protocol (LDAP) for directory lookups. LDAP is an open-source and cross-platform protocol used for authentication against various directory services (such as AD).

AD stores user account information and security information such as passwords and facilitates sharing this information with other devices on the network. LDAP is the language that applications use to communicate with other servers that provide directory services. In other words, LDAP is how systems in the network environment can "speak" to AD.

An LDAP session begins by first connecting to an LDAP server, also known as a Directory System Agent. The Domain Controller in AD actively listens for LDAP requests, such as security authentication requests.

The relationship between AD and LDAP can be compared to Apache and HTTP. The same way Apache is a web server that uses the HTTP protocol, Active Directory is a directory server that uses the LDAP protocol.

There are two types of LDAP authentication:

- Simple Authentication: This includes anonymous authentication, unauthenticated authentication, and username/password authentication. Simple authentication means that a username and password create a BIND request to authenticate to the LDAP server.

- SASL Authentication: The Simple Authentication and Security Layer (SASL) framework uses other authentication services, such as Kerberos, to bind to the LDAP server and then uses this authentication service (Kerberos in this example) to authenticate to LDAP.

LDAP authentication messages are sent in cleartext by default so anyone can sniff out LDAP messages on the internal network. It is recommended to use TLS encryption or similar to safeguard this information in transit.

### MSRPC

 MSRPC is Microsoft's implementation of Remote Procedure Call (RPC), an interprocess communication technique used for client-server model-based applications. Windows systems use MSRPC to access systems in Active Directory using four key RPC interfaces.

 | Protocol | Description |
|----------|-------------|
| **lsarpc** | A set of RPC calls to the Local Security Authority (LSA) system which manages the local security policy on a computer, controls the audit policy, and provides interactive authentication services. LSARPC is used to perform management on domain security policies. |
| **netlogon** | Netlogon is a Windows process used to authenticate users and other services in the domain environment. It is a service that continuously runs in the background. |
| **samr** | Remote SAM (samr) provides management functionality for the domain account database, storing information about users and groups. IT administrators use the protocol to manage users, groups, and computers by enabling admins to create, read, update, and delete information about security principles. Attackers (and pentesters) can use the samr protocol to perform reconnaissance about the internal domain using tools such as BloodHound to visually map out the AD network and create "attack paths" to illustrate visually how administrative access or full domain compromise could be achieved. Organizations can protect against this type of reconnaissance by changing a Windows registry key to only allow administrators to perform remote SAM queries since, by default, all authenticated domain users can make these queries to gather a considerable amount of information about the AD domain. |
| **drsuapi** | drsuapi is the Microsoft API that implements the Directory Replication Service (DRS) Remote Protocol which is used to perform replication-related tasks across Domain Controllers in a multi-DC environment. Attackers can utilize drsuapi to create a copy of the Active Directory domain database (NTDS.dit) file to retrieve password hashes for all accounts in the domain, which can then be used to perform Pass-the-Hash attacks to access more systems or cracked offline using a tool such as Hashcat to obtain the cleartext password to log in to systems using remote management protocols such as Remote Desktop (RDP) and WinRM. |

### NTLM

Aside from Kerberos and LDAP, Active Directory uses several other authentication methods which can be used (and abused) by applications and services in AD. These include LM, NTLM, NTLMv1, and NTLMv2. 

#### LM

LAN Manager (LM or LANMAN) hashes are the oldest password storage mechanism used by the Windows operating system. If in use, they are stored in the SAM database on a Windows host and the NTDS.DIT database on a Domain Controller. 

Due to significant security weaknesses in the hashing algorithm used for LM hashes, it has been turned off by default since Windows Vista/Server 2008. 

Passwords using LM are limited to a maximum of 14 characters. Passwords are not case sensitive and are converted to uppercase before generating the hashed value, limiting the keyspace to a total of 69 characters making it relatively easy to crack these hashes using a tool such as Hashcat.

An LM hash takes the form of 299bd128c1101fd6.

#### NTHash (NTLM)

NT LAN Manager (NTLM) hashes are used on modern Windows systems. It is a challenge-response authentication protocol and uses three messages to authenticate: a client first sends a `NEGOTIATE_MESSAGE` to the server, whose response is a `CHALLENGE_MESSAGE` to verify the client's identity. Lastly, the client responds with an `AUTHENTICATE_MESSAGE`. These hashes are stored locally in the SAM database or the NTDS.DIT database file on a Domain Controller. 

 NTLM is also vulnerable to the pass-the-hash attack, which means an attacker can use just the NTLM hash (after obtaining via another successful attack) to authenticate to target systems where the user is a local admin without needing to know the cleartext value of the password.

 An NT hash takes the form of b4b9b02e6f09a9bd760f388b67351e2b, which is the second half of the full NTLM hash. An NTLM hash looks like this: `Rachel:500:aad3c435b514a4eeaad3b935b51304fe:e46b9e548fa0d122de7f59fb6d48eaa2:::`

 - Rachel is the username
 - 500 is the Relative Identifier (RID). 500 is the known RID for the administrator account
 - aad3c435b514a4eeaad3b935b51304fe is the LM hash and, if LM hashes are disabled on the system, can not be used for anything
 - e46b9e548fa0d122de7f59fb6d48eaa2 is the NT hash. This hash can either be cracked offline to reveal the cleartext value (depending on the length/strength of the password) or used for a pass-the-hash attack.

#### NTLMv1

The protocol is used for network authentication, and the Net-NTLMv1 hash itself is created from a challenge/response algorithm. NTLMv1 uses both the NT and the LM hash, which can make it easier to "crack" offline after capturing a hash

#### NTLMv2

Stronger alternative to NTLMv1. It is hardened against certain spoofing attacks that NTLMv1 is susceptible to.

#### Domain Cached Credentials (MSCache2)

In an AD environment, the authentication methods mentioned in this section and the previous require the host we are trying to access to communicate with the "brains" of the network, the Domain Controller.

Microsoft developed the MS Cache v1 and v2 algorithm also known as Domain Cached Credentials (DCC) to solve the potential issue of a domain-joined host being unable to communicate with a domain controller.

Hosts save the last ten hashes for any domain users that successfully log into the machine in the HKEY_LOCAL_MACHINE\SECURITY\Cache registry key. 

These hashes cannot be used in pass-the-hash attacks. Furthermore, the hash is very slow to crack with a tool such as Hashcat.

## Users and Machine accounts

User accounts are created on both local systems (not joined to AD) and in Active Directory to give a person or a program (such as a system service) the ability to log on to a computer and access resources based on their rights.

When a user logs in, the system verifies their password and creates an access token. This token describes the security content of a process or thread and includes the user's security identity and group membership. Whenever a user interacts with a process, this token is presented.

Users can be assigned to groups that can contain one or more members. These groups can also be used to control access to resources.

Some users may have two or more accounts provisioned based on their job role (i.e., an IT admin or Help Desk member). Aside from standard user and admin accounts tied back to a specific user, we will often see many service accounts used to run a particular application or service in the background or perform other vital functions within the domain environment. 

User accounts can be provisioned many rights in Active Directory: from very basic read-only user to Enterprise Admin and all the combinations in the middle. Because users can have so many rights assigned to them, they can also be misconfigured relatively easily and granted unintended rights that an attacker or a penetration tester can leverage.

### Local accounts

Local accounts are stored locally on a particular server or workstation. These accounts can be assigned rights on that host either individually or via group membership. Any rights assigned can only be granted to that specific host and will not work across the domain. There are some default local user accounts:

- Administrator: this account has the SID S-1-5-domain-500. Has full control of the system. It cannot be deleted or locked, but it can be disabled or renamed.

- Guest: this account is disabled by default. The purpose of this account is to allow users without an account on the computer to log in temporarily with limited access rights. By default, it has a blank password and is generally recommended to be left disabled because of the security risk of allowing anonymous access to a host.

- SYSTEM: NT AUTHORITY\SYSTEM account. Default account installed and used by the operating system to perform many of its internal functions. SYSTEM is a service account and does not run entirely in the same context as a regular user.  A SYSTEM account is the highest permission level one can achieve on a Windows host and, by default, is granted Full Control permissions to all files on a Windows system.

- Network Service: This is a predefined local account used by the Service Control Manager (SCM) for running Windows services. When a service runs in the context of this particular account, it will present credentials to remote services.

- Local Service: This is another predefined local account used by the Service Control Manager (SCM) for running Windows services. It is configured with minimal privileges on the computer and presents anonymous credentials to the network.

### Domain users

They are granted rights from the domain to access resources such as file servers, printers, intranet hosts, and other objects based on the permissions granted to their user account or the group that account is a member of. Domain user accounts can log in to any host in the domain, unlike local users.

One account to keep in mind is the KRBTGT account, this is a type of local account built into the AD infrastructure. It acts as a service account for the Key Distribution service providing authentication and access for domain resources. This account is a common target of many attackers since gaining control or access will enable an attacker to have unconstrained access to the domain.

### Domain-joined vs. Non-Domain-joined Machines

- Domain joined: Hosts joined to a domain have greater ease of information sharing within the enterprise and a central management point (the DC) to gather resources, policies, and updates from. A host joined to a domain will acquire any configurations or changes necessary through the domain's Group Policy.

- Non-domain joined: Non-domain joined computers or computers in a workgroup are not managed by domain policy. The individual users are in charge of any changes they wish to make to their host.

It is important to note that a machine account (NT AUTHORITY\SYSTEM level access) in an AD environment will have most of the same rights as a standard domain user account. Access in the context of the SYSTEM account will allow us read access to much of the data within the domain.

## AD Groups

After users, groups are another significant object in Active Directory. They can place similar users together and mass assign rights and access. The rights that they confer on their members may not be readily apparent but may grant excessive (and even unintended) privileges that can be abused if not set up correctly.

OUs are useful for grouping users, groups, and computers to ease management and deploying Group Policy settings to specific objects in the domain. Groups are primarily used to assign permissions to access resources.

Groups in Active Directory have two fundamental characteristics: type and scope. The group type defines the group's purpose, while the group scope shows how the group can be used within the domain or forest. When creating a new group, we must select a group type. There are two main types: security and distribution groups.

The Security groups type is primarily for ease of assigning permissions and rights to a collection of users instead of one at a time.

The Distribution groups type is used by email applications such as Microsoft Exchange to distribute messages to group members

There are three different group scopes that can be assigned when creating a new group.

Domain Local Group: only access resources in the domain the group was created.

Global Group: can access resources in another domain.

Universal Group: The universal group scope can be used to manage resources distributed across multiple domains and can be given permissions to any object within the same forest.

### Nested Group Membership

a Domain Local Group can be a member of another Domain Local Group in the same domain. Through this membership, a user may inherit privileges not assigned directly to their account or even the group they are directly a member of, but rather the group that their group is a member of. This can sometimes lead to unintended privileges granted to a user that are difficult to uncover without an in-depth assessment of the domain. Tools such as BloodHound are particularly useful in uncovering privileges that a user may inherit through one or more nestings of groups.

## Active Directory Rights and Privileges

Rights are typically assigned to users or groups and deal with permissions to `access an object` such as a file, while privileges grant a user permission to `perform an action` such as run a program, shut down a system, reset passwords, etc. Privileges can be assigned individually to users or conferred upon them via built-in or custom group membership.

AD contains many default or built-in security groups, some of which grant their members powerful rights and privileges which can be abused. Some of them are listed below:

| Group Name | Description |
|------------|-------------|
| **Account Operators** | Members can create and modify most types of accounts, including those of users, local groups, and global groups, and members can log in locally to domain controllers. They cannot manage the Administrator account, administrative user accounts, or members of the Administrators, Server Operators, Account Operators, Backup Operators, or Print Operators groups. |
| **Administrators** | Members have full and unrestricted access to a computer or an entire domain if they are in this group on a Domain Controller. |
| **Backup Operators** | Members can back up and restore all files on a computer, regardless of the permissions set on the files. Backup Operators can also log on to and shut down the computer. Members can log onto DCs locally and should be considered Domain Admins. They can make shadow copies of the SAM/NTDS database, which, if taken, can be used to extract credentials and other juicy info. |
| **DnsAdmins** | Members have access to network DNS information. The group will only be created if the DNS server role is or was at one time installed on a domain controller in the domain. |
| **Domain Admins** | Members have full access to administer the domain and are members of the local administrator's group on all domain-joined machines. |
| **Domain Computers** | Any computers created in the domain (aside from domain controllers) are added to this group. |
| **Domain Controllers** | Contains all DCs within a domain. New DCs are added to this group automatically. |
| **Domain Guests** | This group includes the domain's built-in Guest account. Members of this group have a domain profile created when signing onto a domain-joined computer as a local guest. |
| **Domain Users** | This group contains all user accounts in a domain. A new user account created in the domain is automatically added to this group. |
| **Enterprise Admins** | Membership in this group provides complete configuration access within the domain. The group only exists in the root domain of an AD forest. Members in this group are granted the ability to make forest-wide changes such as adding a child domain or creating a trust. The Administrator account for the forest root domain is the only member of this group by default. |
| **Event Log Readers** | Members can read event logs on local computers. The group is only created when a host is promoted to a domain controller. |
| **Group Policy Creator Owners** | Members create, edit, or delete Group Policy Objects in the domain. |
| **Hyper-V Administrators** | Members have complete and unrestricted access to all the features in Hyper-V. If there are virtual DCs in the domain, any virtualization admins, such as members of Hyper-V Administrators, should be considered Domain Admins. |
| **IIS_IUSRS** | This is a built-in group used by Internet Information Services (IIS), beginning with IIS 7.0. |
| **Pre–Windows 2000 Compatible Access** | This group exists for backward compatibility for computers running Windows NT 4.0 and earlier. Membership in this group is often a leftover legacy configuration. It can lead to flaws where anyone on the network can read information from AD without requiring a valid AD username and password. |
| **Print Operators** | Members can manage, create, share, and delete printers that are connected to domain controllers in the domain along with any printer objects in AD. Members are allowed to log on to DCs locally and may be used to load a malicious printer driver and escalate privileges within the domain. |
| **Protected Users** | Members of this group are provided additional protections against credential theft and tactics such as Kerberos abuse. |
| **Read-only Domain Controllers** | Contains all Read-only domain controllers in the domain. |
| **Remote Desktop Users** | This group is used to grant users and groups permission to connect to a host via Remote Desktop (RDP). This group cannot be renamed, deleted, or moved. |
| **Remote Management Users** | This group can be used to grant users remote access to computers via Windows Remote Management (WinRM). |
| **Schema Admins** | Members can modify the Active Directory schema, which is the way all objects with AD are defined. This group only exists in the root domain of an AD forest. The Administrator account for the forest root domain is the only member of this group by default. |
| **Server Operators** | This group only exists on domain controllers. Members can modify services, access SMB shares, and backup files on domain controllers. By default, this group has no members. |

Below there are listed some interesting user privileges:

| Privilege | Description |
|-----------|-------------|
| **SeRemoteInteractiveLogonRight** | This privilege could give our target user the right to log onto a host via Remote Desktop (RDP), which could potentially be used to obtain sensitive data or escalate privileges. |
| **SeBackupPrivilege** | This grants a user the ability to create system backups and could be used to obtain copies of sensitive system files that can be used to retrieve passwords such as the SAM and SYSTEM Registry hives and the NTDS.dit Active Directory database file. |
| **SeDebugPrivilege** | This allows a user to debug and adjust the memory of a process. With this privilege, attackers could utilize a tool such as Mimikatz to read the memory space of the Local System Authority (LSASS) process and obtain any credentials stored in memory. |
| **SeImpersonatePrivilege** | This privilege allows us to impersonate a token of a privileged account such as NT AUTHORITY\SYSTEM. This could be leveraged with a tool such as JuicyPotato, RogueWinRM, PrintSpoofer, etc., to escalate privileges on a target system. |
| **SeLoadDriverPrivilege** | A user with this privilege can load and unload device drivers that could potentially be used to escalate privileges or compromise a system. |
| **SeTakeOwnershipPrivilege** | This allows a process to take ownership of an object. At its most basic level, we could use this privilege to gain access to a file share or a file on a share that was otherwise not accessible to us. |

To see the user privileges, we can run:

```ps1
PS C:\htb> whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                    State
============================= ============================== ========
SeChangeNotifyPrivilege       Bypass traverse checking       Enabled
SeIncreaseWorkingSetPrivilege Increase a process working set Disabled
```

If we enter the same command from an elevated PowerShell console, we can see the complete listing of rights available to us:

```ps1
PS C:\htb> whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                            Description                                                        State
========================================= ================================================================== ========
SeIncreaseQuotaPrivilege                  Adjust memory quotas for a process                                 Disabled
SeMachineAccountPrivilege                 Add workstations to domain                                         Disabled
SeSecurityPrivilege                       Manage auditing and security log                                   Disabled
SeTakeOwnershipPrivilege                  Take ownership of files or other objects                           Disabled
SeLoadDriverPrivilege                     Load and unload device drivers                                     Disabled
SeSystemProfilePrivilege                  Profile system performance                                         Disabled
SeSystemtimePrivilege                     Change the system time                                             Disabled
SeProfileSingleProcessPrivilege           Profile single process                                             Disabled
SeIncreaseBasePriorityPrivilege           Increase scheduling priority                                       Disabled
SeCreatePagefilePrivilege                 Create a pagefile                                                  Disabled
SeBackupPrivilege                         Back up files and directories                                      Disabled
SeRestorePrivilege                        Restore files and directories                                      Disabled
SeShutdownPrivilege                       Shut down the system                                               Disabled
SeDebugPrivilege                          Debug programs                                                     Enabled
SeSystemEnvironmentPrivilege              Modify firmware environment values                                 Disabled
SeChangeNotifyPrivilege                   Bypass traverse checking                                           Enabled
SeRemoteShutdownPrivilege                 Force shutdown from a remote system                                Disabled
SeUndockPrivilege                         Remove computer from docking station                               Disabled
SeEnableDelegationPrivilege               Enable computer and user accounts to be trusted for delegation     Disabled
SeManageVolumePrivilege                   Perform volume maintenance tasks                                   Disabled
SeImpersonatePrivilege                    Impersonate a client after authentication                          Enabled
SeCreateGlobalPrivilege                   Create global objects                                              Enabled
SeIncreaseWorkingSetPrivilege             Increase a process working set                                     Disabled
SeTimeZonePrivilege                       Change the time zone                                               Disabled
SeCreateSymbolicLinkPrivilege             Create symbolic links                                              Disabled
SeDelegateSessionUserImpersonatePrivilege Obtain an impersonation token for another user in the same session Disabled
```