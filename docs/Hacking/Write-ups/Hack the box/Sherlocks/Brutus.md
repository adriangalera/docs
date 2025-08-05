---
slug: /write-up/htb/sherlocks/brutus
pagination_next: null
pagination_prev: null
---
# Brutus

In this very easy Sherlock, you will familiarize yourself with Unix auth.log and wtmp logs. We'll explore a scenario where a Confluence server was brute-forced via its SSH service. After gaining access to the server, the attacker performed additional activities, which we can track using auth.log. Although auth.log is primarily used for brute-force analysis, we will delve into the full potential of this artifact in our investigation, including aspects of privilege escalation, persistence, and even some visibility into command execution.

Make sure to use `7zip` to extract the file, it does not work with `unzip`.

The sherlock is very easy to complete, just read the auth.log and use the provider parser to extract the required timestamps. Remember, they will be in your system time, you need to convert them to UTC.