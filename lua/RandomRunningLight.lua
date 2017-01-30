-- Variabel
Color = string.char(math.random(255), math.random(255), math.random(255))
numberOfLEDs = 16

ws2812.init(ws2812.MODE_SINGLE);
buffer = ws2812.newBuffer(numberOfLEDs, 3)

buffer:set(1,0,255,0)
buffer:set(2,0,255,0)
buffer:set(6,0,255,0)
ws2812.write(buffer)
tmr.alarm(0,500,tmr.ALARM_AUTO, function()
    buffer:shift(1, ws2812.SHIFT_CIRCULAR)
    ws2812.write(buffer)
end)
