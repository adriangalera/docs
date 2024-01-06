import itertools
import string

# Add dasnih characters
charset = string.ascii_letters.strip() + "ÆØÅ"

unkwowns = [0,1,5,14]
password = "●,dgr●d med fl●de"

possible_words = []

# pick 4 letters combination from charset and try to replace letters in password
permutations = [p for p in itertools.product(charset, repeat=4)]

for letters in permutations:
    repl_count=0
    possible_word = list(password)
    for unknown_index in unkwowns:
        possible_word[unknown_index] = letters[repl_count]
        repl_count=repl_count+1
    possible_words.append(''.join(possible_word))

for possible_word in possible_words:
    print(possible_word)
