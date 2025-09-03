# Web fuzzing

Web fuzzing is a critical technique in web application security to identify vulnerabilities by testing various inputs

Fuzzing casts a wider net. It involves feeding the web application with unexpected inputs, including malformed data, invalid characters, and nonsensical combinations. Brute-forcing, on the other hand, is a more targeted approach. It focuses on systematically trying out many possibilities for a specific value, such as a password or an ID number.

Let's define some concepts first:

- Wordlist: A dictionary or list of words, phrases, file names, directory names, or parameter values used as input during fuzzing.	
- Payload: The actual data sent to the web application during fuzzing. Can be a simple string, numerical value, or complex data structure.
- Response analysis: Examining the web application's responses (e.g., response codes, error messages) to the fuzzer's payloads to identify anomalies that might indicate vulnerabilities.
- Fuzzer: A software tool that automates generating and sending payloads to a web application and analyzing the responses.
- False positive: result incorrectly labeled as vulnerability.
- False negative: A vulnerability that exists in the web application but is not detected by the fuzzer.	
- Fuzzing Scope: the part of the application under the fuzzing effort.

Some tools:

- FFUF (Fuzz Faster U Fool). Use cases:
  - Directory and File Enumeration
  - Parameter Discovery	
  - Brute-Force Attack	
- Gobuster. Use cases:
  - Content Discovery
  - DNS Subdomain enumeration
  - Wordpress content detection
- FeroxBuster. Designed for brute-force discovery of unlinked content in web applications, making it particularly useful for identifying hidden directories and files. It's more of a "forced browsing" tool than a fuzzer like ffuf. Use cases:
  - Recursive Scanning
  - Unlinked Content Discovery
  - High-Performance Scans
- wfuzz/wenum. Use cases:
  - Directory and File Enumeration
  - Parameter Discovery
  - Brute-Force Attack

## Fuzzing files and directories

You can use a wordlist and try to make requests to the server and see if some is positive (200 OK) or any other desired state. The key here is to find a related wordlist.

See some examples:

```bash
ffuf -ic -w /opt/github/SecLists/Discovery/Web-Content/DirBuster-2007_directory-list-lowercase-2.3-small.txt:FUFF -u "http://94.237.59.213:58567/FUFF"
```
The `FUFF` keyword is where the word from the word list will be injected.

If you want to use `-e` flag to setup the extension, you don't need to place the `FUFF` in the word list, e.g:

```bash
ffuf -c -ic -w /opt/github/SecLists/Discovery/Web-Content/common.txt -u "http://94.237.59.213:58567/webfuzzing_hidden_path/flag/FUZZ" -e .html
```

## Fuzzing recursively

What if our target has a complex structure with multiple nested directories? Manually fuzzing each level would be tedious and time-consuming. This is where recursive fuzzing comes in handy. 

Recursive fuzzing consist in 3 steps:
1) Initial fuzzing: same as we've seen so far.
2) For each discovered directory, the fuzzer adds the discovered URL to the queue.
3) Iterative depth: the processes is repeated for each directory until a specified depth has been scanned.

`fuff` example:

```bash
ffuf -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -ic -v -u http://IP:PORT/FUZZ -e .html -recursion 
```

When fuzzing recursively, it is wise to set up some limits:

- `-recursion-depth`: This flag allows you to set a maximum depth for recursive exploration. For example, -recursion-depth 2 limits fuzzing to two levels deep (the starting directory and its immediate subdirectories).

- `-rate`: You can control the rate at which ffuf sends requests per second, preventing the server from being overloaded.

- `-timeout`: This option sets the timeout for individual requests, helping to prevent the fuzzer from hanging on unresponsive targets.

e.g:

```bash
ffuf -c -ic -w /opt/github/SecLists/Discovery/Web-Content/DirBuster-2007_directory-list-2.3-small.txt:FUZZ -u "http://94.237.59.213:45870/recursive_fuzz/FUZZ" -recursion -recursion-depth 4
```

## Parameter and value fuzzing

This technique focuses on manipulating the parameters and their values within web requests to uncover vulnerabilities in how the application processes input.

Parameters are the gateways through which you can interact with a web application. By manipulating their values, you can test how the application responds to different inputs, potentially uncovering vulnerabilities. For instance:

- Altering a product ID in a shopping cart URL could reveal pricing errors or unauthorized access to other users' orders.
- Modifying a hidden parameter in a request might unlock hidden features or administrative functions.
- Injecting malicious code into a search query could expose vulnerabilities like Cross-Site Scripting (XSS) or SQL Injection (SQLi).

We can fuzz the existence of the parameter itself and the value of the parameters. For example, we make a request with curl:

```bash
adriangalera@htb[/htb]$ curl http://IP:PORT/get.php

Invalid parameter value
x:
```

We have discovered that this application need a parameter `x`. If we set it manually to 1:
```bash
adriangalera@htb[/htb]$ curl http://IP:PORT/get.php?x=1

Invalid parameter value
x: 1
```

Now, we can use `wenum` to discover the correct values:

```bash
wenum -w /usr/share/seclists/Discovery/Web-Content/common.txt --hc 404 -u "http://IP:PORT/get.php?x=FUZZ"
```

The same technique can be applied to POST requests:

```bash
curl -d "" http://IP:PORT/post.php

Invalid parameter value
y: 
```
And we can fuzz the valid values with `fuff`:

```bash
ffuf -u http://IP:PORT/post.php -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "y=FUZZ" -w /usr/share/seclists/Discovery/Web-Content/common.txt -mc 200 -v
```

For the exercise, we can get the correct GET parameter value calling:

```bash
ffuf -ic -w /opt/github/SecLists/Discovery/Web-Content/big.txt:FUZZ -u "http://94.237.54.192:53037/get.php?x=FUZZ"
```
and POST calling:

```bash
ffuf -u http://94.237.54.192:53037/post.php -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "y=FUZZ" -w /opt/github/SecLists/Discovery/Web-Content/common.txt:FUZZ  -mc 200 -v
```

## Fuzzing virtual host and subdomains.

Virtual hosting enables multiple websites or domains to be served from a single server or IP address. Each vhost is associated with a unique domain name or hostname. When a client sends an HTTP request, the web server examines the Host header to determine which vhost's content to deliver.

Subdomains, on the other hand, are extensions of a primary domain name, creating a hierarchical structure within the domain. They are used to organize different sections or services within a website. For example, blog.example.com and shop.example.com are subdomains of the main domain example.com. Unlike vhosts, subdomains are resolved to specific IP addresses through DNS (Domain Name System) records.

We can use `gobuster` to perform vhost fuzzing:

```bash
gobuster vhost -u http://inlanefreight.htb:81 -w /usr/share/seclists/Discovery/Web-Content/common.txt --append-domain
```

`--append-domain`: This crucial flag instructs Gobuster to append the base domain (inlanefreight.htb) to each word in the wordlist. This ensures that the Host header in each request includes a complete domain name (e.g., admin.inlanefreight.htb), which is essential for vhost discovery.

To perform sub-domain fuzzing is very similar, but you need to change the mode of `gobuster`:

```bash
gobuster dns -do inlanefreight.com -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt
```

Under the hood, Gobuster works by generating subdomain names based on the wordlist, appending them to the target domain, and then attempting to resolve those subdomains using DNS queries. If a subdomain resolves to an IP address, it is considered valid and included in the output.

## Filtering results

Most of the fuzzing attemps will lead to nowhere and we'll need to filter out that noise. Each tool has its own filter mechanism.

The idea is that you can filter by:

- Response HTTP status code
- Response content length
- Response line counts
- Response word counts
- Response time (TTFB)

## Validate your findings

Once you found out a file, a directory, a vhost, etc... The fact that you found it, it doesn't matter it's a vulnerability automatically.

For example, if you suspect a SQL injection vulnerability, you could craft a harmless SQL query that returns the SQL server version string rather than trying to extract or modify sensitive data.

Or you can use `curl` to verify the request of the response, see if there's data and what kind of data will come in the answer.

## Fuzzing Web APIs

Essentially, a Web API serves as a bridge between a server (hosting the data and functionality) and a client (such as a web browser, mobile app, or another server) that wants to access or utilize that data or functionality.

### Representational State Transfer (REST)

REST APIs utilize standard HTTP methods (GET, POST, PUT, DELETE) to perform CRUD (Create, Read, Update, Delete) operations on resources identified by unique URLs. They typically exchange data in lightweight formats like JSON or XML, making them easy to integrate with various applications and platforms.

GET /users/123

### Simple Object Access Protocol (SOAP)

SOAP APIs follow a more formal and standardized protocol for exchanging structured information. They use XML to define messages, which are then encapsulated in SOAP envelopes and transmitted over network protocols like HTTP.

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:GetStockPrice>
         <tem:StockName>AAPL</tem:StockName>
      </tem:GetStockPrice>
   </soapenv:Body>
</soapenv:Envelope>
```

### GraphQL

GraphQL provides a single endpoint where clients can request the data they need using a flexible query language.

The query language is very flexible and allow to query for the exact data we're interested:

```graphql
query {
  user(id: 123) {
    name
    email
    posts(limit: 5) {
      title
      body
    }
  }
}
```

We can also modify data, not only query it:

```graphql
mutation {
  createPost(title: "New Post", body: "This is the content of the new post") {
    id
    title
  }
}
```


## Identifying endpoints

You must know where to look before you can start fuzzing Web APIs. Identifying the endpoints that the API exposes is the first crucial step in this process

In REST APIs, the endpoints can look like this:

- /users - Represents a collection of user resources.
- /users/123 - Represents a specific user with the ID 123.
- /products - Represents a collection of product resources.
- /products/456 - Represents a specific product with the ID 456.

And accept a series of parameters:

- Query parameters: `/users?limit=10&sort=name`
- Path parameters: `/products/{id}pen_spark`
- Request body parameters: `{ "name": "New Product", "price": 99.99 }`

To discover the endpoints and their parameters you can:

- Search for the official documentations: swagger, openAPI.
- Network Traffic Analysis: Burp Suite or Developer tools
- Parameter name fuzzing: the same technique we have seen before.

For SOAP, it's a bit different. They rely on XML-based messages and Web Services Description Language (WSDL) files to define their interfaces and operations. They expose a single endpoint which is a URL where the SOAP server listens for incoming requests. The content of the SOAP message itself determines the specific operation you want to perform.

Every operation in the API is defined in the Web Services Description Language (WSDL) file, an XML-based document that describes the web service's interface, operations, and message formats.

So, to identify the endpoints:

1. Check the WSDL file
2. Network analysis: Burp or Developer tools
3. Parameter fuzzing

In GraphQL, APIs typically have a single endpoint. This endpoint is usually a URL like /graphql and serves as the entry point for all queries and mutations sent to the API.

To do the discovery of the internals of the API, you can use:

- Introspection: GraphQL's introspection system is a powerful tool for discovery. By sending an introspection query to the GraphQL endpoint, you can retrieve a complete schema describing the API's capabilities. This includes available types, fields, queries, mutations, and arguments. Tools and IDEs can leverage this information to offer auto-completion, validation, and documentation for your GraphQL queries.
- API documentation: Well-documented GraphQL APIs provide comprehensive guides and references alongside introspection. These typically explain the purpose and usage of different queries and mutations, offer examples of valid structures, and detail input arguments and response formats. Tools like GraphiQL or GraphQL Playground, often bundled with GraphQL servers, provide an interactive environment for exploring the schema and experimenting with queries.
- Network traffic analysis: same as REST and SOAP.

## API Fuzzing

When it comes to API Fuzzing, there are primary types:

- Parameter Fuzzing

 One of the primary techniques in API fuzzing, parameter fuzzing focuses on systematically testing different values for API parameters. This includes query parameters (appended to the API endpoint URL), headers (containing metadata about the request), and request bodies (carrying the data payload).

- Data format Fuzzing

 Web APIs frequently exchange data in structured formats like JSON or XML. Data format fuzzing specifically targets these formats by manipulating the structure, content, or encoding of the data. This can reveal vulnerabilities related to parsing errors, buffer overflows, or improper handling of special characters.

- Sequence Fuzzing

APIs often involve multiple interconnected endpoints, where the order and timing of requests are crucial. Sequence fuzzing examines how an API responds to sequences of requests, uncovering vulnerabilities like race conditions, insecure direct object references (IDOR), or authorization bypasses. By manipulating the order, timing, or parameters of API calls, fuzzers can expose weaknesses in the API's logic and state management.

We can use https://github.com/PandaSt0rm/webfuzz_api to perform API fuzzing:

```bash
python3 api_fuzzer.py http://IP:PORT

[-] Invalid endpoint: http://localhost:8000/~webmaster (Status code: 404)
[-] Invalid endpoint: http://localhost:8000/~www (Status code: 404)

Fuzzing completed.
Total requests: 4730
Failed requests: 0
Retries: 0
Status code counts:
404: 4727
200: 2
405: 1
Found valid endpoints:
- http://localhost:8000/cz...
- http://localhost:8000/docs
Unusual status codes:
405: http://localhost:8000/items
```

The fuzzer identifies numerous invalid endpoints (returning 404 Not Found errors).
Two valid endpoints are discovered:
- /cz...: This is an undocumented endpoint as it doesn't appear in the API documentation.
- /docs: This is the documented Swagger UI endpoint.

The 405 Method Not Allowed response for /items suggests that an incorrect HTTP method was used to access this endpoint (e.g., trying a GET request instead of a POST).