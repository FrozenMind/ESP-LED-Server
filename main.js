 //variablen zur kommunikation
 var express = require('express');
 var app = express();
 var http = require('http').Server(app);
 var io = require('socket.io')(http);
 var os = require('os');
 var net = require('net');
 var bunyan = require('bunyan');
 var server = undefined;

 //Telegram bot init
 var TelegramBot = require('node-telegram-bot-api');
 var token = '265274462:AAFtbuN6p80ywv0MJ1UJbS51SsZjM4fF854';
 var bot = new TelegramBot(token, {
     polling: true
 });

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

 //Users
 var debugUser = undefined;
 var users = undefined;

 //ESP Clients
 var clients = new Array();

 //TCP Server erzeugen!
 server = net.createServer(function(sck) {
     log.debug("Client connected");
     log.debug(sck);
     clients.push(sck);
     log.info("Client connected to TCP Server");
     sck.on("end", function() {
         log.info("Client disconnected from TCP Server");
         clients.slice(clients.indexOf(sck), 1);
     });

     sck.on('data', function(data) {
         try {
             jsonData = JSON.parse(data);
         } catch (e) {
             log.debug("No JSON received");
         }
         log.debug(jsonData);
         clients[jsonData.Id].write(JSON.stringify(jsonData));
     });

     sck.on('error', function(exc) {
         log.error(exc);
         clients.slice(clients.indexOf(sck), 1);
     })
 });

 //TCP Server Fehler
 server.on("error", function(err) {
     log.error(err);
 });

 //TCP Server starten
 server.listen(8124, function() {
     log.info("TCP Server listening on Port 8124");
 });

 //HTTP Server starten
 http.listen(62345, function() {
     log.info('HTTP Server listening on Port 62345');
 });

 //User mit HTTP Server verbunden --> Website liefern
 app.get('/', function(req, res) {
     app.use(express.static('public'));
     res.sendFile(__dirname + '/public/index.html');

     //whitelist einlesen
     users = GetWhitelistUsers();
 });

 //Verbindung zwischen User und HTTP Server steht
 io.on('connection', function(socket) {
     log.info(socket.handshake.address + " connected.");
     //bei connection whitelist an client senden
     log.info("Sending Users to client");
     socket.emit("whitelist", users);


     //wenn ein befehl übermittelt wird
     socket.on('go', function(e) {
         log.info("Client command recieved");
         //wenn debug an ist wird alles per telegram gesendet
         if (e.DebugEnabled) {
             debugUser = users[e.DebugId].TelegramId;
             log.info("Debug Mode enabled by " + debugUser);
             bot.sendMessage(debugUser, actual_date() + "\nESP: " + e.Id + "\nColor: " + " R: " + e.R + " G: " + e.G + " B: " + e.B + "\nMode: " + e.Mode);
         }

         //Log Befehl
         log.info("ESP: " + e.Id + "\tColor: " + " R: " + e.R + " G: " + e.G + " B: " + e.B + "\tMode: " + e.Mode);

         //Send to ESP
         clients[e.Id].write(JSON.stringify(e));

     });

     socket.on('data', function(e) {
         try {
             jsonData = JSON.parse(data);
         } catch (e) {
             log.debug("No JSON received");
         }
         log.debug(jsonData);
     });

     //Verbindung zwischen User und HTTP Server getrennt
     socket.on("disconnect", function(data) {
         log.info("User disconnected from HTTP Server.");
     });

     // Fehler bei der Verbindung
     socket.on("error", function(err) {
         log.error(err);
     });
 });

 //-----------Hilfsfunktionen-------------------
 //Liest die Whitelist ein, wenn noch keine User initialisiert wurden.
 //Gibt ein Array mit den Usern zurück
 function GetWhitelistUsers() {
     var arr = new Array();
     var fs_wl = require("fs");

     if (users !== undefined) {
         log.info("Users already defined");
         return users;
     }

     log.info("No Users defined, read in whitelist...");
     var data = fs_wl.readFileSync('whitelist.csv', {
         encoding: "utf8",
         flag: "r"
     })

     if (data === "")
         log.error(err);

     var lines = data.split(/\r\n|\n/);
     //Erste Zeile enthält lediglich Spezifikation der Daten -> Loop bei 1 Starten!
     for (i = 1; i < lines.length; i++) {
         var userdata = lines[i].split(",");
         var userId = parseInt(userdata[0]);
         var userName = userdata[1];
         var telegramId = userdata[2];
         var tmpUser = new User(userId, userName, telegramId);
         arr.push(tmpUser);
     }
     log.info("Reading Whitelist file completed");
     log.info("" + arr.length + " on the whitelist");

     return arr;
 }

 //gibt die aktuelle Zeit zurück
 function actual_date() {
     var time = new Date();
     var dateString = time.getDate() + "." + (time.getMonth() + 1) + "." + time.getFullYear() +
         " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + "---";

     return dateString;
 }

 //------------Hilfsklassen -------------------

 function User(id, name, telegramId) {
     this.Id = id;
     this.Name = name;
     this.TelegramId = telegramId;

     this.ToString = function() {
         return "User " + this.Name + " has the ID " + this.Id + " and the TelegramID " + this.TelegramId;
     }
 }
