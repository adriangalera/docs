---
slug: /write-up/htb/challenges/like-a-glove
pagination_next: null
pagination_prev: null
---

# Like a glove

https://app.hackthebox.com/challenges/Like%2520a%2520Glove

Words carry semantic information. Similar to how people can infer meaning based on a word's context, AI can derive representations for words based on their context too! However, the kinds of meaning that a model uses may not match ours. We've found a pair of AIs speaking in metaphors that we can't make any sense of! The embedding model is glove-twitter-25. Note that the flag should be fully ASCII ans starts with 'htb{'.

GloVe is an unsupervised learning algorithm for obtaining vector representations for words: https://nlp.stanford.edu/projects/glove/.

An analogy can be expressed such as:

`A : B :: C : _?_`

In order to compute the `?`, we need to do:


`B - A + C`

e.g. :

`France : Paris :: Italy : _?_`

You solve for:

`wv('France') - wv('Paris') + wv('Berlin') = target_coordinates`

I was a bit confused of what to do at this point, because there's the word flag in the corpus. However, when you resolve the analogy, it does not look like the format expected. Instead, what it needs to be done is resolve every analogy and the append every result into a word. That word will be the final flag.

After doing that and strip and remove the spaces, we got something that looks like the flag, but still it's not. The numbers are adding some weird space. If you compute the unicode code of those chars, you see something weird:

```Closest match for 'tωt' is '０'
０ => 65296
```

While for normal letters:
```
Closest match for 'qualification' is 'rma'
r => 114
m => 109
a => 97
```

It turns out that the ASCII table only arrives to code 127 (or 255 if extended). We're dealing with non-ASCII characters here. They are full-width digits, e.g.: https://www.codetable.net/decimal/65296

Luckily, we can normalize them quite easily:

```python
def normalize(text):
    return unicodedata.normalize('NFKC', text)
```

Once we do that to our potential flag, we'll retrieve the correct flag.