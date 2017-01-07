mode = nil
color = nil

timeout = 0
numberOfLeds = 16

ws2812.init()

tmr.alarm(0, 1000, tmr.ALARM_AUTO, function() 
    timeout = timeout + 1
    if wifi.sta.getip~=nil or timeout>6 then
        print("IP available")
        tmr.stop(0)
        main()
    else
        dofile("ConnectToWLAN.lua")
        print("Tried to connect to wlan")
    end
end)



function main()
    socket = net.createConnection(net.TCP,0)
    socket:connect(8124,"192.168.1.1")
    socket:on("receive", function(sck, c)
        print(c)
        processData(c)
        
        if mode == 0 then 
            ColorOnly()
        elseif mode == 1 then
            dofile("RandomBlink.lua")
        elseif mode == 2 then
            dofile("PingPongClassic.lua")
        elseif mode == 3 then
            dofile("PingPongRGB.lua")
        elseif mode == 4 then
            dofile("PingPongDouble.lua")
        elseif mode == 5 then
            dofile("RainbowClassic.lua")
        else 
            print("No Mode Selected")
        end
        
    end)
    socket:on("connection", function(sck, c)
        print("Connected")
    end)
end

function processData(data)
    jsonData = cjson.decode(data)
    mode = jsonData["Mode"]
    print(mode)
    color = string.char(jsonData["G"],jsonData["R"],jsonData["B"])
    print(color)
end

function ColorOnly()
    tmr.alarm(0,200,tmr.ALARM_AUTO, function() 
        ws2812.write(color:rep(numberOfLeds))
    end)
end
