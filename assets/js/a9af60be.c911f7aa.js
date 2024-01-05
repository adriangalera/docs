"use strict";(self.webpackChunkhacking=self.webpackChunkhacking||[]).push([[319],{8213:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>a,default:()=>p,frontMatter:()=>s,metadata:()=>i,toc:()=>h});var o=t(5893),r=t(1151);const s={slug:"/tooling/john-the-ripper",pagination_next:null,pagination_prev:null},a=void 0,i={id:"Tooling/johntheripper",title:"johntheripper",description:"https://github.com/openwall/john",source:"@site/docs/Tooling/johntheripper.md",sourceDirName:"Tooling",slug:"/tooling/john-the-ripper",permalink:"/hacking/tooling/john-the-ripper",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{slug:"/tooling/john-the-ripper",pagination_next:null,pagination_prev:null},sidebar:"tutorialSidebar"},c={},h=[];function l(e){const n={a:"a",code:"code",p:"p",pre:"pre",...(0,r.a)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.p,{children:(0,o.jsx)(n.a,{href:"https://github.com/openwall/john",children:"https://github.com/openwall/john"})}),"\n",(0,o.jsxs)(n.p,{children:["Password cracking tool. It does not do anything magic, it just compares a hash file with a list of words (dictionary). It has a quite decent default dictionary, however, you can search for more complete dictionaries such as the ",(0,o.jsx)(n.a,{href:"https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwi5noL2vP77AhXLXqQEHYafALkQFnoECA0QAQ&url=https%3A%2F%2Fgithub.com%2Fbrannondorsey%2Fnaive-hashcat%2Freleases%2Fdownload%2Fdata%2Frockyou.txt&usg=AOvVaw3snAERl1mU6Ccr4WFEazBd",children:"rock-you.txt"})]}),"\n",(0,o.jsx)(n.p,{children:"Make sure to install a version >= 1.9.0, which enables support for many hash formats. In my case for 1.8.0 version I couldn't crack a NTLMv2 hash."}),"\n",(0,o.jsxs)(n.p,{children:["You can also use ",(0,o.jsx)(n.code,{children:"zip2john"})," tool to brute-force zip files with passwords."]}),"\n",(0,o.jsx)(n.p,{children:"You can specify the format as well:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"john --format=raw-md5 passwd.txt\n"})}),"\n",(0,o.jsxs)(n.p,{children:["You can determine the type of hash by running ",(0,o.jsx)(n.code,{children:"hashid"})," and then check with:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"john --list=formats\n"})})]})}function p(e={}){const{wrapper:n}={...(0,r.a)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(l,{...e})}):l(e)}},1151:(e,n,t)=>{t.d(n,{Z:()=>i,a:()=>a});var o=t(7294);const r={},s=o.createContext(r);function a(e){const n=o.useContext(s);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),o.createElement(s.Provider,{value:n},e.children)}}}]);