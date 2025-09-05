# Javascript deobfuscation

Obfuscation is a technique used to make a script more difficult to read by humans but allows it to function the same from a technical point of view, though performance may be slower. This is usually achieved automatically by using an obfuscation tool, which takes code as an input, and attempts to re-write the code in a way that is much more difficult to read, depending on its design.

## Minification

A common way of reducing the readability of a snippet of JavaScript code while keeping it fully functional is JavaScript minification. Code minification means having the entire code in a single (often very long) line.

## Packer 
A packer obfuscation tool usually attempts to convert all words and symbols of the code into a list or a dictionary and then refer to them using the (p,a,c,k,e,d) function to re-build the original code during execution."

## Advanced Obfuscation

The strings con be converted to Base64 to make it less human-readable. Here we can see many obfuscation techniques: https://obfuscator.io/

## Deobfuscation

The invert of minification is called `beautify`. There are many tools to do this, such as https://beautifier.io/

If the code is not be readable, it might have another obfuscation method applied, we can use https://matthewfl.com/unPacker.html to continue with the deobfuscation.

It is good always to check for some encoding such as Base64. Base64 encoded strings are easily spotted since they only contain alpha-numeric characters. However, the most distinctive feature of base64 is its padding using = characters

Another kind of encoding might be `Hex`. In this encoding each character is replaced by its value in the ASCII table:

```bash
echo https://www.hackthebox.eu/ | xxd -p
68747470733a2f2f7777772e6861636b746865626f782e65752f0a

echo 68747470733a2f2f7777772e6861636b746865626f782e65752f0a | xxd -p -r
https://www.hackthebox.eu/
```

A classical encoding is `Caesar/Rot13`. In this encoding, every character is shifted by 1. `a` becomes `b` and so on.

```bash
echo https://www.hackthebox.eu/ | tr 'A-Za-z' 'N-ZA-Mn-za-m'
uggcf://jjj.unpxgurobk.rh/

echo uggcf://jjj.unpxgurobk.rh/ | tr 'A-Za-z' 'N-ZA-Mn-za-m'
https://www.hackthebox.eu/
```

If you have an encoded message you don't recognize, you can use https://www.boxentriq.com/code-breaking/cipher-identifier. To try to detect the encoding.