NumberOfLeds = 16 -- LED Anzahl
RainbowTime = 60
counter = 1

ws2812.init()

tmr.alarm(0,1000, tmr.ALARM_AUTO,function()
    color = GetRainbowColor()
    ws2812.write(color:rep(NumberOfLeds))
    counter = counter + 1
end)

function GetRainbowColor()
    intColor = counter % (RainbowTime + 1)
    step = 765 / RainbowTime
    if intColor <= (RainbowTime / 3) then
        r = 255 - (intColor * step)
        g = intColor * step
        b = 0
    elseif intColor <= (RainbowTime * (2/3)) then
        r = 0
        g = 510 - (intColor * step)
        b = (intColor * step) - 255
    else
        r = (intColor * step) - 510
        g = 0
        b = 765 - (intColor * step)
    end
   
    return string.char(math.floor(g),math.floor(r),math.floor(b))
end
