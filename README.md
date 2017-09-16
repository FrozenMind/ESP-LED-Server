# Led strip control
This project is to control LED strips in your house via Android application or web interface. Our setup only works in your home network. Each strip has around 60 - 90 LED's. In total we have something like 300 LED's in our house yet and even ordered more to connect more rooms.

Homeautomation is a big very interesting topic, but it takes a lot of time, especially if you build it with people that are mainly coders, so hardware stuff takes time to inform how everything works together. Nevertheless we have some big plans and I think this project will continue the next years. Some ideas what's upcoming:
* Automatic turn on / off if you enter the room and it's dark enough.
* Show the tim via LED's like church bells with LED's
* A party mode, where the randomly come up to tell you to drink a shot.
* connect to music so different LED's show the frequencies
* set timers and all LED's will light if timer is done. e.g. you watching television while you cooking some stuff.
* alarm system if nobodys at home
* and many many many more

## Setup
### Raspberry Pi 3
The Pi is the main node in this project. It offers a network were the ESP's are connected and a NodeJs server with which the Android app and the web interface comunicate.

### ESP8266
Each ESP controls one LED strip and it is connected to the local Pi network to receive commands by the NodeJs server about what to do. To control the LED strips we use the OS nodemcu and Lua scripts.

### LEDS WS2812B
Every single LED of these strips contains a processor which is able to read commands and translate it into the given color, so every LED can display 16 million different colors with 60Hz. This means they can change the color theoreticaly 60 times per second, even the ESP's are not able to do so.

### Android Application
The app is written in Java so it's only available for Android. It uses socket.io to comunicate with the NodeJs server. Here we can choose which ESP we want to access and which color or color mode it should display. The coolest feature is to control it with speech commands, but this one has only some basic designs and we hope to finish it till end of 2017.

### Web Interface
The web interface runs on the Pi and is not really interesting, because it only shows some dropdowns and send also socket.io commands. Since it's JavaScript we build a basic Electron desktop application, so it could run cross platform, but it's also not ready yet.

### Hardware Connections
screenshots how the hardware is connected, will come soon.

### Links
Check out our website for screenshots and more detailed description: http://games-broduction.com/esp-led-server/
