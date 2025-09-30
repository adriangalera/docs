---
draft: true
---
# Buffer overflow on Linux

What is a buffer overflow?

A buffer overflow occurs when an application does not handle correctly the input data. If the data is specially crafted, it can reach to some special parts of the memory that call registers. These registers are used to process the flow of the program, therefore any user can manipulate the originally coded logic of the application just be providing a special input. In other terms, buffer overflows are errors that occur when data that is too large to fit into a buffer of the operating system's memory overflows this buffer.

For example, in C language the following functions do not protect the memory: `strcpy`,`gets`,`sprintf`,`scanf`,`strcat`. Whenever you see a use of these functions, it mightt be a good indicator of a possible buffer overflow vulnerability.

If the `return address`register is manipulated, it allows the user to execute commands with the privilege of the application in the system.

The most usual cause for this vulnerability is the use of languages that rely on the developer for memory management, e.g. `C` and `C++`. The executable files are the compiled output of the application source code, the format differs from OS. In Linux, the format is `Executable and Linking Format (ELF)`, in Windows it is called `Portable Executable Format (PE)`.

Programs store data and instructions in memory during initialization and execution. These are data that are displayed in the executed software or entered by the user. The instructions are used to model the program flow. Among other things, return addresses are stored in the memory, which refers to other memory addresses and thus define the program's control flow. If such a return address is deliberately overwritten by using a buffer overflow, an attacker can manipulate the program flow by having the return address refer to another function or subroutine. Also, it would be possible to jump back to a code previously introduced by the user input.

## Memory structure

This this type of attack rely on a mismanagement of application memory, first we need to understand how the memory is structured.

TODO: ADD A DIAGRAM!

- .text: actual assembler instructions of the program. Usually this section is read-only. Any write attempt will likely result in Segmentation Fault.
- .data: contains global and static data defined by the program.
- .bss: Several compilers and linkers use the this section as part of the data segment, which contains statically allocated variables represented exclusively by 0 bits.
- Heap: memory area allocated to each program. Memory allocated to heap can be dynamically allocated, unlike memory allocated to stacks.
- Stack: Least-In-First-Out memory. The return address, parameters and sometimes frame pointers are stored in the stack memory. This is where local variables are stored. The linker reserves this area and usually places the stack in RAM's lower area above the global and static variables. The contents are accessed via the `stack pointer`, set to the upper end of the stack during initialization. During execution, the allocated part of the stack grows down to the lower memory addresses.

Here is an example of a vulnerable program:

```c
#include <stdlib.h>
#include <stdio.h>
#include <string.h>

int bowfunc(char *string) {

 char buffer[1024];
 strcpy(buffer, string);
 return 1;
}

int main(int argc, char *argv[]) {

 bowfunc(argv[1]);
 printf("Done.\n");
 return 1;
}
```

The user input is passed as an argument to the `bowfunc`. If the user introduces more than 1024 characters, the application will crash. If specially crafted input is passed, an attacker will reach to the `return address` and do whatever they want.

## GDB Introduction

GDB, or the GNU Debugger, is the standard debugger of Linux systems developed by the GNU Project. We can set breakpoints, observe the memory contents of the application. We can also use it to disassemble the binary into machine code.

In the first column, we get some numbers that represent the memory address. The numbers with the plus sign (+) show the address jumps in memory in bytes, used for the respective instruction. Next, we can see the assembler instructions with registers and their operation suffixes.

There are two types of syntax:

- AT&T syntax
- Intel syntax: The Intel syntax makes the disassembled representation easier to read

To change to intel syntax, run `set disassembly-flavor intel` in `gdb`.

To make the change permanent, you need to write to the gdbinit file:

```bash
echo 'set disassembly-flavor intel' > ~/.gdbinit
```

## CPU Registers

Registers are the essential components of a CPU. Almost all registers offer a small amount of storage space where data can be temporarily stored. However, some of them have a particular function. We'll list here only the relevant registers for buffer overflow.

| Register | Description                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------- |
| EIP      | Instruction Pointer stores the offset address of the next instruction to be executed                    |
| ESP      | Stack Pointer points to the top of the stack                                                            |
| EBP      | Base Pointer is also known as Stack Base Pointer or Frame Pointer thats points to the base of the stack |

Since the stack starts with a high address and grows down to low memory addresses as values are added, the Base Pointer points to the beginning (base) of the stack in contrast to the Stack Pointer, which points to the top of the stack.

Each function execution creates a Stack Frame inside the Stack. A stack frame defines a frame of data with the beginning (EBP) and the end (ESP) that is pushed onto the stack when a function is called.

When a function is executed with the `call` instruction, it performs two operations:

1) it pushes the return address onto the stack so that the execution of the program can be continued after the function has successfully fulfilled its goal
2) it changes the instruction pointer (EIP) to the call destination and starting execution there.

## Endianness

There are two ways of reading bytes. Big-endian and little-endian. In big-endian, the digits with the highest valence are first. In little-endian, the digits with the lowest valence are at the beginning.

Now let's look at an example: we need to store the following hex word `\xAA\xBB\xCC\xDD` into the memory starting by position `0xffff0000`:

| Memory Address | 0xffff0000 | 0xffff0001 | 0xffff0002 | 0xffff0003 |
| -------------- | ---------- | ---------- | ---------- | ---------- |
| Big-Endian     | AA         | BB         | CC         | DD         |
| Little-Endian  | DD         | CC         | BB         | AA         |
