NumberOfLeds = 16 -- LED Anzahl

ws2812.init()
buffer = ws2812.newBuffer(NumberOfLeds,3) -- Buffer

tmr.alarm(0,1000,tmr.ALARM_AUTO,function()
    for j=0,256,1 do
        print("outer for")
        for i=1, NumberOfLeds, 1 do
            print("inner for")
            --color = Wheel(bit.band((i+j),255))
            x = (i * 256 / NumberOfLeds) + j
            color = Wheel(bit.band(x,255))
            buffer:set(i, color);
        
       
        end
        -- Rainbow Effekt anzeigen
        print("Write LEDs")
        ws2812.write(buffer)
        buffer:shift(1,ws2812.SHIFT_CIRCULAR)
    end
end)


-- Input a value 0 to 255 to get a color value.
-- The colours are a transition r - g - b - back to r.
function Wheel(WheelPos)
    print(WheelPos)
    WheelPos = 255 - WheelPos;
    if WheelPos < 85 then
        return string.char(255 - WheelPos * 3, 0, WheelPos * 3);
    end
    if WheelPos < 170 then
        WheelPos = WheelPos - 85;
        return string.char(0, WheelPos * 3, 255 - WheelPos * 3);
    end
    WheelPos = WheelPos - 170;
    return string.char(WheelPos * 3, 255 - WheelPos * 3, 0);
end
