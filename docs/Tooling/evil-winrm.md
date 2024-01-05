---
slug: /tooling/evilwinrm
pagination_next: null
pagination_prev: null
---

# evil-winrm

Once you know the user/password of a Windows target, you can use https://github.com/Hackplayers/evil-winrm to connect to the Powershell. Consider this tool as the PowerShell for Linux.

The usage is quite easy:

```bash
evil-winrm -i 10.129.67.87 -u Administrator -p <password>
```

If you see some SSL error while connecting to the target make sure to enable support for legacy md4 hash:

Make sure the file `/etc/ssl/openssl.cnf` contains the following:

```
[provider_sect]
default = default_sect
legacy = legacy_sect

[default_sect]
activate = 1

[legacy_sect]
activate = 1
```

If you see the following error, it means the user is not authorized to use WinRM. It does not mean the user/password are incorrect.

```
Error: An error of type WinRM::WinRMAuthorizationError happened, message is WinRM::WinRMAuthorizationError
```