---
slug: /tooling/responder
pagination_next: null
pagination_prev: null
---

https://github.com/lgandx/Responder

For getting NTLM password, responder tool will setup a rogue SMB server that will capture the challenge initiated by another machine in the network and store the hash of the challenge. Later you can use `hashcat` or `john` to try to go from hash to password.

```
sudo responder -I tun0
```