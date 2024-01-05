---
slug: /tooling/netcat
pagination_next: null
pagination_prev: null
---

Listen on 1234 port:

```
nc -lnvp 1234
```

-l : Listen mode

-n: numeric-only IP addresses, no dns

-v: verbose

-p: port - we can add p to say that we want to listen on a specific port (here 1234)