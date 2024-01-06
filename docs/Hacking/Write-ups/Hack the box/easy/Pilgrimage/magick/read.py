import subprocess
import codecs
import sys

output = subprocess.check_output([ "./magick", "identify", "-verbose", sys.argv[1]])
output = output.split(b'\n')

hex_strings = ""
for i in output:
    try:
        converted_bytes = codecs.decode(i, 'hex')
        hex_strings += i.decode('ascii')
    except Exception as e:
        pass
print("Encoded hex string:", hex_strings)
converted_hex_string = codecs.decode(hex_strings, 'hex')
print("Decoded hex string:", converted_hex_string)

#print(converted_hex_string.decode("ascii"))