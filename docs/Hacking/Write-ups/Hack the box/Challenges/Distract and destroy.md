---
slug: /write-up/htb/challenges/distract-and-destroy
pagination_next: null
pagination_prev: null
---

# Distract and destroy

After defeating her first monster, Alex stood frozen, staring up at another massive, hulking creature that loomed over her. She knew that this was a fight she couldn't win on her own. She turned to her guildmates, trying to come up with a plan. "We need to distract it," Alex said. "If we can get it off balance, we might be able to take it down." Her guildmates nodded, their eyes narrowed in determination. They quickly came up with a plan to lure the monster away from their position, using a combination of noise and movement to distract it. As they put their plan into action, Alex drew her sword and waited for her chance.

https://app.hackthebox.com/challenges/Distract%2520and%2520Destroy

## Intro to Ethereum

In Ethereum network, there are two types of accounts:

- Externally Owned Account (EOA): human powered that has a private key and can initiate transactions
- Smart contract: It is controller by code. Only can respond to calls, cannot initiate transactions and does not have a private key.

When a transaction is made:

- EOA Call:

msg.sender = your EOA address
tx.origin = your EOA address

- Contract Call (via another contract):

You call Contract A (as an EOA), and it calls Contract B.

In Contract B:

msg.sender = Contract A
tx.origin = your EOA address

In our case, the first caller set the `aggro` address:

```solidity
if (aggro == address(0)) {
    aggro = msg.sender;
}
```
Life points are only drained if `offBalance` and the sender is different that the first attacker

```solidity
if (_isOffBalance() && aggro != msg.sender) {
    lifePoints -= _damage;
} else {
    lifePoints -= 0;
}
```

`offBalance` happens on this case:
```solidity
  function _isOffBalance() private view returns (bool) {
        return tx.origin != msg.sender;
    }
```
`tx.origin` is transaction origin, since transactions can only be initiated by EOA,
this is true only if the call is made from a contract (i.e., not directly from an EOA). So only contract calls (not direct user transactions) can damage the Creature.

So, we need to create two things:

- A EOA that calls attack and sets `aggro` to the EOA. No damage will happen because `isOffBalance` will be false.
- A smart contract that calls the attack and drain the life points.

Once the life points are done, we can use the UI to perform the attack and reveal the flag.