---
slug: /playbooks/improve-shell
pagination_next: null
pagination_prev: null
---
# Improve shell

When trying to get Remote Code Execution most of the times we get a non-interactive shell. This page list some ways of improving the shitty shell to an interactive one.

## When python is available

In order to get a better shell, we could the following commands:

```bash
python3 -c 'import pty;pty.spawn("/bin/bash")'
export TERM=xterm
ctrl + z
stty raw -echo; fg
```

You can find mmore methods to improve the shell here https://blog.ropnop.com/upgrading-simple-shells-to-fully-interactive-ttys/

## No python available

```bash
script /dev/null -c bash
```

or

```bash
stty raw -echo; fg
```
