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
- ⬇️: slow down
- 0️⃣: On correct speed
- ⬆️: speed up
:::

| Operation                                            | Control      |
| ---------------------------------------------------- | ------------ |
| Calculate landing speed index and set it             | Mouse        |
| At 20ft flare and land at landing speed (e.g. 135kt) |              |
| Apply wheel breaks                                   | HOTAS button |
| Deploy parachute                                     | P            |

### Landing with TACAN

TACAN is the military equivalent of civil VOR nagivation. And the landing procedure is a little bit different

WIP

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

### MSL mode

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
| Attempt to lock. It will not lock until close to 10NM                               | TDC button                 |
| If the target is locked, you'll see LK ON light. If not, you must resume the search | Radar resume search button |
| If it's locked, wait for IN RANGE light                                             | Visual                     |
| Point the gunsight to source of heat, when the AIM-9 changes the sounds, fire it    | Arms-Bombs release button  |

### DM mode

DM stands for Dogfight mode.

WIP

### DG and AA/1 mode

WIP

### AA/2 mode

WIP

### Air to Ground attack

The F5E is only capable of deliver dumb bombs. In order to do so, you must do a dive bombing and use the altitude, speed parameters and the gunsight to calculate when to drop the bombs.

The dive has to be done under the following parameters:

| Operation                   | Value                    |
| --------------------------- | ------------------------ |
| Set gunsight to MAN         | MAN                      |
| Set reticule depresion rate | 80 MILS                  |
| Dive altitude start         | 5000ft + target altitude |
| Dive speed start            | 350kt                    |
| Dive angle                  | 20º                      |
| Drop bomb altitude          | 3200ft                   |
| Drop bomb speed             | 400kt                    |

The flight manual contains all sorts of parameters for different dive angles.

### Rockets and guns

WIP