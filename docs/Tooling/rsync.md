---
slug: /tooling/rsync
pagination_next: null
pagination_prev: null
---

rsync is a tool to share files between Linux machines, it defaults to SSH port (22) or 873.

With `rsync://` will use 873 port while the form `user@host` will use the SSH port

To list all the rsync shares:

```
rsync --list-only rsync://<ip>
public         	Anonymous Share
```