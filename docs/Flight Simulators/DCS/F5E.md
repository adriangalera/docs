---
slug: /flight-sim/dcs/f5e
pagination_next: null
pagination_prev: null
---

This article contains general knowledge and operations about the F5E in DCS.

[Chuck's guide](https://chucksguides.com/aircraft/dcs/f-5e3/)

[Overspeed videos (Spanish)](https://www.youtube.com/watch?v=Uj71LC2bdzM&list=PLEaqGQHn0crdmwX2xKHRUe0MjBBRYRxgo)

## Procedures

### Engine start-up

From the aircraft completely stopped to engines started

| Operation                                           | Control             |
| --------------------------------------------------- | ------------------- |
| Battery switch on                                   | Mouse click         |
| Left and right generator switches ON                | Mouse click         |
| Left and right fuel pump ON                         | Mouse click         |
| Set UHF Frequency to BOTH                           | Mouse click         |
| Request ATC Engine startup                          | ç -> F5 -> F1       |
| Request Ground crew compressed air supply (connect) | ç -> F8 -> F5 -> F1 |
| Request Ground crew compressed air supply (supply)  | ç -> F8 -> F5 -> F3 |
| Once left engine engine reaches 10%, start engine   | Right Alt + Home    |
| Let engine stabilise (30s) to the following params  | Visual              |

:::tip
**Normal engine operation values**

IDLE RPM: 50%

Exhaust Gas Temperature: > 140 ºC

Nozzle position: 60-79 %

Fuel flow: 400 pph

Oil pressure: 5-20 psi

Hydraulic and flight control pressure: 2800-3200 psi
:::

| Operation                                                   | Control             |
| ----------------------------------------------------------- | ------------------- |
| Check AUX intake left is OPEN (barber pole)                 | Visual              |
| Repeat procedure for right engine                           |                     |
| Request Ground crew compressed air supply (supply)          | ç -> F8 -> F5 -> F3 |
| Once right engine engine reaches 10%, start engine          | Right Shift + Home  |
| Stabilise and wait (30s) for normal engine operation values | Visual              |
| Check both AUX intake are OPEN                              | Visual              |

### Post start-up

The aircraft will be ready to taxi after this step

| Operation                         | Control             |
| --------------------------------- | ------------------- |
| Disconnect compressed air supply  | ç -> F8 -> F5 -> F2 |
| Set yaw and pitch dumper          | Mouse click         |
| Set oxygen supply ON              | Mouse click         |
| Confirm air flow                  | Visual              |
| Retract air brakes (FWD position) | B                   |
| Set flap mode switch to THUMB SW  | Mouse click         |
| Set flaps position to FULL        | F                   |
| Trim elevator pitch               | Joystick            |

:::tip
**Trim values**
- Empty: 6
- Tanks + gun + missiles: 7
- Tanks + gun + missile + bombs + rockets: 8
:::

| Operation                                                          | Control             |
| ------------------------------------------------------------------ | ------------------- |
| Reset the altimeter and set barometric pressure to QNH in briefing | Mouse               |
| Primary and secondary attitude indicator trim -3 degress           | Mouse               |
| Power/search button in RWR                                         | Mouse click         |
| Fuel autobalance switch to the side with less fuel                 | Mouse click         |
| Pitot switch ON                                                    | Mouse click         |
| Engine de-icing ON                                                 | Mouse click         |
| Disable master caution                                             | Mouse click         |
| Set Exterior NAV lights (BRT)                                      | Mouse click         |
| Set Formation lights (BRT)                                         | Mouse click         |
| Set Beacon lights (BRT)                                            | Mouse click         |
| Set radar OFF                                                      | Mouse click         |
| Set chaff/flare selector to SINGLE                                 | Mouse click         |
| Set IFF transpoder code                                            | Mouse click         |
| Remove wheel chocks                                                | ç -> F8 -> F4 -> F2 |
| Close canopy                                                       | Left Control + C    |

The aircraft is ready to taxi

### Taxi to runway

Moving the aircraft from parking to the runway

| Operation                                       | Control      |
| ----------------------------------------------- | ------------ |
| Request ATC Taxi                                | ç -> F5      |
| Set Taxi/Landing lights (BRT)                   | Mouse click  |
| Throttle to 65-70 %                             | HOTAS Axis   |
| Nose wheel steering button to turn the aircraft | Joystick     |
| Turn the aircraft using pedals                  | HOTAS Pedals |
| Throttle to 55-60 % during taxi                 | HOTAS Axis   |

### Takeoff

The aircraft is waiting to enter the runway.

| Operation                                                | Control                   |
| -------------------------------------------------------- | ------------------------- |
| Request ATC clearance to enter the runway                | ç -> F5                   |
| Check both sides when entering the runway                | Visual                    |
| Taxi/Landing lights OFF                                  | Mouse click               |
| Check takeoff speed from table                           | Visual                    |
| Check elevator trim                                      | Visual                    |
| Align with runway                                        | HOTAS Pedals              |
| Check magnetic compass with expected heading             | Visual                    |
| Set Radar to STBY                                        | Mouse click               |
| Set Nose struct                                          | Mouse click               |
| Check flaps AUTO and brake retracted (FWD)               | Visual                    |
| Hold break and thrust to 95% and let stabilise           | HOTAS button + HOTAS axis |
| Release break and full throttle                          | HOTAS axis                |
| Rotate at expected speed                                 | Joystick                  |
| Check Angle-Of-Attack to see speed and altitude increase | Visual                    |
| When climb rate is positive, retract landing gear        | HOTAS button or G         |
| MIL power (90% throttle)                                 | HOTAS axis                |
| Check climb speed no less than 300kt                     | Visual                    |
| Fuel autobalance switch to the side with less fuel       | Mouse click               |

### Approach and landing

Fly downwind leg over the airport. The approach starts at 3NM and must be performed at the beginning at 300kt and 1500ft altitude.

| Operation                                             | Control |
| ----------------------------------------------------- | ------- |
| Calculate landing speed index and set it              | Mouse   |
| Check barometric pressure of the landing airport      | Visual  |
| Start at 3NM, 300kt and 1500ft altitude               | Visual  |
| Set flaps to AUTO                                     | F       |
| Fly the downwind leg and slowdown to 260kt            |         |
| When speed is lower than 260kt, deploy landing gear   | G       |
| Check landing gear three lights are green             | Visual  |
| Slowdown to 160kt, keep 1500ft altitude               | B       |
| Turn to take landing course                           |         |
| Lose altitude at -1000ft/min vertical speed and 145kt |         |
| Reduce vertical speed to -400ft/min on the final      |         |
| Check Angle-Of-Attack lights to be ok (green)         |         |

:::tip
**AoA landing indicator**
- ⬇️: too slow, speed up
- 0️⃣: On correct speed
- ⬆️: too fast, slow down
:::

| Operation                                            | Control      |
| ---------------------------------------------------- | ------------ |
| Calculate landing speed index and set it             | Mouse        |
| At 20ft flare and land at landing speed (e.g. 135kt) |              |
| Apply wheel breaks                                   | HOTAS button |
| Deploy parachute                                     | P            |

### TACAN: instrument navigation and landing

TACAN is the military equivalent of civil VOR nagivation. And the landing procedure is a little bit different

#### Approach distance calculation

The approach will be performed at 2400ft and 300kt.

For landing, we first must compute the distance of the TACAN where the descend must start, to do so:

Current altitude - 2400ft will give the required descent altitude. E.g:
```
6000ft - 2400ft = 3600ft
```
Assuming a descent speed of 300kt and vertical speed of 2000ft/min, we can compute the distance to start the descend by:

Distance = Current altitude - airport altitude / 100 / 4, e.g:
```
Distance = 6000 - 2400 = 3600 / 100 = 36 / 4 = 9 NM
```
Then, we add 5 NM to align with the correct course and we have to start descending to approach altitude at 9 + 5 = 14 NM.

#### Entering downwind leg

We land facing the wind with the cockit, the wind will make breaking the aircraft easier. In order to do so, we must fly the downwind leg and turn 180º to land.

When we reach the TACAN station at the airport, we must add 23º to the course to enter the landing course. e.g:

```
Landing at runway 27: 268º
The reverse course is: 268 - 180 = 88º
We add 23º to that: 88º + 23º = 111º
```

When reaching the TACAN, keep the same course for 2 NM for clear reads of TACAN signals, then configure the course to the previously computed (111º)

Fly for 13NM in 111º and turn left to landing course of 268º.

Remember to keep 2400ft and 300kt all the time.

#### Descending the approach

While on landing course, slowdown to 260kt and take out the landing the gear.

:::tip
**Calculating landing speed**
Depends on the weight of the aircraft (fuel + ammunition):
- Fuel weights 1000 pounds and no ammo: 145kt
- More than 1000 pounds of fuel: increase 1kt per each 200 pounds
- Gun ammo full: add another 5kt
:::

Keep landing speed plus 20kt during the descend phase.

When distance to TACAN is 8NM, start descending with vertical speed of 600-700 ft/min.

At 1200ft of altitude, TACAN should read 4NM of distance. You must manouver to find the optimal glide path.

### Taxi from runway and park

The aircraft has landed and exited the runway. Now is taxing to the parking.

| Operation                                | Control                              |
| ---------------------------------------- | ------------------------------------ |
| Drop parachute at the exit of the runway | Mouse click                          |
| Cabin pressure dump                      | Mouse click                          |
| Apply air breaks, flaps UP               | B and F                              |
| Disable Radar                            | Mouse click                          |
| Disable gunsight                         | Mouse click                          |
| Disable pitot heating                    | Mouse click                          |
| Open canopy                              | Mouse click                          |
| Disable remaining switches               | Mouse click                          |
| Throttle set to OFF in both engines      | Right ALT + End and Right Shit + End |
| Pull to cage instruments                 | Mouse click                          |
| Turn OFF fuel pumps                      | Mouse click                          |
| Turn OFF generator                       | Mouse click                          |
| Turn OFF battery                         | Mouse click                          |

## Weapons

### Air to air

#### MSL mode

MSL stands for Missile mode.

MSL mode is used to fire air-to-air missile. F5E can use AIM-9 which are heat seaking missiles.

| Operation                   | Control     |
| --------------------------- | ----------- |
| Select MSL mode in gunsight | Mouse click |
| Radar OPER                  | Mouse click |
| Arm AIM-9 pylons            | Mouse click |
| Arm master arms switch      | Mouse click |

Now the AIM-9 will start a growl noise that will be interrupted when they find a source of heat. Now we should use the Radar to find targets.

| Operation                                                                           | Control                    |
| ----------------------------------------------------------------------------------- | -------------------------- |
| Start searching for targets with the radar at 40NM range                            | Radar range button         |
| Tilt the antena from +10 to -10 degress                                             | Radar antena tilt button   |
| If something appears change to 20NM range. The ACQ cursor appear                    | Radar range button         |
| Put the ACQ cursor on top of the target symbol in the redar                         | TDC                        |
| Disengage afterburner                                                               | Thrust lever               |
| Attempt to lock. It will not lock until close to 10NM                               | TDC button                 |
| If the target is locked, you'll see LK ON light. If not, you must resume the search | Radar resume search button |
| When the target is locked, increase throttle to afterburner                         | Thrust lever               |
| If it's locked, wait for IN RANGE light                                             | Visual                     |
| Point the gunsight to source of heat, when the AIM-9 changes the sounds, fire it    | Arms-Bombs release button  |

#### DM mode

DM stands for Dogfight Missile mode. It's useful when the target is really close and we want to shoot a missile. The radar scanning is as always, start at 40NM, tilt the antena until the target is at 10NM range.

| Operation                                                                            | Control            |
| ------------------------------------------------------------------------------------ | ------------------ |
| Set radar search to 10NM                                                             | Radar range button |
| Enable master arms                                                                   | Mouse click        |
| Enable AIM-9 pylons                                                                  | Mouse click        |
| Set gunsight to MSL                                                                  | Mouse click        |
| When the target is at 5NM keep the target is the center line of radar                | Visual             |
| Climb at the same rate as the antena tilt, e.g. 10º                                  | Visual             |
| Enable DM mode                                                                       | HOTAS button       |
| The target is locked automatically                                                   | Visual             |
| Manouver to keep the target in the Radar reticule until is visually found            | Visual             |
| Keep the target in the gunsight until IN RANGE signal appears                        | Visual             |
| Fire the missile. If the target is manouvering, you should use missile uncage button | HOTAS button       |

#### DG and AA/1 mode

DG stands for Dogfight guns mode. It's useful when we want to fire guns to a manouvering target at different speeds, typically a fighter.

| Operation                                                                   | Control            |
| --------------------------------------------------------------------------- | ------------------ |
| Set radar search to 10NM                                                    | Radar range button |
| Enable master arms                                                          | Mouse click        |
| Set gunsight to AA/1                                                        | Mouse click        |
| Search as usually with the Radar                                            | Visual             |
| When target is at range (0.9NM) or the last line of Radar, select DG mode   | HOTAS button       |
| The target will be locked up automatically                                  | Visual             |
| Keep the target in the center of the gunsight and wait for IN RANGE         | Visual             |
| When IN RANGE, point the gunsight center at the body of the target and fire | Joystick trigger   |

#### AA/2 mode

AA/2 mode is useful for manouvering targets at constant speed, i.e. bombers

| Operation                                                                   | Control              |
| --------------------------------------------------------------------------- | -------------------- |
| Set radar search to 10NM                                                    | Radar range button   |
| Enable master arms                                                          | Mouse click          |
| Set gunsight to AA/2                                                        | Mouse click          |
| Search as usually with the Radar                                            | Visual               |
| When target is at range (0.9NM) or the last line of Radar, select Radar ACQ | Radar ACQ button     |
| The target will be locked, if not, resume search                            | Resume search button |
| Keep the target in the center of the gunsight and wait for IN RANGE         | Visual               |
| When IN RANGE, point the gunsight center at the body of the target and fire | Joystick trigger     |

### Air to ground

#### Bombs

The F5E is only capable of deliver dumb bombs. In order to do so, you must do a dive bombing and use the altitude, speed parameters and the gunsight to calculate when to drop the bombs.

The dive has to be done under the following parameters:

| Operation                            | Value                    |
| ------------------------------------ | ------------------------ |
| Set gunsight to MAN                  | MAN                      |
| Set reticule depresion               | 80 MILS                  |
| Enable master arms                   | Mouse click              |
| Weapon type select Bombs             | Mouse click              |
| Select bombs pylon                   | Mouse click              |
| Select any bomb fuse option but SAFE | Mouse click              |
| Dive altitude start                  | 5000ft + target altitude |
| Dive speed start                     | 350kt                    |
| Dive angle                           | 20º                      |
| Drop bomb altitude                   | 3200ft                   |
| Drop bomb speed                      | 400kt                    |

The flight manual contains all sorts of parameters for different dive angles.

#### Rockets and guns

Using rockets and guns to attack ground targets is similar to using bombs. They rely on a dive to release them. The parameters are similar to dive bombing:

| Operation                      | Value                    |
| ------------------------------ | ------------------------ |
| Set gunsight to MAN            | MAN                      |
| Set reticule depresion         | 14 MILS                  |
| Enable master arms             | Mouse click              |
| External stores select Rockets | Mouse click              |
| Select rockets pylon           | Mouse click              |
| Dive altitude start            | 5000ft + target altitude |
| Dive speed start               | 350kt                    |
| Dive angle                     | 20º                      |
| Drop bomb altitude             | 3200ft                   |
| Drop bomb speed                | 400kt                    |

For using guns, the only difference is that 12 MILS should be configured as reticule depression.

#### Laser guided bombs

The F5E is capable of deliver GBU-12 laser guided bombs where an operator (JTAC) is iluminating the target with laser light. Typically this is done by some ground unit.

| Operation                                                               | Value                 |
| ----------------------------------------------------------------------- | --------------------- |
| Speak with JTAC via UHF radio                                           | Right ALT + ç         |
| Select JTAC and check-in time                                           | F4                    |
| JTAC will give 9 lines attack vector to communicate where is the target |                       |
| Use map to locate the target using the 9 lines coordinates              | F10                   |
| Enable master arms                                                      | Mouse click           |
| Select GBU switches                                                     | Mouse click           |
| Select bombs in External stores                                         | Mouse click           |
| Select any bomb fuse but SAFE                                           | Mouse click           |
| Once the Ingress Point (IP) is known, navigate to it and inform JTAC    | Right ALT + ç         |
| After reaching the IP, the aircraft should be at 3000ft, 400kt          |                       |
| Ask JTAC to deploy smoke on the target                                  | Right ALT + ç         |
| Confirm the smoke can be seen to JTAC                                   | Right ALT + ç         |
| Ask JTAC to illuminate the target with laser                            | Right ALT + ç         |
| Keep the target between the left cannon and the gunsight camera         | Visual                |
| Drop the bomb when close to the target                                  | Weapon release button |