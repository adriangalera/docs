---
slug: /flight-sim/dcs/su25t
pagination_next: null
pagination_prev: null
---

This article contains general knowledge and operations about the Su-25T in DCS.

[Flight manual](../Su-25T/DCS%20World%20Su-25T%20Flight%20Manual%20EN.pdf)

[Loadout quick reference](../Su-25T/Su-25T%20Loadout%20Quick%20Reference.pdf)

## Starting up and take-off

| Operation                 | Keyboard           |
| ------------------------- | ------------------ |
| Cabin light               | L                  |
| Close cabin               | Ctrl Left + C      |
| Start/Stop electric power | Shift Right + L    |
| Navigation lights         | Ctrl Right + L     |
| Right engine start        | Ctrl Right + Start |
| Left engine start         | Alt Right + Start  |
| Take-off/Landing flaps    | Shift Left + F     |
| Normal flaps              | F                  |
| Aerodynamic break         | B                  |
| Landing gear              | G                  |
| Wheel breaks              | W                  |
| Radio                     | Ç                  |

## Landing

Keep vertical speed between 1 and 5 meters

Keep airspeed < 300 kmh

| Operation                         | Keyboard         |
| --------------------------------- | ---------------- |
| Take-off/Landing flaps            | Shift Left + F   |
| Landing gear                      | G                |
| Wheel breaks                      | W                |
| Breaking parachute (1 usage only) | P                |
| Right engine stop                 | Ctrl Right + End |
| Left engine stop                  | Alt Right + End  |

## Navigation

- MPW/ENR: Waypoint mode
- B3B/RTN: Return to base mode
- MOC/LDNG: Landing mode

| Operation                   | Keyboard          | Notes                     |
| --------------------------- | ----------------- | ------------------------- |
| Navigation HUD              | 1                 |
| Next waypoint               | Ctrl Left + º     |
| AP keep altitude            | Alt Left + 1 or H |
| AP keep altitude and roll   | Alt Left + 2      |
| AP keep level flight        | Alt Left + 3      |
| AP keep radar altitude      | Alt Left + 4      | Useful for very low fligh |
| AP keep barometric altitude | Alt Left + 5      |
| AP follow route             | Alt Left + 6 or A |
| AP disable any              | Alt Left + 9      |

## Air to ground mode

| Operation                         | Keyboard         | Notes                                            |
| --------------------------------- | ---------------- | ------------------------------------------------ |
| Air to ground mode                | 7                | 3MN symbol appears in HUD                        |
| Change weapon                     | D                |
| Enable shkival                    | O                |
| Enable Laser                      | Shift Right + O  | You need to remember if the weapon needs laser * |
| Enable Anti-Radar (Fantasmagoria) | I                |                                                  |
| Discharge amount                  | Ctrl + backspace |
| Drop interval                     | V                |
| Gunpod                            | C                |

\* Check the last letter of the weapon symbol, T means TV, L means laser

### Bombs

There are two modes of dropping an un-guided bomb: https://www.openflightschool.de/mod/book/view.php?id=792

The symbol `b` appears in the HUD when a bomb is selected.

#### CCIP

Continuously Computed Impact Point. 

Deep dive into the objective

A vertical line will appear, when the piper is in the objective trigger the joystick

#### CCRP

Continuously Computed Release Point.

Flight level and point the piper where you want to drop the bomb.

Press the joystick trigger and keep flying leveled towards the point.

There's a distance indicator in the left side of the HUD, when the indicator reaches the lowest point, the bomb will be released automatically.

### Missiles

Point the skhrval sensor to the target. 

Make the reticule smaller as possible and adapt the size of the reticule to the kind of target:

- MANPAD: 5m
- Tank: 10m
- Building: 30-60m

When shkrval acquires the lock, you will see NP (Launch authorized).

With the vickr missiles you don't actually need the lock, they will follow the laser. If you spot something before the locking, you can shoot as soon as you are in the required distance.

## Air to air mode

| Operation       | Keyboard | Notes                                                       |
| --------------- | -------- | ----------------------------------------------------------- |
| Air to air mode | 6        | OTN symbol appears in HUD                                   |
| Gunpod          | C        | Place the target aircraft in the middle of the symbol wings |
