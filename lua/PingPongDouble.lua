
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
startPos = math.floor(numberofleds / 2)
Color = colors[1]
print(Color)
buffer = ws2812.newBuffer(numberofleds, 3)

shiftForward = true

playerOnePos = startPos+1
playerTwoPos = startPos

playerOneDirection = 1
playerTwoDirection = -1

tmr.alarm(0,50,tmr.ALARM_AUTO, function()

    if(playerOnePos == numberofleds) then
        playerOneDirection = -1 * playerOneDirection
    end

    if(playerOnePos == playerTwoPos) then
        playerOneDirection = -1 * playerOneDirection
        playerTwoDirection = -1 * playerTwoDirection
        CalcIndex()
        SwitchColor(index)
    end
    
    if(playerTwoPos==1) then
        playerTwoDirection = -1 * playerTwoDirection
    end

    playerOnePos = playerOnePos + playerOneDirection
    playerTwoPos = playerTwoPos + playerTwoDirection

    print(Color)
    
    ws2812.write(buffer)
    buffer:fade(2)
    buffer:set(playerOnePos, Color)
    buffer:set(playerTwoPos, Color)
end)

function CalcIndex()
    index = ((index+1) % arraysize) + 1
end

function SwitchColor(index)
    Color = colors[index]
end
