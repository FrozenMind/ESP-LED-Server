function GetArraySize(arr)
    local count = 0
    for i,v in ipairs(arr) do 
        count = count + 1
    end
    return count
end

-- Rainbow Colors
Red = string.char(0,255,0)
Orange = string.char(127,255,0)
Yellow = string.char(255,255,0)
Green = string.char(255,0,0)
Blue = string.char(0,0,255)
Indigo = string.char(0,75,130)
Violet = string.char(0,127,255)

RainbowColors = {Red,Orange,Yellow,Green,Blue,Indigo,Violet} -- Array mit allen Farben
RainbowColorsSize = GetArraySize(RainbowColors) -- Array Größez
NumberOfLeds = 16 -- LED Anzahl

ws2812.init()
buffer = ws2812.newBuffer(NumberOfLeds,3) -- Buffer

-- Errechnen wie viele LEDs die jeweilige Farbe bekommt
ColorAmount = math.floor(NumberOfLeds / RainbowColorsSize)
ColorMod = NumberOfLeds % RainbowColorsSize

-- Speichern der Anzahl
--ColorAmountTable = {}
--for i = 0, RainbowColorsSize, 1 do 
	--ColorAmountTable[RainbowColors[i]] = ColorAmount
--end

--if ColorMod > 0
	--for j = 0, ColorMod, 1 do
		--ColorAmount[RainbowColors[j]] = ColorAmount[RainbowColors[j]] + 1
	--end
--end

-- Füllen des Buffers

for k = 0, NumberOfLeds-1, 1 do
    buffer:set(k+1, RainbowColors[(k%RainbowColorsSize)+1])
end

-- Rainbow Effekt anzeigen
ws2812.write(buffer)


