mode = nil
color = nil

timeout = 0
trycounter = 0
numberOfLeds = 16

ctrl = 6 --qpio12 to turn led strip on and off
gpio.mode(ctrl, gpio.OUTPUT)
connected = false


tmr_reconnect=tmr.create()
tmr_reconnect:register(10000, tmr.ALARM_AUTO, function()
   print("restart for reconnect")
   node.restart()
end)

ws2812.init()

tmr.alarm(0, 1000, tmr.ALARM_AUTO, function()
    timeout = timeout + 1
    if wifi.sta.getip~=nil or timeout>6 then
        print("IP available")
        tmr.stop(0)
        tmr.alarm(1, 1000, tmr.ALARM_SINGLE, function() main() end)
    else
        dofile("ConnectToWLAN.lua")
        print("Tried to connect to wlan")
    end
end)

function main()
    socket = net.createConnection(net.TCP,0)
    trycounter = 0
    cyrill()
    socket:on("receive", function(sck, c)
        print(c)
        processData(c)

        if mode == 0 then
            ColorOnly(color)
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
        elseif mode == 100 then --on
            gpio.write(CTRL, gpio.HIGH)
        elseif mode == 101 then --off
            gpio.write(CTRL, gpio.LOW)
        else
            print("No Mode Selected")
        end

    end)
    socket:on("connection", function(sck, c)
        print("Connected")
        connected = true
        -- on connection to server tell server my ip
        sck:send(wifi.sta.getmac())
        ColorOnly(string.char(255,0,0))
    end)
    socket:on("disconnection", function(sck, c)
        print("Disconnected")
        dofile("KnighRider_ErrorMode.lua")
        if connected then
            tmr_reconnect:start()
        end
        connected = false
    end)

end

function cyrill()
    print("check for connstatus: "..tostring(connected))
    trycounter = trycounter + 1
    if not connected and trycounter<=15 then
        socket:connect(8124,"192.168.1.1")
        tmr.alarm(6, 4000, tmr.ALARM_SINGLE, function() cyrill() end)
    elseif trycounter>15 then
        print("going to sleep")
        node.dsleep()
    end
end

function processData(data)
    jsonData = cjson.decode(data)
    mode = jsonData["Mode"]
    print(mode)
    color = string.char(jsonData["G"],jsonData["R"],jsonData["B"])
    print(color)
end

function ColorOnly(col)
    tmr.alarm(0,200,tmr.ALARM_AUTO, function()
        ws2812.write(col:rep(numberOfLeds))
    end)
end
