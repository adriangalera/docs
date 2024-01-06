---
slug: /tooling/rdp
pagination_next: null
pagination_prev: null
---
Stands for Remote Desktop Protocol and runs on port 3389.

To connect, you can use Windows tool or if in Linux, `xfreerdp` or any other alternative.

```bash
xfreerdp /u:htb-student /p:HTB_@cademy_stdnt! /v:10.129.201.55 /timeout:10000
```

Setting the timeout will help when connection is unstable.

If checking a Windows machine, try first the `Administrator` user.

You can mount folder over RDP:

```bash
xfreerdp /v:10.10.10.132 /d:HTB /u:administrator /p:'Password0@' /drive:linux,/home/plaintext/htb/academy/filetransfer
```

To access the directory, we can connect to \\tsclient\ in the Windows machine.