---
title: Parse huge local json file
tags: [frontend,react,json,oboejs]
slug: parse-huge-local-json-file
---
I need to provide a UI to analyse the results of a long-running process that generates huge JSON file whose size is in GB order.

In the article I will talk about the solution implemented using the HTML5 FileReader API and the mighty <a href="#using-oboe-js">oboe.js</a> library

<!--truncate-->
Thanks to <a href="https://www.html5rocks.com/en/tutorials/file/dndfiles/">HTML5 FileReader API</a> , files can be read locally in the browser without any need for servers. Even better, files can be read in <a href="https://gist.github.com/alediaferia/cfb3a7503039f9278381">chunks</a> in order to keep the memory footprint as low as desired.

If you search in Google about how to parse huge JSON files, eventually the streaming techniques will appear. In the XML world there are two different techniques for parsing files:
<ul>
<li>SAX: Read the XML as events, keeping a little memory footprint</li>
<li>DOM: Read the whole XML in memory allowing easy manipulation</li>
</ul>

Working with JSON the DOM technique is the most used. For instance "JSON.parse" loads the whole string in memory before parsing the JSON. What will happen if the string is really big? The browser will explode.
We need to apply the SAX loading technique to read the big JSON file. 

In order to achieve that we can use <a href="http://oboejs.com/">Oboejs</a> library:
<blockquote>Oboe.js is an <a href="http://oboejs.com/LICENCE">open source</a> Javascript library for loading JSON using streaming, combining the convenience of DOM with the speed and fluidity of SAX.</blockquote>

## Using oboe.js

Reading the documentation it is not clear if one can use the FileReader API with oboe-js. It clearly says you can pass an URL or a NodeJs stream to its initializer method:

```javascript
oboe( String url )

oboe({
    url: String,
    method: String,
    headers: Object,
    body: String|Object,
    cached: Boolean,
    withCredentials: Boolean
})

oboe(stream)
```

Searching over the internet I have found this Github <a href="https://github.com/jimhigson/oboe.js/issues/112">issue</a> where it's author is asking for some solution to not using an URL nor NodeJs stream.
So, finally there's a way to combine the power of the FileReader API and the streaming capabilities of oboejs

## The code

Since the UI we are building is built in React, I have made this project as a plug-and-play React component:
<a href="https://github.com/adriangalera/parse-huge-json">https://github.com/adriangalera/parse-huge-json</a>
P.S: The plug-and-play worked like a charm!
&nbsp;
