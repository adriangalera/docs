# SQLite

Enter the database:

``shell
sqlite3 users.db
```

Show all tables:

```shell
SELECT name FROM sqlite_master WHERE type='table';
```

Show table schema:

```shell
.schema table_name
```