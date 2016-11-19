dofile("ConnectToWLAN.lua")

timout = 0

ws2812.init()

tmr.alarm(0, 1000, tmr.ALARM_AUTO, function() 
    timout = timout + 1
    if wifi.sta.getip~=nil or timout>6 then
        tmr.stop(0)
        main()
    end
end)

function main()
    socket = net.createConnection(net.TCP,0)
    socket:connect(8124,"192.168.1.1")
    socket:on("receive", function(sck, c)
        print(c)
        processData(c)
    end)
    socket:on("connection", function(sck, c)
        print("Connected")
    end)
end

function processData(data)
    semikolonPos = data:find(";")
    allColorString = data:sub(0,semikolonPos-1)
    mode = data:sub(semikolonPos)
    firstCommaPos = allColorString:find(",")
    secondCommaPos = allColorString:find(",",firstCommaPos+1)
    r = allColorString:sub(0,firstCommaPos-1)
    g = allColorString:sub(firstCommaPos+1,secondCommaPos-1)
    b = allColorString:sub(secondCommaPos+1)
    print(r)
    print(g)
    print(b)
    colorForESP = string.char(g,b,r)
    ws2812.write(colorForESP:rep(16))
end
