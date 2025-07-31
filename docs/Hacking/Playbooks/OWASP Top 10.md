---
slug: /playbooks/owasp
pagination_next: null
pagination_prev: null
---
# OWASP TOP 10

In https://owasp.org/Top10/ website, you can see what are the most common vulnerabilities to exploit.

They are well categorized and they provide examples in website.

I'll try to explain the groups sorted by order of occurrence in this article. This should be like a map to follow when pentesting things.

## Broken Access Control

https://owasp.org/Top10/A01_2021-Broken_Access_Control

Malicious users can manipulate access control mechanisms.

Examples of this are:

- Modify the loging cookie to change from regular user to admin user
- Manipulate JWT Tokens
- ...

## Cryptographic Failures

https://owasp.org/Top10/A02_2021-Cryptographic_Failures/

Examples of this are:

- Using old ciphers in symmetric encryption
- Using short keys for RSA key: able to generate the private key from the public key
- Unsalted passwords
- ...

## Injection

https://owasp.org/Top10/A03_2021-Injection/

When the user can input some value to the application, the developers should pay extra attention to validate or sanitize it. Otherwise, a malicious user can inject any value on it.

Examples are:
- SQL injections: break the SQL query syntax to execute arbitrary queries
- OS injections: being able to execute OS commands via the user input
- Server-side template injection: abuse a template engine to inject any code
- ...

The injection can be reflected on the screen: the typical use case is for login. You log in with made up username and you see the username back in the UI. This helps a lot because you can test with attack attempts.

If you don't see the results back, you can try 2 things:
- Write to a public file: if the target has a public endpoint, you can make the injection to write to a file in that public directory to extract the data.
- Out of band interaction: if you own a server, you can make the target connect to that server to exfiltrate the data
- Abuse of the errors: if you see the stacktrace, you can use it in your favour and throw errors containg the information you want to extract.

## Insecure Design

https://owasp.org/Top10/A04_2021-Insecure_Design/

Examples of this are:

- Bot detection mechanism
- Credentials hardcoded in the code
- ...

## Security Misconfiguration

https://owasp.org/Top10/A05_2021-Security_Misconfiguration/

This topic is very broad and might include things like:

- Default users, passwords
- Unprotected paths of the application (remember nginx off-by-slash vulnerability)
- Stack traces revealing information to the user

## Vulnerable and Outdated Components

https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components

Using old libraries might cause the application to be vulnerable to new attacks that recent versions of the library fix

When you are exploring this attack vector, check the repository of the library (if open source) and look for commits for the next versions. If you see something looking like a security fix, it's worth trying to replicate it in your setup.


## Identification and Authentication Failures

https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/

Examples:

- Default/weak password
- Allowing brute force attacks to guess username/password



## Software and Data Integrity Failures

https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/

Application that relies on plugins, libraries, etc.. from third-party must verify the integrity of the component. This also applies to the user input. 

If the user can see and modify a serialized payload, that payload should be handled with extra care.

Additionally, CI/CD pipeline must be well secured, otherwise the attackers might modified the shipped software.


## Security Logging and Monitoring Failures

https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures

Not enough monitoring for scenarios like excessive number of failed login attemps, etc...

## Server-Side Request Forgery (SSRF)

https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29

This happens when an application fetches a resource from a third-pary based on the input provided by a user. 

For instance, in a template engine, the legitimate users might include an image stored in their webserver. However, an attacker might include their own crafted version of the image that includes malicious code.