
R = string.char(0,255,0)
G = string.char(255,0,0)
B = string.char(0,0,255)
colors = {R,G,B}

index = 1

ws2812.init()
numberofleds = 16
buffer = ws2812.newBuffer(numberofleds, 3)

shiftForward = true
i = 1
tmr.alarm(0,50,tmr.ALARM_AUTO, function()
    if(i == numberofleds) then
        shiftForward = false
        index = index+1
    end
    if(i==1) then
        shiftForward = true
        index = index +1
    end

    index = (index %3) + 1
    Color = colors[index]
    if(shiftForward) then
        i = i+1
    else
        i = i-1
    end
    ws2812.write(buffer)
    buffer:fade(2)
    buffer:set(i, Color)
end)