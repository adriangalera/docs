---
slug: /tooling/hashcat
pagination_next: null
pagination_prev: null
---

Determine type of hash:

```bash
hashcat exfil/hash.txt
...
      # | Name                                                       | Category
  ======+============================================================+======================================
   3200 | bcrypt $2*$, Blowfish (Unix)                               | Operating System
  25600 | bcrypt(md5($pass)) / bcryptmd5                             | Forums, CMS, E-Commerce
  25800 | bcrypt(sha1($pass)) / bcryptsha1                           | Forums, CMS, E-Commerce
  28400 | bcrypt(sha512($pass)) / bcryptsha512                       | Forums, CMS, E-Commerce
```

-m defines the type of hash
-a 0 means dictionary attack

```bash
hashcat exfil/hash.txt -m 3200 -a 0 /usr/share/wordlists/rockyou.txt
```