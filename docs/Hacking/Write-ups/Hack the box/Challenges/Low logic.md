---
slug: /write-up/htb/challenges/low-logic
pagination_next: null
pagination_prev: null
---
# Low logic

https://app.hackthebox.com/challenges/Low%20Logic

I have this simple chip, I want you to understand how it's works and then give me the output.

A basic analysis treating the transistors as a simple switch will give us what the circuit is doing: 

`i1 AND i2 OR i3 AND i4`. 

Now we can create a python program that reads the `input.csv` binary input, generate the binary output and then convert the binary sequence to an ASCII sequence that will be the key:

```python
import csv

bits = []
with open("./input.csv", 'r') as fd:
    reader = csv.reader(fd)
    next(reader)
    for row in reader:
        i1,i2,i3,i4 = map(int,row)
        o0 = (i1 & i2) | (i3 & i4)
        bits.append(o0)

# Step 1: Group bits into chunks of 8
chunks = [bits[i:i+8] for i in range(0, len(bits), 8)]

# Step 2: Convert each chunk to a character
ascii_string = ''.join(chr(int(''.join(map(str, chunk)), 2)) for chunk in chunks)

print(ascii_string)
```