NumberOfLeds = 16 -- LED Anzahl
RainbowTime = 765
buffer = ws2812.newBuffer(NumberOfLeds,3)
leds = {}

ws2812.init()

function init()
    step = 765 / NumberOfLeds
    for i=1,NumberOfLeds,1 do
        leds[i] = step * i
        buffer:set(i,GetRainbowColor(leds[i]))
    end
end

function GetRainbowColor(intColor)
    if intColor <= (RainbowTime / 3) then
        r = 255 - (intColor)
        g = intColor
        b = 0
    elseif intColor <= (RainbowTime * (2/3)) then
        r = 0
        g = 510 - (intColor)
        b = (intColor) - 255
    else
        r = (intColor) - 510
        g = 0
        b = 765 - (intColor)
    end
    return string.char(math.floor(g),math.floor(r),math.floor(b))
end

init()
ws2812.write(buffer)
tmr.alarm(0,100,tmr.ALARM_AUTO, function()
    print(tmr.now())
    for i=1,NumberOfLeds,1 do
        leds[i] = leds[i] + 1
        if leds[i] >= 764 then
           leds[i] = 1 
        end
        buffer:set(i,GetRainbowColor(leds[i]))
    end
    print(tmr.now())
end)