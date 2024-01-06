---
slug: /tooling/mongodb
pagination_next: null
pagination_prev: null
---

MongoDB is a document based (NoSQL) database that runs by default on port 27017.

To connect to it, we should use the mongo shell, currently `mongosh`.

To show all the database in the instance, use the `show dbs` command.

To select a database: `use <db>`

To show all the collections in a database use the `show collections` commands.

To show contents of all the documents inside a collection use the `db.<collection>.find().pretty()`. It will pretty print the results.

Example:

```
mongosh <ip>
Current Mongosh Log ID: 63999d00a5b1f19a65a9d84b
Connecting to:          mongodb://<ip>:27017/?directConnection=true&appName=mongosh+1.6.1
Using MongoDB:          3.6.8
Using Mongosh:          1.6.1

For mongosh info see: https://docs.mongodb.com/mongodb-shell/

test> show dbs
admin                  32.00 KiB
config                 72.00 KiB
local                  72.00 KiB
sensitive_information  32.00 KiB
users                  32.00 KiB
test> show collections

test> use sensitive_information
switched to db sensitive_information
sensitive_information> show collections
flag
sensitive_information> db.flag.find().pretty()
[
  {
    _id: ObjectId("630e3dbcb82540ebbd1748c5"),
    flag: 'flag'
  }
]
sensitive_information>
```