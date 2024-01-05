"use strict";(self.webpackChunkhacking=self.webpackChunkhacking||[]).push([[762],{4813:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>c,contentTitle:()=>r,default:()=>u,frontMatter:()=>o,metadata:()=>a,toc:()=>d});var t=i(5893),s=i(1151);const o={slug:"/tooling/redis",pagination_next:null,pagination_prev:null},r=void 0,a={id:"Tooling/redis",title:"redis",description:"Redis is an in-memory key-value (NoSQL) database running on 6379 port by default",source:"@site/docs/Tooling/redis.md",sourceDirName:"Tooling",slug:"/tooling/redis",permalink:"/hacking/tooling/redis",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{slug:"/tooling/redis",pagination_next:null,pagination_prev:null},sidebar:"tutorialSidebar"},c={},d=[];function l(e){const n={code:"code",p:"p",pre:"pre",...(0,s.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:"Redis is an in-memory key-value (NoSQL) database running on 6379 port by default"}),"\n",(0,t.jsxs)(n.p,{children:["To connect to the database, we must use ",(0,t.jsx)(n.code,{children:"redis-cli"}),":"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"redis-cli -h <ip>\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Once inside we can retrieve more information by using the ",(0,t.jsx)(n.code,{children:"info"})," command:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"<ip>:6379> info\n# Server\nredis_version:5.0.7\nredis_git_sha1:00000000\nredis_git_dirty:0\nredis_build_id:66bd629f924ac924\nredis_mode:standalone\nos:Linux 5.4.0-77-generic x86_64\narch_bits:64\n"})}),"\n",(0,t.jsxs)(n.p,{children:["To enumerate the database with some entries, we can use the ",(0,t.jsx)(n.code,{children:"info keyspace"})," command. This information is present in the ",(0,t.jsx)(n.code,{children:"info"})," response as well."]}),"\n",(0,t.jsxs)(n.p,{children:["To retrieve all the keys in a given database, we can use the ",(0,t.jsx)(n.code,{children:"keys *"})," command once we have selected the database. To access a particular key, we use the ",(0,t.jsx)(n.code,{children:"get"})," command:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:'redis-cli -h <ip>\n<ip>:6379> select 0\nOK\n<ip>:6379> keys *\n1) "numb"\n2) "temp"\n3) "flag"\n4) "stor"\n<ip>:6379> keys flag\n1) "flag"\n<ip>:6379> get flag\n"flag"\n'})})]})}function u(e={}){const{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(l,{...e})}):l(e)}},1151:(e,n,i)=>{i.d(n,{Z:()=>a,a:()=>r});var t=i(7294);const s={},o=t.createContext(s);function r(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),t.createElement(o.Provider,{value:n},e.children)}}}]);