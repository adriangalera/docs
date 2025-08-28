# Linux fundamentals

## System information

- `whoami`: current username
- `id`: user identity and groups
- `hostname`: name of the current host system
- `uname`: basic information about OS and system hardware
- `pwd`: current directory name
- `ifconfig`: network interfaces
- `ip`: network interfaces plus routing, etc
- `netstat`: network status
- `ss`: sockets
- `ps`: processes status
- `who`: who is logged in
- `env`: environment variables
- `lsblk`: list block devices
- `lsusb`: list USB devices
- `lsof`: list open files
- `lspci`: list PCI devices

## Find files and directories

- `which`: returns the path to the file or link that should be executed
- `find`: find files and folders and filter the results.

e.g:

```bash
find / -type f -name *.conf -user root -size +20k -newermt 2020-03-03 -exec ls -al {} \; 2>/dev/null
```

`-type f`: searching for files
`-name *.conf`: All files with the conf extension.
`-user root`: Belongs to root user
`-size +20k`: Larger than 20KiB
`-newermt 2020-03-03`: Files created after the passed date.
`-exec ls -al {} \;`: Execute a command for each entry, the `{}` char is a wildcard for the filename.
`2>/dev/null`: Sends the error to /dev/null

- `locate`: use a local database to improve the searching time. You can update the database with `sudo updatedb`. e.g:

```bash
locate *.conf
```

locate does not have filtering options as `find`

## Redirections

Redirect STDOUT to a file:

`find /etc/ -name shadow > results.txt`

Redirect STDERR to null:

`find /etc/ -name shadow 2>/dev/null`

Redirect STDOUT and STDERR to different files:

`find /etc/ -name shadow 2> stderr.txt 1> stdout.txt`

Redirect STDIN:

`cat < stdout.txt`

Pass the contents of stdout.txt to STDIN

Redirect STDOUT and Append to a File

`find /etc/ -name passwd >> stdout.txt`

The `>>` will append the contents to a file while `>` will truncate the file and start from scratch.

Pipes `|`: redirect STDOUT from one program to the next

`find /etc/ -name *.conf 2>/dev/null | grep systemd`
`find /etc/ -name *.conf 2>/dev/null | grep systemd | wc -l`

## Filter contents

- `more`: `cat /etc/passwd | more`. Exit the pager with `Q`
- `less`: `less /etc/passwd`. Exit the pager with `Q`.
- `head`: `head /etc/passwd`. Display the ten first lines of a file.
- `tail`: `tail /etc/passwd`. Counterpart of `head`. Display the ten last lines of a file
- `sort`: `cat /etc/passwd | sort`: Sort alphabetically the output
- `grep`: `cat /etc/passwd | grep "/bin/bash"`. Pattern matching ot the output
- `cut`: Separate the output with delimiters. `cat /etc/passwd | grep -v "false\|nologin" | cut -d":" -f1`. -d sets the character as delimiter, -f the position to display
- `tr`: Replace characters. `cat /etc/passwd | grep -v "false\|nologin" | tr ":" " "`. Replace `:` by space.
- `column -t`: Tabulate the output: `cat /etc/passwd | grep -v "false\|nologin" | tr ":" " " | column -t`
- `awk`: text processor. 
```bash
cat /etc/passwd | grep -v "false\|nologin" | tr ":" " " | awk '{print $1, $NF}'
```
display the first ($1) and last ($NF) result of the line.
- `sed`: stream editor. Allow to replace characters in more complex fashion. eg:

```bash
cat /etc/passwd | grep -v "false\|nologin" | tr ":" " " | awk '{print $1, $NF}' | sed 's/bin/HTB/g'
```
Replaces the word `bin` with the word `HTB`

- `wc`: word count. Useful to count the lines, e.g:

```bash
cat /etc/passwd | grep -v "false\|nologin" | tr ":" " " | awk '{print $1, $NF}' | wc -l
```

## Regular expressions (RegEx)

Regular expressions (RegEx) are like the art of crafting precise blueprints for searching patterns in text or files.

Operators:

- Group: `(a)`. The round brackets are used to group parts of a regex. Within the brackets, you can define further patterns which should be processed together.
- Square brackets: `[a-z]`. The square brackets are used to define character classes. Inside the brackets, you can specify a list of characters to search for.
- Curly brackets: `{1,10}`. The curly brackets are used to define quantifiers. Inside the brackets, you can specify a number or a range that indicates how often a previous pattern should be repeated.
- OR operator: `|` shows results when one of the two expressions matches
- `	.*`: Operates similarly to an AND operator by displaying results only when both expressions are present and match in the specified order

Examples:

```bash
grep -E "(my|false)" /etc/passwd
```

Searches for lines containing `my` or `false`

```bash
grep -E "(my.*false)" /etc/passwd
```

Searches for lines containing `my` and `false`. Equivalent to `grep -E "my" /etc/passwd | grep -E "false"`

## Permissions

```
cry0l1t3@htb[/htb]$ ls -l /etc/passwd

- rwx rw- r--   1 root root 1641 May  4 23:42 /etc/passwd
- --- --- ---   |  |    |    |   |__________|
|  |   |   |    |  |    |    |        |_ Date
|  |   |   |    |  |    |    |__________ File Size
|  |   |   |    |  |    |_______________ Group
|  |   |   |    |  |____________________ User
|  |   |   |    |_______________________ Number of hard links
|  |   |   |_ Permission of others (read)
|  |   |_____ Permissions of the group (read, write)
|  |_________ Permissions of the owner (read, write, execute)
|____________ File type (- = File, d = Directory, l = Link, ... )
```

We can modify permissions using the `chmod` command, permission group references (u - owner, g - Group, o - others, a - All users), and either a [+] or a [-] to add remove the designated permissions:

```bash
cry0l1t3@htb[/htb]$ ls -l shell

-rwxr-x--x   1 cry0l1t3 htbteam 0 May  4 22:12 shell

cry0l1t3@htb[/htb]$ chmod a+r shell && ls -l shell

-rwxr-xr-x   1 cry0l1t3 htbteam 0 May  4 22:12 shell

cry0l1t3@htb[/htb]$ chmod 754 shell && ls -l shell

-rwxr-xr--   1 cry0l1t3 htbteam 0 May  4 22:12 shell
```

We can use the octal representation of the permissions:

```
Binary Notation:                4 2 1  |  4 2 1  |  4 2 1
----------------------------------------------------------
Binary Representation:          1 1 1  |  1 0 1  |  1 0 0
----------------------------------------------------------
Octal Value:                      7    |    5    |    4
----------------------------------------------------------
Permission Representation:      r w x  |  r - x  |  r - -
```

To change the owner of a file or directory, we'll use `chown`:

```bash
chown <user>:<group> <file/directory>
```

In addition to standard user and group permissions, Linux allows us to configure special permissions on files through the Set User ID (`SUID`) and Set Group ID (`SGID`) bits. These bits function like temporary access passes, enabling users to run certain programs with the privileges of another user or group. For example, administrators can use SUID or SGID to grant users elevated rights for specific applications, allowing tasks to be performed with the necessary permissions, even if the user themselves doesn’t normally have them.

The presence of these permissions is indicated by an `s` in place of the usual `x` in the file's permission set.

This important to notice, because it's a very good vector for privilege escalation. If a user has `suid` access to a binary, we can use GTFO bins to see how can we escape from that binary and have `root` access.

In shared directories, we can leverage `Sticky bits` to make sure the owner is the only one that can delete or rename files. Other users can access the directory but can't modify files they don't own.

Example:

```
cry0l1t3@htb[/htb]$ ls -l

drw-rw-r-t 3 cry0l1t3 cry0l1t3   4096 Jan 12 12:30 scripts
drw-rw-r-T 3 cry0l1t3 cry0l1t3   4096 Jan 12 12:32 reports
```

In this example, we see that both directories have the sticky bit set. However, the reports folder has an uppercase T, and the scripts folder has a lowercase t.

If the sticky bit is capitalized (T), then this means that all other users do not have execute (x) permissions and, therefore, cannot see the contents of the folder nor run any programs from it. The lowercase sticky bit (t) is the sticky bit where the execute (x) permissions have been set.

## User management

- `sudo`: Execute command as a different user.
- `su`: Switches to user ID (the default user is the superuser).
- `useradd`: Creates a new user or update default new user information.
- `userdel`: Deletes user account and related files
- `usermod`: Modifies user account
- `addgroup`: Add a group to the system
- `delgroup`: Delete a group
- `passwd`: Changes user password

## Service and process management

- System services: internal services required during system startup. 
- User-Installed Services: These services are added by users and typically include server applications and other background processes that provide specific features or capabilities.

Most modern Linux distributions have adopted `systemd` as their initialization system (init system). It is the first process that starts during the boot process and is assigned the Process ID (`PID`). All processes in a Linux system are assigned a PID and can be viewed under the /proc/ directory, which contains information about each process. Processes may also have a Parent Process ID (PPID), indicating that they were started by another process (the parent), making them child processes.

```bash
systemctl start ssh # start service with systemctl
systemctl status ssh # check the status
systemctl enable ssh # Run this service after startup
```

Check the process is running:

```bash
ps -aux | grep ssh
systemctl list-units --type=service # List systemctl enabled services
```

To debug services, use `journalctl`:

```bash
journalctl -u ssh.service --no-pager
```

To kill a process, we can use `kill`, `pkill`, `pgrep` and `killall`. To interact with a process, we will send them signals:

```
1-  SIGHUP - This is sent to a process when the terminal that controls it is closed.
2-  SIGINT - Sent when a user presses Ctrl + C in the controlling terminal to interrupt a process.
3-  SIGQUIT - Sent when a user presses Ctrl + D to quit.
9-  SIGKILL - Immediately kill a process with no clean-up operations.
15- SIGTERM - Program termination.
19- SIGSTOP - Stop the program. It cannot be handled anymore.
20-	SIGTSTP - Sent when a user presses Ctrl + Z to request for a service to suspend. The user can handle it afterward.
```

To send the `SIGKILL`: 

```bash
kill 9 <PID> 
```

We can send a process to background using `Ctrl + Z`. Background process can be observed with `jobs` command:

The Ctrl + Z shortcut suspends the processes, and they will not be executed further. To keep it running in the background, we have to enter the command `bg` to put the process in the background.

Another option is to automatically set the process with an AND sign (`&`) at the end of the command.

```bash
ping -c 10 www.hackthebox.eu &
```

If we want to get the background process into the foreground and interact with it again, we can use the `fg <ID>` command.

When we need to execute multiple comments, we have multiples options:

- semicolon separator: `;`

```bash
echo '1'; echo '2'; echo '3'
```

The semicolon (;) is a command separator and executes the commands by ignoring previous commands' results and errors.

- Double ampersand `&&`:

```bash
echo '1' && ls MISSING_FILE && echo '3'
```

If there is an error in one of the commands, the following ones will not be executed anymore, and the whole process will be stopped.

- Pipes `|`.

Pipes (|) depend not only on the correct and error-free operation of the previous processes but also on the previous processes' results.

This will become important on command injection attacks, where the attacker needs to execute multiple commands.

## Task scheduling

Automate tasks by running them at specific times or regular intervals, eliminating the need for manual initiation.

### Systemd

Based on timers.

```bash
sudo vim /etc/systemd/system/mytimer.timer # Create the timer
[Unit]
Description=My Timer

[Timer]
OnBootSec=3min
OnUnitActiveSec=1hour

[Install]
WantedBy=timers.target
sudo vim /etc/systemd/system/mytimer.service # Create the service
[Unit]
Description=My Service

[Service]
ExecStart=/full/path/to/my/script.sh

[Install]
WantedBy=multi-user.target
sudo systemctl daemon-reload # Instruct systemctl to reload the definition
sudo systemctl start mytimer.timer # start the service
sudo systemctl enable mytimer.timer # enable the service to be executed at startup
```

### Cron

Execute `crontab` to edit cron:

```txt
# System Update
0 */6 * * * /path/to/update_software.sh

# Execute Scripts
0 0 1 * * /path/to/scripts/run_scripts.sh

# Cleanup DB
0 0 * * 0 /path/to/scripts/clean_database.sh

# Backups
0 0 * * 7 /path/to/scripts/backup.sh
```

You can explore crontab format in https://crontab.guru/


## Network services

- `SSH`: securely manage remote systems and securely access remote systems to execute commands or transfer files. 

-`NFS`: Network File System (NFS) is a network protocol that allows us to store and manage files on remote systems as if they were stored on the local system. 

Use the file `/etc/exports` to define the shares:

```bash
mkdir nfs_sharing
echo '/home/cry0l1t3/nfs_sharing hostname(rw,sync,no_root_squash)' >> /etc/exports
at /etc/exports | grep -v "#"
```

Now in another computer, we can mount the share:

```bash
mkdir ~/target_nfs
mount 10.129.12.17:/home/john/dev_scripts ~/target_nfs
```

- `Web server`: Apache, Nginx, Python

```bash
python3 -m http.server --directory /home/cry0l1t3/target_files 1234
```

Will expose a webserver in port 1234 showing the contents of `/home/cry0l1t3/target_files`.