import base64
from Crypto.Cipher import DES3
from Crypto.Util.Padding import unpad

# === Config ===
des_key = b'rcmail-!24ByteDESkey*Str'  # Your 24-byte DES key
assert len(des_key) == 24

# This is the encrypted password value from session (PHP serialized string):
encrypted_password_b64 = "L7Rv00A8TuwJAr67kITxxcSgnIk25Am/"

# === Decode and decrypt ===
try:
    ciphertext = base64.b64decode(encrypted_password_b64)
    iv = ciphertext[:8]
    encrypted = ciphertext[8:]

    cipher = DES3.new(des_key, DES3.MODE_CBC, iv)
    decrypted = unpad(cipher.decrypt(encrypted), DES3.block_size)

    print("[+] Decrypted password:", decrypted.decode())
except Exception as e:
    print("[-] Decryption failed:", e)
