 //variablen zur kommunikation
 var express = require('express');
 var app = express();
 var http = require('http').Server(app);
 var io = require('socket.io')(http);
 var os = require('os');
 var net = require('net');
 var server = undefined;

 //Telegram bot init
 var TelegramBot = require('node-telegram-bot-api');
 var token = '265274462:AAFtbuN6p80ywv0MJ1UJbS51SsZjM4fF854';
 var bot = new TelegramBot(token, {
     polling: true
 });

 //Users
 var debugUser = undefined;
 var users = undefined;

 //ESP Clients
 var clients = new Array();

 //Logger speichern und starten
 var logger = new Logger();
 logger.StartLogging();

 //TCP Server erzeugen!
 server = net.createServer(function (c) {
     clients.push(c);
     logger.LogString("Client connected to TCP Server");
     c.on("end", function () {
         logger.LogString("Client disconnected from TCP Server");
         clients.slice(clients.indexOf(c), 1);
     });
 });

 //TCP Server Fehler
 server.on("error", function (err) {
     logger.LogError(err);
     logger.StopLogging();
 });

 //TCP Server starten
 server.listen(8124, function () {
     logger.LogString("TCP Server listening on Port 8124");
 });

 //HTTP Server starten
 http.listen(62345, function () {
     logger.LogString('HTTP Server listening on Port 62345');
 });

 //User mit HTTP Server verbunden --> Website liefern
 app.get('/', function (req, res) {
     app.use(express.static('public'));
     res.sendFile(__dirname + '/public/index.html');

     //whitelist einlesen
     users = GetWhitelistUsers();
 });

 //Verbindung zwischen User und HTTP Server steht
 io.on('connection', function (socket) {
     logger.LogString(socket.handshake.address + " connected.");

     //bei connection whitelist an client senden
     logger.LogString("Sending Users to client");
     socket.emit("whitelist", users);


     //wenn ein befehl übermittelt wird
     socket.on('go', function (e) {
         logger.LogString("Client command recieved");
         //wenn debug an ist wird alles per telegram gesendet
         if (e.DebugEnabled) {
             debugUser = users[e.DebugId].TelegramId;
             logger.LogString("Debug Mode enabled by " + debugUser);
             bot.sendMessage(debugUser, actual_date() + "\nESP: " + e.Id + "\nColor: " + " R: " + e.R + " G: " + e.G + " B: " + e.B + "\nMode: " + e.Mode);
         }

         //Log Befehl
         logger.LogString("ESP: " + e.Id + "\tColor: " + " R: " + e.R + " G: " + e.G + " B: " + e.B + "\tMode: " + e.Mode);

         //Send to ESP
         clients[e.Id].write(JSON.stringify(e));

     });

     //Verbindung zwischen User und HTTP Server getrennt
     socket.on("disconnect", function (data) {
         logger.LogString("User disconnected from HTTP Server.");
     });

     // Fehler bei der Verbindung
     socket.on("error", function (err) {
         logger.LogError(err);
         logger.StopLogging();
     });
 });

 //passiert wenn man per telegram was schreibt
 //lokale attribute als test
 var local_esp = undefined;
 var local_mode = undefined;
 var local_color = undefined;
 //telegram bot zum steuern
 bot.on('message', function (msg) {
     console.log("Text received: " + msg.text);
     switch (msg.text.toLowerCase()) {
     case 'start':
     case 'restart':
         opts = {
             reply_to_message_id: msg.message_id,
             reply_markup: JSON.stringify({
                 keyboard: [
                         ['Testboard'],
                         ['Valentins Schreibtisch'],
                         ['Vitrine']
                     ]
             })
         };
         bot.sendMessage(msg.chat.id, "Welchen ESP willst du steuern?", opts);
         break;
     case 'testboard':
     case 'valentins schreibtisch':
     case 'vitrine':
         local_esp = msg.text;
         opts = {
             reply_to_message_id: msg.message_id,
             reply_markup: JSON.stringify({
                 keyboard: [
                         ['Color'],
                         ['RandomBlink'],
                         ['PingPongClassic'],
                         ['PingPongRGB'],
                         ['PingPongDouble'],
                         ['RainbowClassic'],
                         ['Restart']
                     ]
             })
         };
         bot.sendMessage(msg.chat.id, "Welchen Modus willst du?", opts);
         break;
     case 'randomblink':
     case 'pingpongclassic':
     case 'Pingpongrgb':
     case 'pingpongdouble':
     case 'rainbowclassic':
         local_mode = msg.text;
         //starten der led
         bot.sendMessage(msg.chat.id, "Gestartet--> ESP: " + local_esp + ", Mode: " + local_mode);
         break;
         //bei auswahl dieser modi ist eine farbe erfordelich
     case 'color':
         local_mode = msg.text;
         opts = {
             reply_to_message_id: msg.message_id,
             reply_markup: JSON.stringify({
                 keyboard: [
                         ['Green'],
                         ['Red'],
                         ['Blue'],
                         ['Restart']
                     ]
             })
         };
         bot.sendMessage(msg.chat.id, "Welche Farbe willst du?", opts);
         break;
     }
 });

 //-----------Hilfsfunktionen-------------------
 //Liest die Whitelist ein, wenn noch keine User initialisiert wurden.
 //Gibt ein Array mit den Usern zurück
 function GetWhitelistUsers() {
     var arr = new Array();
     var fs_wl = require("fs");

     if (users !== undefined) {
         logger.LogString("Users already defined");
         return users;
     }

     logger.LogString("No Users defined, read in whitelist...");
     var data = fs_wl.readFileSync('whitelist.csv', {
         encoding: "utf8",
         flag: "r"
     })

     if (data === "")
         logger.LogError(err);

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
     logger.LogString("Reading Whitelist file completed");
     logger.LogString("" + arr.length + " on the whitelist");

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

     this.ToString = function () {
         return "User " + this.Name + " has the ID " + this.Id + " and the TelegramID " + this.TelegramId;
     }
 }

 function Logger() {
     this.Writer = undefined;
     this.Path = __dirname + "/log/";
     this.FileSystem = require('fs');
     this.FileName = undefined;
     this.StartLogging = function () {
         var today = actual_date(true);
         this.Writer = this.FileSystem.createWriteStream(this.Path + this.GetLogFileName(), {
             flags: 'a'
         });
         this.Writer.open();
         this.Writer.write("--- START ---\r\n");
     }
     this.LogString = function (info) {
         this.Writer.write("[DEBUG]:\t" + info + "\r\n");
     }
     this.LogError = function (err) {
         this.Writer.write("\r\n[ERROR]:\t" + err + "\r\n");
     }
     this.StopLogging = function () {
         this.Writer.write("--- END ---\r\n");
         this.Writer.close();
     }
     this.GetLogFileName = function () {
         if (this.FileName)
             return this.FileName;

         var date = new Date();
         this.FileName = date.getDate() + "_" + date.getMonth() + "_" + date.getFullYear() + ".log";
         return this.FileName;
     }
 }