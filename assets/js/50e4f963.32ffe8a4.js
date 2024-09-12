"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[9453],{6524:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>s,default:()=>d,frontMatter:()=>r,metadata:()=>o,toc:()=>c});var t=i(4848),a=i(8453);const r={slug:"/write-up/htb/easy/pilgrimage",pagination_next:null,pagination_prev:null},s=void 0,o={id:"Hacking/Write-ups/Hack the box/easy/Pilgrimage/Pilgrimage",title:"Pilgrimage",description:"Enumeration",source:"@site/docs/Hacking/Write-ups/Hack the box/easy/Pilgrimage/Pilgrimage.md",sourceDirName:"Hacking/Write-ups/Hack the box/easy/Pilgrimage",slug:"/write-up/htb/easy/pilgrimage",permalink:"/docs/write-up/htb/easy/pilgrimage",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{slug:"/write-up/htb/easy/pilgrimage",pagination_next:null,pagination_prev:null},sidebar:"tutorialSidebar"},l={},c=[{value:"Enumeration",id:"enumeration",level:2},{value:"Foothold",id:"foothold",level:2},{value:"Privilege escalation",id:"privilege-escalation",level:2}];function h(e){const n={a:"a",code:"code",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,a.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h2,{id:"enumeration",children:"Enumeration"}),"\n",(0,t.jsx)(n.p,{children:"Open ports: 80 and 22"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"22/tcp open  ssh     OpenSSH 8.4p1 Debian 5+deb11u1 (protocol 2.0)\n80/tcp open  http    nginx 1.18.0\n"})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"\u2514\u2500\u2500\u257c $whatweb pil.htb\nhttp://pil.htb [200 OK] Bootstrap, Cookies[PHPSESSID], Country[RESERVED][ZZ], HTML5, HTTPServer[nginx/1.18.0], IP[10.10.11.219], JQuery, Script, Title[Pilgrimage - Shrink Your Images], nginx[1.18.0]\n"})}),"\n",(0,t.jsx)(n.p,{children:"It's using PHP, the service looks useful to shrink images, it has a form where you upload an image and it will generate a new link with the shrink verion."}),"\n",(0,t.jsxs)(n.p,{children:["Brute-forcing the directory, we can see the webserver exposes the ",(0,t.jsx)(n.code,{children:".git"})," folder. Let's try to retrieve the code from there."]}),"\n",(0,t.jsxs)(n.p,{children:["We can dump the exposed git folder and reconstruct the sources using ",(0,t.jsx)(n.a,{href:"https://github.com/arthaud/git-dumper",children:"https://github.com/arthaud/git-dumper"})]}),"\n",(0,t.jsx)(n.h2,{id:"foothold",children:"Foothold"}),"\n",(0,t.jsx)(n.p,{children:"Checking the code, we observe a potential command injection here:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-php",children:'      $mime = ".png";\n      $imagePath = $upload->getFullPath();\n      if(mime_content_type($imagePath) === "image/jpeg") {\n        $mime = ".jpeg";\n      }\n      $newname = uniqid();\n      exec("/var/www/pilgrimage.htb/magick convert /var/www/pilgrimage.htb/tmp/" . $upload->getName() . $mime . " -resize 50% /var/www/pilgrimage.htb/shrunk/" . $newname . $mime);\n'})}),"\n",(0,t.jsxs)(n.p,{children:["We can abuse the ",(0,t.jsx)(n.code,{children:"exec"})," by breaking the cmd using:"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"$upload->getName()"}),"\n",(0,t.jsx)(n.li,{children:"$mime"}),"\n",(0,t.jsx)(n.li,{children:"$newname"}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["$mime and $newname are not controlled by the user, which left us only ",(0,t.jsx)(n.code,{children:"$upload->getName()"})," to try the command injection. ",(0,t.jsx)(n.code,{children:"getName"})," cannot be abused because the value does not depend on the user."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-php",children:"    /**\n     * @param array $_files represents the $_FILES array passed as dependency\n     */\n    public function __construct(array $_files = array())\n    {\n      if (!function_exists('exif_imagetype')) {\n        $this->error = 'Function \\'exif_imagetype\\' Not found. Please enable \\'php_exif\\' in your php.ini';\n      }\n\n      $this->_files = $_files;\n    }\n"})}),"\n",(0,t.jsxs)(n.p,{children:["The construct only reads ",(0,t.jsx)(n.code,{children:"$_FILES"})," and set it to the variable, ",(0,t.jsx)(n.code,{children:"name"})," cannot be abused."]}),"\n",(0,t.jsxs)(n.p,{children:["Looks like the service is using ",(0,t.jsx)(n.code,{children:"imagemagick"})," to do the shrinking, we have the binary, so we can extract the version from an x64_86 computer (same arch as the binary):"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"./magick --version\n7.1.0-49\n"})}),"\n",(0,t.jsxs)(n.p,{children:["If we search for vulnerabilities for that library, we'll find something interesting: ",(0,t.jsx)(n.a,{href:"https://www.uptycs.com/blog/denial-of-servicedos-and-arbitrary-file-read-vulnerability-in-imagemagick",children:"https://www.uptycs.com/blog/denial-of-servicedos-and-arbitrary-file-read-vulnerability-in-imagemagick"}),"."]}),"\n",(0,t.jsxs)(n.p,{children:["There's a very nice explanation on how to exploit this vulnerability. After exploiting this we can read the /etc/passwd and identify a user named ",(0,t.jsx)(n.code,{children:"emily"}),"."]}),"\n",(0,t.jsx)(n.p,{children:"Tried to search for some flags inside the home with no luck. Tried to get SSH keys without any luck."}),"\n",(0,t.jsx)(n.p,{children:"Going back to the source code, we see that there's a dashboard querying a database, we can try to download that database"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"Decoded hex string: b'SQLite format 3\\x00\\x10\\x00\\x01\\x01\\x00@  \\x\n"})}),"\n",(0,t.jsx)(n.p,{children:"Looks like we got it, we'll need to tweak the format a bit."}),"\n",(0,t.jsxs)(n.p,{children:["We need to pass the hex bytes to actual bytes and we'll retrieve the whole sqlite database where there's a table with username-password and the password for ",(0,t.jsx)(n.code,{children:"emily"})," is there, later we can connect with SSH and we're in as ",(0,t.jsx)(n.code,{children:"emily"}),". Now we can read the user flag."]}),"\n",(0,t.jsx)(n.h2,{id:"privilege-escalation",children:"Privilege escalation"}),"\n",(0,t.jsxs)(n.p,{children:["For privilege escalation, looks like the user emily can execute the ",(0,t.jsx)(n.code,{children:"magick"})," command which belongs to ",(0,t.jsx)(n.code,{children:"root"}),":"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:'emily@pilgrimage:/var/www/pilgrimage.htb$ ls -lisa |grep "magick"\n43806 26912 -rwxr-xr-x 1 root root 27555008 Feb 15  2023 magick\n'})}),"\n",(0,t.jsx)(n.p,{children:"Analyzing the processes, we see an interesting script executed as root:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:'#!/bin/bash\n\nblacklist=("Executable script" "Microsoft executable")\n\n/usr/bin/inotifywait -m -e create /var/www/pilgrimage.htb/shrunk/ | while read FILE; do\n        filename="/var/www/pilgrimage.htb/shrunk/$(/usr/bin/echo "$FILE" | /usr/bin/tail -n 1 | /usr/bin/sed -n -e \'s/^.*CREATE //p\')"\n        binout="$(/usr/local/bin/binwalk -e "$filename")"\n        for banned in "${blacklist[@]}"; do\n                if [[ "$binout" == *"$banned"* ]]; then\n                        /usr/bin/rm "$filename"\n                        break\n                fi\n        done\ndone\n'})}),"\n",(0,t.jsx)(n.p,{children:"Looks like this is performing some kind of scan of the files uploaded and uses the binwalk python module which analyse the uploaded file:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"emily@pilgrimage:~$ binwalk -e /var/www/pilgrimage.htb/shrunk/6516e94e5aa54.png\n\nDECIMAL       HEXADECIMAL     DESCRIPTION\n--------------------------------------------------------------------------------\n0             0x0             PNG image, 7 x 7, 8-bit colormap, non-interlaced\n"})}),"\n",(0,t.jsxs)(n.p,{children:["The binary is just a convenient alias to the ",(0,t.jsx)(n.code,{children:"binwalk"})," python library."]}),"\n",(0,t.jsx)(n.p,{children:"This looks promising..."}),"\n",(0,t.jsx)(n.p,{children:"From the very same github page of the project, there's a security warning:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"Prior to Binwalk v2.3.3, extracted archives could create symlinks which point anywhere on the file system, potentially resulting in a directory traversal attack if subsequent extraction utilties blindly follow these symlinks. More generically, Binwalk makes use of many third-party extraction utilties which may have unpatched security issues; Binwalk v2.3.3 and later allows external extraction tools to be run as an unprivileged user using the run-as command line option (this requires Binwalk itself to be run with root privileges). Additionally, Binwalk v2.3.3 and later will refuse to perform extraction as root unless --run-as=root is specified.\n"})}),"\n",(0,t.jsx)(n.p,{children:"Here we are dealing with binwalk v2.3.2, so it contains this vulnerability."}),"\n",(0,t.jsx)(n.p,{children:"More details about the vulnerability:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"https://onekey.com/blog/security-advisory-remote-command-execution-in-binwalk/",children:"https://onekey.com/blog/security-advisory-remote-command-execution-in-binwalk/"})}),"\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"https://github.com/electr0sm0g/CVE-2022-4510",children:"https://github.com/electr0sm0g/CVE-2022-4510"})}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"The idea is to generate the payload to open a connection and upload it via SCP with the emily user. If we upload it via the web it will not open the connection since the image generated by convert, will not have the malicious payload to abuse binwalk."})]})}function d(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(h,{...e})}):h(e)}},8453:(e,n,i)=>{i.d(n,{R:()=>s,x:()=>o});var t=i(6540);const a={},r=t.createContext(a);function s(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:s(e.components),t.createElement(r.Provider,{value:n},e.children)}}}]);