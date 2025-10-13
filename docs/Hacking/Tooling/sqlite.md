# SQLite

Enter the database:

```shell
sqlite3 users.db
```

Show all tables:

```shell
SELECT name FROM sqlite_master WHERE type='table';
```

or

```bash
.tables
```

Show table schema:

```shell
.schema table_name
```

or

```bash
pragma table_info(users);
```
