"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[9407],{6378:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>a,contentTitle:()=>i,default:()=>p,frontMatter:()=>s,metadata:()=>c,toc:()=>d});var o=t(4848),r=t(8453);const s={slug:"/tooling/responder",pagination_next:null,pagination_prev:null},i=void 0,c={id:"Hacking/Tooling/responder",title:"responder",description:"https://github.com/lgandx/Responder",source:"@site/docs/Hacking/Tooling/responder.md",sourceDirName:"Hacking/Tooling",slug:"/tooling/responder",permalink:"/docs/tooling/responder",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{slug:"/tooling/responder",pagination_next:null,pagination_prev:null},sidebar:"tutorialSidebar"},a={},d=[];function l(e){const n={a:"a",code:"code",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.p,{children:(0,o.jsx)(n.a,{href:"https://github.com/lgandx/Responder",children:"https://github.com/lgandx/Responder"})}),"\n",(0,o.jsxs)(n.p,{children:["For getting NTLM password, responder tool will setup a rogue SMB server that will capture the challenge initiated by another machine in the network and store the hash of the challenge. Later you can use ",(0,o.jsx)(n.code,{children:"hashcat"})," or ",(0,o.jsx)(n.code,{children:"john"})," to try to go from hash to password."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"sudo responder -I tun0\n"})})]})}function p(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(l,{...e})}):l(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>i,x:()=>c});var o=t(6540);const r={},s=o.createContext(r);function i(e){const n=o.useContext(s);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),o.createElement(s.Provider,{value:n},e.children)}}}]);