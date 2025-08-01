---
slug: /write-up/htb/challenges/spookypass
pagination_next: null
pagination_prev: null
---

# Spookypass

https://app.hackthebox.com/challenges/SpookyPass

All the coolest ghosts in town are going to a Haunted Houseparty - can you prove you deserve to get in?

This is a reversing challenge, we need to provide a password to get in.

Let's use ghidra to see the code and try to find the password. Running the command:

```bash
└─$ ./pass     
Welcome to the SPOOKIEST party of the year.
Before we let you in, you'll need to give us the password: 
Welcome inside!
HTB{uXXXXXXXX}
```

It was extremely easy, just use `ghydra` and search for the text "give us the password".  This is the decompiled code:

```c
  puts("Welcome to the \x1b[1;3mSPOOKIEST\x1b[0m party of the year.");
  printf("Before we let you in, you\'ll need to give us the password: ");
  fgets(local_98,0x80,stdin);
  pcVar2 = strchr(local_98,10);
  if (pcVar2 != (char *)0x0) {
    *pcVar2 = '\0';
  }
  iVar1 = strcmp(local_98,"s3cr3t_p455_f0r_gh05t5_4nd_gh0ul5");
```

Which shows the password to provide. Once provided, the program will print the flag to provide.

Piece of cake!