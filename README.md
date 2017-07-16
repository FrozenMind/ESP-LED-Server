# Led strip control
This repository is for controlling LED strips in your house via your android phone.

## Setup
1. Raspberry Pi 3 --> nodejs server
* has a network in which the ESP's are connected
2. ESP8266 with connected LED strips --> lua files
* The ESP's need to run nodemcu (v10+)
3. Android phone --> Android app
* controls the lights, needs to be in the same network with the Pi
