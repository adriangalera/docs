---
slug: /write-up/htb/machines/easy/pilgrimage
pagination_next: null
pagination_prev: null
---

## Enumeration

Open ports: 80 and 22

```
22/tcp open  ssh     OpenSSH 8.4p1 Debian 5+deb11u1 (protocol 2.0)
80/tcp open  http    nginx 1.18.0
```

```bash
└──╼ $whatweb pil.htb
http://pil.htb [200 OK] Bootstrap, Cookies[PHPSESSID], Country[RESERVED][ZZ], HTML5, HTTPServer[nginx/1.18.0], IP[10.10.11.219], JQuery, Script, Title[Pilgrimage - Shrink Your Images], nginx[1.18.0]
```
It's using PHP, the service looks useful to shrink images, it has a form where you upload an image and it will generate a new link with the shrink verion.

Brute-forcing the directory, we can see the webserver exposes the `.git` folder. Let's try to retrieve the code from there.

We can dump the exposed git folder and reconstruct the sources using https://github.com/arthaud/git-dumper

## Foothold

Checking the code, we observe a potential command injection here:

```php
      $mime = ".png";
      $imagePath = $upload->getFullPath();
      if(mime_content_type($imagePath) === "image/jpeg") {
        $mime = ".jpeg";
      }
      $newname = uniqid();
      exec("/var/www/pilgrimage.htb/magick convert /var/www/pilgrimage.htb/tmp/" . $upload->getName() . $mime . " -resize 50% /var/www/pilgrimage.htb/shrunk/" . $newname . $mime);
```

We can abuse the `exec` by breaking the cmd using:
- $upload->getName()
- $mime
- $newname

$mime and $newname are not controlled by the user, which left us only `$upload->getName()` to try the command injection. `getName` cannot be abused because the value does not depend on the user.

```php
    /**
     * @param array $_files represents the $_FILES array passed as dependency
     */
    public function __construct(array $_files = array())
    {
      if (!function_exists('exif_imagetype')) {
        $this->error = 'Function \'exif_imagetype\' Not found. Please enable \'php_exif\' in your php.ini';
      }

      $this->_files = $_files;
    }
```

The construct only reads `$_FILES` and set it to the variable, `name` cannot be abused.

Looks like the service is using `imagemagick` to do the shrinking, we have the binary, so we can extract the version from an x64_86 computer (same arch as the binary):

```
./magick --version
7.1.0-49
```

If we search for vulnerabilities for that library, we'll find something interesting: https://www.uptycs.com/blog/denial-of-servicedos-and-arbitrary-file-read-vulnerability-in-imagemagick.

There's a very nice explanation on how to exploit this vulnerability. After exploiting this we can read the /etc/passwd and identify a user named `emily`.

Tried to search for some flags inside the home with no luck. Tried to get SSH keys without any luck.

Going back to the source code, we see that there's a dashboard querying a database, we can try to download that database

```
Decoded hex string: b'SQLite format 3\x00\x10\x00\x01\x01\x00@  \x
```
Looks like we got it, we'll need to tweak the format a bit.

We need to pass the hex bytes to actual bytes and we'll retrieve the whole sqlite database where there's a table with username-password and the password for `emily` is there, later we can connect with SSH and we're in as `emily`. Now we can read the user flag.

## Privilege escalation


For privilege escalation, looks like the user emily can execute the `magick` command which belongs to `root`:

```bash
emily@pilgrimage:/var/www/pilgrimage.htb$ ls -lisa |grep "magick"
43806 26912 -rwxr-xr-x 1 root root 27555008 Feb 15  2023 magick
```

Analyzing the processes, we see an interesting script executed as root:

```bash
#!/bin/bash

blacklist=("Executable script" "Microsoft executable")

/usr/bin/inotifywait -m -e create /var/www/pilgrimage.htb/shrunk/ | while read FILE; do
        filename="/var/www/pilgrimage.htb/shrunk/$(/usr/bin/echo "$FILE" | /usr/bin/tail -n 1 | /usr/bin/sed -n -e 's/^.*CREATE //p')"
        binout="$(/usr/local/bin/binwalk -e "$filename")"
        for banned in "${blacklist[@]}"; do
                if [[ "$binout" == *"$banned"* ]]; then
                        /usr/bin/rm "$filename"
                        break
                fi
        done
done
```

Looks like this is performing some kind of scan of the files uploaded and uses the binwalk python module which analyse the uploaded file:

```bash
emily@pilgrimage:~$ binwalk -e /var/www/pilgrimage.htb/shrunk/6516e94e5aa54.png

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             PNG image, 7 x 7, 8-bit colormap, non-interlaced
```

The binary is just a convenient alias to the `binwalk` python library.

This looks promising...

From the very same github page of the project, there's a security warning:

```
Prior to Binwalk v2.3.3, extracted archives could create symlinks which point anywhere on the file system, potentially resulting in a directory traversal attack if subsequent extraction utilties blindly follow these symlinks. More generically, Binwalk makes use of many third-party extraction utilties which may have unpatched security issues; Binwalk v2.3.3 and later allows external extraction tools to be run as an unprivileged user using the run-as command line option (this requires Binwalk itself to be run with root privileges). Additionally, Binwalk v2.3.3 and later will refuse to perform extraction as root unless --run-as=root is specified.
```

Here we are dealing with binwalk v2.3.2, so it contains this vulnerability.

More details about the vulnerability:

- https://onekey.com/blog/security-advisory-remote-command-execution-in-binwalk/
- https://github.com/electr0sm0g/CVE-2022-4510

The idea is to generate the payload to open a connection and upload it via SCP with the emily user. If we upload it via the web it will not open the connection since the image generated by convert, will not have the malicious payload to abuse binwalk.