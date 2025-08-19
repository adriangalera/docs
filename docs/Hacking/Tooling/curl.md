---
slug: /tooling/curl
pagination_next: null
pagination_prev: null
---

# curl

The classic HTTP request/response program.

## Follow redirects

```shell
└─$ curl -L "http://nocturnal.htb/view.php?username=test2&file=test.pdf"
```

## Cookies

```shell
└─$ curl "http://nocturnal.htb/view.php?username=test2&file=test.pdf" -b "PHPSESSID=xxx" -v
```