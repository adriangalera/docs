---
slug: /tooling/gdb
pagination_next: null
pagination_prev: null
---

`gdb` is the GNU debugger. See the following operations:

- Set a breakpoint: `b *0x08049291`
- Run the program: `r`
- Run program with input: `r < pattern.txt`
- Continue the execution after breakpoint: `c`
- Show file information: `info file`
- Show stack: `x/60x $esp`
- Show where the address points: `x/i <address>`, e.g.:
```
gef➤  x/i 0x7ffff7d14a37
   0x7ffff7d14a37 <__GI___libc_write+23>:	cmp    rax,0xfffffffffffff000
```
- Get variable memory address (variable named target): `p &target`

## gdb-peda

Python Exploit Development Assistance for GDB

<a href="https://github.com/longld/peda">https://github.com/longld/peda</a>

- Create a pattern of 200 chars: `pattern_create 200 bof.txt`
- Calculate the number of characters to do buffer overflow: `pattern_offset <EIP register>`
- Get assembler code for function: `disas <function>`. The first line shows the address you must use to jump

## gdb-gef

GDB-Enhaced Features

<a href="https://github.com/hugsy/gef">https://github.com/hugsy/gef</a>

- `vmmap`: show how the memory is organized, very useful to calculate memory offsets:

```
gef➤  vmmap 
[ Legend:  Code | Heap | Stack ]
Start              End                Offset             Perm Path
0x00555555554000 0x00555555555000 0x00000000000000 r-- /home/gal/workspace/hackthebox/spooky-time/challenge/spooky_time
0x00555555555000 0x00555555556000 0x00000000001000 r-x /home/gal/workspace/hackthebox/spooky-time/challenge/spooky_time
0x00555555556000 0x00555555557000 0x00000000002000 r-- /home/gal/workspace/hackthebox/spooky-time/challenge/spooky_time
0x00555555557000 0x00555555558000 0x00000000002000 rw- /home/gal/workspace/hackthebox/spooky-time/challenge/spooky_time
0x007ffff7d90000 0x007ffff7d93000 0x00000000000000 rw- 
0x007ffff7d93000 0x007ffff7dbb000 0x00000000000000 r-- /home/gal/workspace/hackthebox/spooky-time/challenge/glibc/libc.so.6
0x007ffff7dbb000 0x007ffff7f50000 0x00000000028000 r-x /home/gal/workspace/hackthebox/spooky-time/challenge/glibc/libc.so.6
0x007ffff7f50000 0x007ffff7fa8000 0x000000001bd000 r-- /home/gal/workspace/hackthebox/spooky-time/challenge/glibc/libc.so.6
0x007ffff7fa8000 0x007ffff7fac000 0x00000000214000 r-- /home/gal/workspace/hackthebox/spooky-time/challenge/glibc/libc.so.6
0x007ffff7fac000 0x007ffff7fae000 0x00000000218000 rw- /home/gal/workspace/hackthebox/spooky-time/challenge/glibc/libc.so.6
```
spooky_time memory is between address `0x00555555554000` and `0x00555555558000`
libc memory is between address `0x007ffff7d93000` and `0x007ffff7fae000`
