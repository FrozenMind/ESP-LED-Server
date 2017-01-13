 //variablen zur kommunikation
 var express = require('express');
 var app = express();
 var http = require('http').Server(app);
 var io = require('socket.io')(http);
 var os = require('os');
 var net = require('net');
 var bunyan = require('bunyan');

 //ESP Clients Array
 var clients = new Array();
 //ESP MACAdressen which will be excepted on connection
 var clientMAC = [];

 //Logger init
 var log = bunyan.createLogger({
     name: 'ESPServerLogger',
     streams: [{
         level: 'debug',
         stream: process.stdout
     }, {
         level: 'info',
         path: __dirname + '/log/info.log'
     }, {
         level: 'error',
         path: __dirname + '/log/error.log'
     }]
 });

 //TCP Server erzeugen!
 server = net.createServer(function(sck) {
     log.debug("Client connected");
     log.debug(sck);
     //push socket into client array
     clients.push(sck);
     log.info("Client connected to TCP Server");
     //on data received
     sck.on('data', function(data) {
         //data is an string so we convert it to json to use it in the actionMethod
         try {
             jsonData = JSON.parse(data);
         } catch (e) {
             log.debug("No JSON received");
         }
         log.info("Client command recieved via TCP (Android)");
         sendDataToEsp(jsonData);
     });
     //on socket disconnect
     sck.on("end", function() {
         log.info("Client disconnected from TCP Server");
         clients.slice(clients.indexOf(sck), 1);
     });
     //on socket error (i.e. socket disconnect without closing)
     sck.on('error', function(exc) {
         log.error(exc);
         clients.slice(clients.indexOf(sck), 1);
     });
 }).listen(8124, function() {
     log.info("TCP Server listening on Port 8124");
 });

 //TCP Server Error
 server.on("error", function(err) {
     log.error(err);
 });

 //start HTTP Server
 http.listen(62345, function() {
     log.info('HTTP Server listening on Port 62345');
 });

 //on User Connection to HTTP Server send Website
 app.get('/', function(req, res) {
     app.use(express.static('public'));
     res.sendFile(__dirname + '/public/index.html');
 });

 //connection between server and website (http server)
 io.on('connection', function(socket) {
     log.info(socket.handshake.address + " connected.");
     //on esp start command (button "go" on website)
     socket.on('go', function(jsonData) {
         log.info("Client command recieved via HTTP");
         sendDataToEsp(jsonData);
     });
     //on socket disconnect (http)
     socket.on("disconnect", function(data) {
         log.info("User disconnected from HTTP (Website)");
     });
     //on socket error (http)
     socket.on("error", function(err) {
         log.error(err);
     });
 });

 //sends json Object with command for ESP tp ESP
 function sendDataToEsp(jsonData) {
     log.debug(jsonData);
     //log ESP Mode to start
     log.info("ESP: " + jsonData.Id + "\tColor: " + " R: " + jsonData.R + " G: " + jsonData.G + " B: " + jsonData.B + "\tMode: " + jsonData.Mode);
     //Send to ESP
     //only if esp is connected tell esp what to do
     if (clients[jsonData.Id])
         clients[jsonData.Id].write(JSON.stringify(jsonData));
     else
         log.error("ESP (ID: " + jsonData.Id + ") not connected");
 }
