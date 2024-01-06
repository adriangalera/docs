---
slug: /tooling/redis
pagination_next: null
pagination_prev: null
---

Redis is an in-memory key-value (NoSQL) database running on 6379 port by default

To connect to the database, we must use `redis-cli`:

```
redis-cli -h <ip>
```

Once inside we can retrieve more information by using the `info` command:

```
<ip>:6379> info
# Server
redis_version:5.0.7
redis_git_sha1:00000000
redis_git_dirty:0
redis_build_id:66bd629f924ac924
redis_mode:standalone
os:Linux 5.4.0-77-generic x86_64
arch_bits:64
```

To enumerate the database with some entries, we can use the `info keyspace` command. This information is present in the `info` response as well. 

To retrieve all the keys in a given database, we can use the `keys *` command once we have selected the database. To access a particular key, we use the `get` command:

```
redis-cli -h <ip>
<ip>:6379> select 0
OK
<ip>:6379> keys *
1) "numb"
2) "temp"
3) "flag"
4) "stor"
<ip>:6379> keys flag
1) "flag"
<ip>:6379> get flag
"flag"
```