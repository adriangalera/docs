---
slug: /tooling/john-the-ripper
pagination_next: null
pagination_prev: null
---

https://github.com/openwall/john

Password cracking tool. It does not do anything magic, it just compares a hash file with a list of words (dictionary). It has a quite decent default dictionary, however, you can search for more complete dictionaries such as the [rock-you.txt](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwi5noL2vP77AhXLXqQEHYafALkQFnoECA0QAQ&url=https%3A%2F%2Fgithub.com%2Fbrannondorsey%2Fnaive-hashcat%2Freleases%2Fdownload%2Fdata%2Frockyou.txt&usg=AOvVaw3snAERl1mU6Ccr4WFEazBd)

Make sure to install a version >= 1.9.0, which enables support for many hash formats. In my case for 1.8.0 version I couldn't crack a NTLMv2 hash.

You can also use `zip2john` tool to brute-force zip files with passwords.

You can specify the format as well:

```
john --format=raw-md5 passwd.txt
```

You can determine the type of hash by running `hashid` and then check with:

```
john --list=formats
```