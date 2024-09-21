"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[9207],{7194:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>r,default:()=>h,frontMatter:()=>i,metadata:()=>o,toc:()=>l});var s=t(4848),a=t(8453);const i={slug:"/languages/bash",pagination_next:null,pagination_prev:null},r=void 0,o={id:"Hacking/Language security/Bash",title:"Bash",description:"This article explain some security issues found in Bash scripts.",source:"@site/docs/Hacking/Language security/Bash.md",sourceDirName:"Hacking/Language security",slug:"/languages/bash",permalink:"/docs/languages/bash",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{slug:"/languages/bash",pagination_next:null,pagination_prev:null},sidebar:"tutorialSidebar"},c={},l=[{value:"Pattern matching comparison",id:"pattern-matching-comparison",level:2}];function u(e){const n={code:"code",h2:"h2",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:"This article explain some security issues found in Bash scripts."}),"\n",(0,s.jsx)(n.h2,{id:"pattern-matching-comparison",children:"Pattern matching comparison"}),"\n",(0,s.jsx)(n.p,{children:"This comparisson is making a pattern matching instead of a string equality comparisson."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"if [[ $DB_PASS == $USER_PASS ]]; then\n"})}),"\n",(0,s.jsxs)(n.p,{children:["This leads to the issue that the user does not need to know the value of ",(0,s.jsx)(n.code,{children:"DB_PASS"})," to go through this if. If ",(0,s.jsx)(n.code,{children:"USER_PASS"})," is ",(0,s.jsx)(n.code,{children:"*"}),", the if will evaluate to true. This leads to a even worse situation, we can brute force the value of the variable by adding characters to the variable, e.g:"]}),"\n",(0,s.jsx)(n.p,{children:"a* -> Password succed -> First char is a, let's try next char ...\nab* -> Password succeed -> We know the password is ab, etc..."}),"\n",(0,s.jsx)(n.p,{children:"And repeat this process until all chars are revealed."})]})}function h(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(u,{...e})}):u(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>r,x:()=>o});var s=t(6540);const a={},i=s.createContext(a);function r(e){const n=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:r(e.components),s.createElement(i.Provider,{value:n},e.children)}}}]);