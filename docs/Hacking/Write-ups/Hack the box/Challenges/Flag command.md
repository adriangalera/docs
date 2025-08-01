---
slug: /write-up/htb/challenges/flag-command
pagination_next: null
pagination_prev: null
---

# Flag command

https://app.hackthebox.com/challenges/Flag%20Command

Embark on the "Dimensional Escape Quest" where you wake up in a mysterious forest maze that's not quite of this world. Navigate singing squirrels, mischievous nymphs, and grumpy wizards in a whimsical labyrinth that may lead to otherworldly surprises. Will you conquer the enchanted maze or find yourself lost in a different dimension of magical challenges? The journey unfolds in this mystical escape!

We're given an IP and port, this is some sort of a web role game. We can inspect the JS code to see the correct decission we need to take. There are three files:

- commands.js: The definition of the commands, there's the `GAME_WON` command which probably will reveal the flag.
- game.js
- main.js

In main.js we see calls to an API. The response to display the possible commands is this:
```json
{
  "allPossibleCommands": {
    "1": [
      "HEAD NORTH",
      "HEAD WEST",
      "HEAD EAST",
      "HEAD SOUTH"
    ],
    "2": [
      "GO DEEPER INTO THE FOREST",
      "FOLLOW A MYSTERIOUS PATH",
      "CLIMB A TREE",
      "TURN BACK"
    ],
    "3": [
      "EXPLORE A CAVE",
      "CROSS A RICKETY BRIDGE",
      "FOLLOW A GLOWING BUTTERFLY",
      "SET UP CAMP"
    ],
    "4": [
      "ENTER A MAGICAL PORTAL",
      "SWIM ACROSS A MYSTERIOUS LAKE",
      "FOLLOW A SINGING SQUIRREL",
      "BUILD A RAFT AND SAIL DOWNSTREAM"
    ],
    "secret": [
      "Blip-blop, in a pickle with a hiccup! Shmiggity-shmack"
    ]
  }
}
```

Using Firefox developer tools, we can place a breakpoint in the `CheckMessage` function which is only called when the game is started.

In the `CheckMessage` there's this line:

```javascript
    if (availableOptions[currentStep].includes(currentCommand) || availableOptions['secret'].includes(currentCommand)) {
```

If we provide the secret, the frontend will make the call to the API and it will return the secret!

Easy!