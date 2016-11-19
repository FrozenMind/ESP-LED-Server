
Red = string.char(0,255,0)
Orange = string.char(127,255,0)
Yellow = string.char(255,255,0)
Green = string.char(255,0,0)
Blue = string.char(0,0,255)
Indigo = string.char(0,75,130)
Violet = string.char(0,127,255)

colors = {Red,Orange,Yellow,Green,Blue,Indigo,Violet}
arraysize = 7
index = 1

ws2812.init()
numberofleds = 16
buffer = ws2812.newBuffer(numberofleds, 3)

shiftForward = true
i = 1
tmr.alarm(0,30,tmr.ALARM_AUTO, function()
    if(i == numberofleds) then
        shiftForward = false
        index = ((index+1) % arraysize) + 1
        Color = colors[index]
    end
    if(i==1) then
        shiftForward = true
        index = ((index+1) % arraysize) + 1
        Color = colors[index]
    end

    if(shiftForward) then
        i = i+1
    else
        i = i-1
    end
    ws2812.write(buffer)
    buffer:fade(2)
    buffer:set(i, Color)
end)