---
slug: /write-up/htb/challenges/evaluative
pagination_next: null
pagination_prev: null
---
# Evaluative

https://app.hackthebox.com/challenges/Evaluative

A rogue bot is malfunctioning, generating cryptic sequences that control secure data vaults. Your task? Decode its logic and compute the correct output before the system locks you out!

This was a weird one. It was more like a programming challenge than a hacking challenge.

At the beginning, looks like it was a very easy RCE since we got a Python console. However, after searching for the flag inside the docker container, I couldn't find anything so I switched to analyze the source code.

In the source code I found an interesting line:

```python
            check = requests.post(f'{CHECK_SERVER}/check', json=response).json() 
            first_item = next(iter(results.items())) 
            if check['success']: 
                return jsonify({ 'flag': check['flag'], 'stderr': '', 'input': first_item[0], 'result': first_item[-1] }) 
```

Looks like if we got the assignment programmed correctly, we'll retrieve the flag. Extremely easy