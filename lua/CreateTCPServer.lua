server = net.createServer(net.TCP,30)
server:listen(8080, "192.168.1.1", function(c)
    c:on("connection",function(sck, d)
        print("User connected")
        end)
    c:on("receive", function(sck, params)
        print("Receive Request"+params)
        end)
    c:on("disconnection",function(sck, data)
        server.close()
        end)
 end)
