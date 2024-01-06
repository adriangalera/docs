---
slug: /languages/bash
pagination_next: null
pagination_prev: null
---
This article explain some security issues found in Bash scripts.

## Pattern matching comparison

This comparisson is making a pattern matching instead of a string equality comparisson.

```bash
if [[ $DB_PASS == $USER_PASS ]]; then
```

This leads to the issue that the user does not need to know the value of `DB_PASS` to go through this if. If `USER_PASS` is `*`, the if will evaluate to true. This leads to a even worse situation, we can brute force the value of the variable by adding characters to the variable, e.g:

a* -> Password succed -> First char is a, let's try next char ...
ab* -> Password succeed -> We know the password is ab, etc...

And repeat this process until all chars are revealed.