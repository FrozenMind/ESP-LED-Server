-- Rainbow Colors
Red = string.char(255,0,0)
Orange = string.char(255,127,0)
Yellow = string.char(255,255,0)
Green = string.char(0,255,0)
Blue = string.char(0,0,255)
Indigo = string.char(75,0,130)
Violet = string.char(127,0,255)

RainbowColors = {Red,Orange,Yellow,Green,Blue,Indigo,Violet} -- Array mit allen Farben
RainbowColorsSize = GetArraySize(RainbowColors) -- Array Größe

NumberOfLeds = 16 -- LED Anzahl
buffer = ws2812.newBuffer(numberOfLeds,3) -- Buffer

-- Errechnen wie viele LEDs die jeweilige Farbe bekommt
ColorAmount = math.floor(NumberOfLeds / RainbowColorsSize)
ColorMod = NumberOfLeds % RainbowColorsSize

-- Speichern der Anzahl
ColorAmountTable = {}
for i = 0, RainbowColorsSize, 1 do 
	ColorAmountTable[RainbowColors[i]] = ColorAmount
end

if ColorMod > 0
	for j = 0, ColorMod, 1 do
		ColorAmount[RainbowColors[j]] = ColorAmount[RainbowColors[j]] + 1
	end
end

-- Füllen des Buffers
for k = 0, NumberOfLeds, 1 do
	for m, ColorAmountTable[RainbowColors[k]], 1 do
		buffer:fill(RainbowColors[m])
	end
end

-- Rainbow Effekt anzeigen
while true do
	buffer:shift(1,ws2812.SHIFT_CIRCULAR)
	tmr.delay(100000)
end

function GetArraySize(arr)
	count = 0
	for i,v in ipairs(arr) do 
		count = count + 1 
	end
	return count
end
