---
slug: /tooling/smbclient
pagination_next: null
pagination_prev: null
---

Stands for Server Message Block and is a protocol for file sharing between computers. It runs on port 445 by default.

The command line tool to interact with it, it's `smbclient`.

To list shared directories (use -N for anonymous access):

```bash
smbclient -L \\<ip> -N

        Sharename       Type      Comment
        ---------       ----      -------
        ADMIN$          Disk      Remote Admin
        C$              Disk      Default share
        IPC$            IPC       Remote IPC
        WorkShares      Disk
SMB1 disabled -- no workgroup available
```

Note the `\\` prefix, this comes from Windows slahes. Make sure to pass the `--user` flag, otherwise it will try to connect using your Linux user:

```bash
smbclient -L \\10.129.68.251 --user="Administrator"
Password for [WORKGROUP\Administrator]:

	Sharename       Type      Comment
	---------       ----      -------
	ADMIN$          Disk      Remote Admin
	C$              Disk      Default share
	IPC$            IPC       Remote IPC
```

Now, let's connect to the shared:

```bash
smbclient \\\\<ip>\\WorkShares
Enter WORKGROUP\gal's password:
Try "help" to get a list of possible commands.
smb: \>
```

When you're connected to the smb server you can use the same commands as in FTP.

If you see this error: `protocol negotiation failed: NT_STATUS_NOT_SUPPORTED`, you need to configure min/max protocol versions, see: https://unix.stackexchange.com/questions/562550/smbclient-protocol-negotiation-failed

We can download files with `get` and `mget` (for multiples files)