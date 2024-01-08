"use strict";(self.webpackChunkhacking=self.webpackChunkhacking||[]).push([[174],{8695:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>t,default:()=>p,frontMatter:()=>o,metadata:()=>l,toc:()=>r});var i=s(5893),a=s(1151);const o={slug:"/tooling/nmap",pagination_next:null,pagination_prev:null},t=void 0,l={id:"Hacking/Tooling/nmap",title:"nmap",description:"nmap is a port scanner tool. By default it scan ports from 0-1000.",source:"@site/docs/Hacking/Tooling/nmap.md",sourceDirName:"Hacking/Tooling",slug:"/tooling/nmap",permalink:"/docs/tooling/nmap",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{slug:"/tooling/nmap",pagination_next:null,pagination_prev:null},sidebar:"tutorialSidebar"},c={},r=[{value:"Scan all",id:"scan-all",level:2},{value:"Service version detection",id:"service-version-detection",level:2},{value:"Scan all ports",id:"scan-all-ports",level:2},{value:"Firewall evasion",id:"firewall-evasion",level:2},{value:"Disable DNS resolution",id:"disable-dns-resolution",level:2}];function d(e){const n={code:"code",h2:"h2",p:"p",pre:"pre",...(0,a.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.p,{children:"nmap is a port scanner tool. By default it scan ports from 0-1000."}),"\n",(0,i.jsx)(n.h2,{id:"scan-all",children:"Scan all"}),"\n",(0,i.jsxs)(n.p,{children:["You can pass the ",(0,i.jsx)(n.code,{children:"-A"})," flag which enables OS detection, version detection, script scanning, and traceroute, however that is very easy to detect by an IDS/IPS system."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"nmap -A <ip>\n"})}),"\n",(0,i.jsx)(n.h2,{id:"service-version-detection",children:"Service version detection"}),"\n",(0,i.jsx)(n.p,{children:"To enable only service version detection:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"nmap -sV <ip>\n"})}),"\n",(0,i.jsx)(n.p,{children:"-sV flag does scanning and prints service and version on the found open port"}),"\n",(0,i.jsxs)(n.p,{children:["To specify the default set of scripts for version identification use ",(0,i.jsx)(n.code,{children:"-sC"})]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"nmap -sC <ip>\n"})}),"\n",(0,i.jsx)(n.h2,{id:"scan-all-ports",children:"Scan all ports"}),"\n",(0,i.jsx)(n.p,{children:"To scan all the ports, we need to specify this flags:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"namp -p- <ip>\n"})}),"\n",(0,i.jsx)(n.p,{children:"Take into account that this operation will take a long time to complete."}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"--min-rate"})," speeds up the process by sending packets not slower than X messages per second."]}),"\n",(0,i.jsx)(n.h2,{id:"firewall-evasion",children:"Firewall evasion"}),"\n",(0,i.jsxs)(n.p,{children:["If nmap reports he has issues because could not determine if port open or closed. The machine might be protected by a firewall, instead of performing a TCP SYN scan, you can use a TCP FIN scan by providing the flag ",(0,i.jsx)(n.code,{children:"-sF"})]}),"\n",(0,i.jsxs)(n.p,{children:["You can disable ping scan (blocked by firewalls) by disabling host discovery: ",(0,i.jsx)(n.code,{children:"-Pn"}),"."]}),"\n",(0,i.jsx)(n.h2,{id:"disable-dns-resolution",children:"Disable DNS resolution"}),"\n",(0,i.jsxs)(n.p,{children:["You can disable DNS resolution with ",(0,i.jsx)(n.code,{children:"-n"})]})]})}function p(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},1151:(e,n,s)=>{s.d(n,{Z:()=>l,a:()=>t});var i=s(7294);const a={},o=i.createContext(a);function t(e){const n=i.useContext(o);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:t(e.components),i.createElement(o.Provider,{value:n},e.children)}}}]);