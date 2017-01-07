wifi.setmode(wifi.STATION)
wifi.sta.config("PiWLAN", "ShishaLove2016")
print(wifi.sta.getip())
