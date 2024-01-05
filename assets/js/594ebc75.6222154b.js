"use strict";(self.webpackChunkhacking=self.webpackChunkhacking||[]).push([[976],{7634:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>i,contentTitle:()=>o,default:()=>p,frontMatter:()=>a,metadata:()=>c,toc:()=>l});var t=r(5893),s=r(1151);const a={slug:"/tooling/crackmapexec",pagination_next:null,pagination_prev:null},o=void 0,c={id:"Tooling/crackmapexec",title:"crackmapexec",description:"Tool for network pentesting",source:"@site/docs/Tooling/crackmapexec.md",sourceDirName:"Tooling",slug:"/tooling/crackmapexec",permalink:"/hacking/tooling/crackmapexec",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{slug:"/tooling/crackmapexec",pagination_next:null,pagination_prev:null},sidebar:"tutorialSidebar"},i={},l=[{value:"Brute-force Sambda users",id:"brute-force-sambda-users",level:2},{value:"Password spraying",id:"password-spraying",level:2}];function u(e){const n={code:"code",h2:"h2",p:"p",pre:"pre",...(0,s.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:"Tool for network pentesting"}),"\n",(0,t.jsx)(n.h2,{id:"brute-force-sambda-users",children:"Brute-force Sambda users"}),"\n",(0,t.jsx)(n.p,{children:"Will try to determine the users of a system by trying with different `rid``"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:'crackmapexec smb 10.10.11.236 -u anonymous -p "" --rid-brute 10000\n'})}),"\n",(0,t.jsx)(n.h2,{id:"password-spraying",children:"Password spraying"}),"\n",(0,t.jsx)(n.p,{children:"It will try to combine the values in the provided files to see if it returns a valid login attempt"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"crackmapexec smb 10.10.11.236 -u exfil/users -p exfil/users\n"})})]})}function p(e={}){const{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(u,{...e})}):u(e)}},1151:(e,n,r)=>{r.d(n,{Z:()=>c,a:()=>o});var t=r(7294);const s={},a=t.createContext(s);function o(e){const n=t.useContext(a);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),t.createElement(a.Provider,{value:n},e.children)}}}]);