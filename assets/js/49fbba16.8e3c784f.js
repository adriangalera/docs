"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[8764],{9218:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>s,default:()=>d,frontMatter:()=>i,metadata:()=>a,toc:()=>l});var o=t(4848),r=t(8453);const i={slug:"/tooling/evilwinrm",pagination_next:null,pagination_prev:null},s="evil-winrm",a={id:"Hacking/Tooling/evil-winrm",title:"evil-winrm",description:"Once you know the user/password of a Windows target, you can use https://github.com/Hackplayers/evil-winrm to connect to the Powershell. Consider this tool as the PowerShell for Linux.",source:"@site/docs/Hacking/Tooling/evil-winrm.md",sourceDirName:"Hacking/Tooling",slug:"/tooling/evilwinrm",permalink:"/docs/tooling/evilwinrm",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{slug:"/tooling/evilwinrm",pagination_next:null,pagination_prev:null},sidebar:"tutorialSidebar"},c={},l=[];function u(e){const n={a:"a",code:"code",h1:"h1",header:"header",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.header,{children:(0,o.jsx)(n.h1,{id:"evil-winrm",children:"evil-winrm"})}),"\n",(0,o.jsxs)(n.p,{children:["Once you know the user/password of a Windows target, you can use ",(0,o.jsx)(n.a,{href:"https://github.com/Hackplayers/evil-winrm",children:"https://github.com/Hackplayers/evil-winrm"})," to connect to the Powershell. Consider this tool as the PowerShell for Linux."]}),"\n",(0,o.jsx)(n.p,{children:"The usage is quite easy:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:"evil-winrm -i 10.129.67.87 -u Administrator -p <password>\n"})}),"\n",(0,o.jsx)(n.p,{children:"If you see some SSL error while connecting to the target make sure to enable support for legacy md4 hash:"}),"\n",(0,o.jsxs)(n.p,{children:["Make sure the file ",(0,o.jsx)(n.code,{children:"/etc/ssl/openssl.cnf"})," contains the following:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"[provider_sect]\ndefault = default_sect\nlegacy = legacy_sect\n\n[default_sect]\nactivate = 1\n\n[legacy_sect]\nactivate = 1\n"})}),"\n",(0,o.jsx)(n.p,{children:"If you see the following error, it means the user is not authorized to use WinRM. It does not mean the user/password are incorrect."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"Error: An error of type WinRM::WinRMAuthorizationError happened, message is WinRM::WinRMAuthorizationError\n"})})]})}function d(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(u,{...e})}):u(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>s,x:()=>a});var o=t(6540);const r={},i=o.createContext(r);function s(e){const n=o.useContext(i);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),o.createElement(i.Provider,{value:n},e.children)}}}]);