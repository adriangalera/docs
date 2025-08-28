## File inclusion

To reduce the amount of code required, sometimes the page or section to render is passed with a parameter. If this feature is not properly secured an attacker can use this parameter to display the content of any file.

## Local file inclusion

This vulnerability happens typically on templating engines. For example:

`/index.php?page=about` and `about` is a PHP file in the same directory.

File Inclusion vulnerabilities may occur in any web server and any development frameworks, as all of them provide functionalities for loading dynamic content and handling front-end templates.

The most important thing to keep in mind is that some of the above functions only read the content of the specified files, while others also execute the specified files. Furthermore, some of them allow specifying remote URLs, while others only work with files local to the back-end server.

The following table shows which functions may execute files and which only read file content:

![](lfi.png)

### Basic LFI

One example of basic LFI, can be `http://<SERVER_IP>:<PORT>/index.php?language=es.php`. In a webpage, when we change the language, another file is read (`es.php`).

Two common readable files that are available on most back-end servers are `/etc/passwd` on Linux and `C:\Windows\boot.ini` on Windows. So, let's change the parameter from es to /etc/passwd: `http://<SERVER_IP>:<PORT>/index.php?language=/etc/passwd` and we retrieve the `/etc/passwd` file contents.

### Path traversal

There might be cases where the file inclusion is "restricted" to some folder:

```php
include("./languages/" . $_GET['language']);
```

The languages are loaded from the `languages` folder. In this case, if we visit the URL in the previous section, it will not work because it will try to read the file in `./languages/etc/password`.

We can easily bypass this restriction using `relative paths`. We can add `../` to visit the parent directory. So, we can use this trick to go back several directories until we reach the root path (i.e. /), and then specify our absolute file path (e.g. ../../../../etc/passwd), and the file should exist:

`http://<SERVER_IP>:<PORT>/index.php?language=../../../../etc/passwd`.

### Filename prefix

On some occasions, our input may be appended after a different string. For example, it may be used with a prefix to get the full filename, like the following example:

```php
include("lang_" . $_GET['language']);
```

In this case, if we try to traverse the directory with ../../../etc/passwd, the final string would be lang_../../../etc/passwd, which is invalid.

instead of directly using path traversal, we can prefix a `/` before our payload, and this should consider the prefix as a directory, and then we should bypass the filename and be able to traverse directories.

This may not always work, as in this example a directory named lang_/ may not exist, so our relative path may not be correct.

### Appended extensions

Sometimes, the extension of the file is included in the backend code:

```php
include($_GET['language'] . ".php");
```

if we try to read /etc/passwd, then the file included would be /etc/passwd.php, which does not exist.

The bypass for this will be discussed in future sections.

### Second order attacks

This occurs because many web application functionalities may be insecurely pulling files from the back-end server based on user-controlled parameters.

For example, a web application may allow us to download our avatar through a URL like (/profile/$username/avatar.png). If we craft a malicious LFI username (e.g. ../../../etc/passwd), then it may be possible to change the file being pulled to another local file on the server and grab it instead of our avatar.

## Basic bypass

The developers usually put some mechanism to protect user inputs. However, most of them can be bypassed.

### Search and replace filter

Detect and deletes substrings of `../`:

```php
$language = str_replace('../', '', $_GET['language']);
```

In this case, it does not replace recursively, it will only replace the first entry of `../`. So, `....//` would become `../` and this way we can retrieve the file.

There are other ways of bypassing the search replace, we may use ..././ or ....\/ and several other recursive LFI payloads. Furthermore, in some cases, escaping the forward slash character may also work to avoid path traversal filters (e.g. ....\/), or adding extra forward slashes (e.g. ....////)

### Encoding

Sometimes, when the payload is URL encoded and the check is implemented poorly, the limitation will be bypassed. For example:

If the target web application did not allow `.` and `/` in our input, we can URL encode `../` into `%2e%2e%2f`, which may bypass the filter.

Sometimes double URL encode might help bypassing the filter.

### Approved paths

Sometimes, the application restrict the user input to make sure if lands in an approved path, e.g.

```php
if(preg_match('/^\.\/languages\/.+$/', $_GET['language'])) {
    include($_GET['language']);
} else {
    echo 'Illegal path specified!';
}
```
To bypass this, we may use path traversal and start our payload with the approved path, and then use ../ to go back to the root directory and read the file we specify, as follows: `<SERVER_IP>:<PORT>/index.php?language=./languages/../../../../etc/passwd`

### Approved extension

With modern versions of PHP, we may not be able to bypass this and will be restricted to only reading files in that extension, which may still be useful e.g. for reading source code.

#### Path Truncation

In earlier versions of PHP, defined strings have a maximum length of 4096 characters, likely due to the limitation of 32-bit systems. If a longer string is passed, it will simply be truncated, and any characters after the maximum length will be ignored. Furthermore, PHP also used to remove trailing slashes and single dots in path names, so if we call (/etc/passwd/.) then the /. would also be truncated, and PHP would call (/etc/passwd). PHP, and Linux systems in general, also disregard multiple slashes in the path (e.g. ////etc/passwd is the same as /etc/passwd). Similarly, a current directory shortcut (.) in the middle of the path would also be disregarded (e.g. /etc/./passwd).

If we combine both of these PHP limitations together, we can create very long strings that evaluate to a correct path. Whenever we reach the 4096 character limitation, the appended extension (.php) would be truncated, and we would have a path without an appended extension. Finally, it is also important to note that we would also need to start the path with a non-existing directory for this technique to work.

we should calculate the full length of the string to ensure only .php gets truncated

#### Null bytes

Adding a null byte (%00) at the end of the string would terminate the string and not consider anything after it.

To exploit this vulnerability, we can end our payload with a null byte (e.g. `/etc/passwd%00`), such that the final path passed to include() would be (`/etc/passwd%00.php`). This way, even though .php is appended to our string, anything after the null byte would be truncated, and so the path used would actually be /etc/passwd, leading us to bypass the appended extension.
