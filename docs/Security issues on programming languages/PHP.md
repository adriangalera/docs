---
slug: /php-security
pagination_next: null
pagination_prev: null
---
This article explain some security issues found in PHP.

## Type juggling

Due to the nature of PHP we can abuse the type jungling feature. When comparing variables of different types, PHP will convert them to a common, comparable type.

The following condition will be true and print the message.
```php
$example_int = 7
$example_str = "7"
if ($example_int == $example_str) {
   echo("PHP can compare ints and strings.")
}
```
An if with `==` will not check the types. Only `===` check the types.

If the string to be compared does not contain an integer, it will be converted to 0, e.g:
```
("Puppies" == 0) -> True
```

So, if you see some compraison with PHP is worth trying to exploit this vulnerability

Applying this to the security world, we can bypass auth by using this loose comparison:

```php
if ($_POST["password"] == "Admin_Password") {login_as_admin();}
```
Then, to bypass the auth the user only need to provide `0` integer as input:

```
(0 == “Admin_Password”) -> True
```

Reference: https://medium.com/swlh/php-type-juggling-vulnerabilities-3e28c4ed5c09

## strcmp

The `strcmp` method is also affected by the loose comparison. 

```php
if(strcmp($PASSWORD, $_GET['password']) == 0){
        $success = true;
}
```

Thanks to the type juggling describe above, if strcmp returns `NULL` the condition will be true. We can force this by passing the password field as an array:

```
http://yrmyzscnvh.abctf.xyz/web6/?password[]=%22%22
```

Reference: https://www.doyler.net/security-not-included/bypassing-php-strcmp-abctf2016