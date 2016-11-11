-- Variabel
Color = string.char(math.random(255), math.random(255), math.random(255))
numberOfLEDs = 16


ws2812.init(ws2812.MODE_SINGLE);
buffer = ws2812.newBuffer(numberOfLEDs, 3)
buffer:fill(16, Color)
while true do 
	buffer:shift(1,ws2812.SHIFT_LOGICAL)
	tmr.delay(100000)
end
