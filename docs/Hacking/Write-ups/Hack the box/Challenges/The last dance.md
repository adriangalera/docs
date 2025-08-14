---
slug: /write-up/htb/challenges/the-last-dance
pagination_next: null
pagination_prev: null
---
# The last dance

https://app.hackthebox.com/challenges/The%2520Last%2520Dance

To be accepted into the upper class of the Berford Empire, you had to attend the annual Cha-Cha Ball at the High Court. Little did you know that among the many aristocrats invited, you would find a burned enemy spy. Your goal quickly became to capture him, which you succeeded in doing after putting something in his drink. Many hours passed in your agency's interrogation room, and you eventually learned important information about the enemy agency's secret communications. Can you use what you learned to decrypt the rest of the messages?

We are given two files:
- out.txt
- source.py

After reading the source code, we know the contents of out.txt:

1) Initialization vector
2) Encrypted message
3) Encrypted flag

The encryption is ChaCha20

ChaCha20 is a stream cipher, meaning it encrypts data by XORing the plaintext with a keystream derived from:

- A key
- A nonce/IV
- A counter (which increments for each block)

The keystream is deterministic and only depends on the key and IV (and counter), not the plaintext. So if the same key and IV are reused, the same keystream is reused.

In order to retriev the flag, we'lll do the following:

1) Derive the keystream from the encrypted message by doing:

```
keystream = encrypted message XOR plaintext
```

2) Extract the flag by doing:

```
flag = keystream XOR encrypted flag
```

Remember that for XOR both inputs need to be of the same size!