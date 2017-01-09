
Red = string.char(0,255,0)
Orange = string.char(127,255,0)
Yellow = string.char(255,255,0)
Green = string.char(255,0,0)
Blue = string.char(0,0,255)
Indigo = string.char(0,75,130)
Violet = string.char(0,127,255)

colors = {Red,Orange,Yellow,Green,Blue,Indigo,Violet}

ws2812.init()
numberofleds = 16
buffer = ws2812.newBuffer(numberofleds, 3)

shiftForward = true
pos = 0
tmr.alarm(0,100,tmr.ALARM_AUTO, function()
    if(pos == numberofleds - 1) then
        shiftForward = false                
    end
    if(pos == 0) then
        shiftForward = true        
    end

    if(shiftForward) then
        pos = pos + 1
    else
        pos = pos - 1
    end
    ws2812.write(buffer)
    buffer:fade(2)
    buffer:set(pos + 1, Color)
    buffer:set(numberofleds - pos, Color)
end)


