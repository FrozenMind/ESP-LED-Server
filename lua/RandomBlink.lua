-- Variabel
Off = string.char(0,0,0)
numberOfLEDs = 16
timeoutTime = 1000000

ws2812.init(ws2812.MODE_SINGLE);

while true do 
	Color = string.char(math.random(255), math.random(255), math.random(255))
	ws2812.write(Color:rep(numberOfLEDs))
	tmr.delay(timeoutTime)
	ws2812.write(Off:rep(16))
	tmr.delay(timeoutTime)
end
