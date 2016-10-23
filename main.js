//variablen zur kommunikation
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var os = require('os');

//Telegram bot init
var TelegramBot = require('node-telegram-bot-api');
var token = '265274462:AAFtbuN6p80ywv0MJ1UJbS51SsZjM4fF854';
var bot = new TelegramBot(token, {polling: true});
var valiId = 240395214;
var chrisId = 196173672;
var debugUser = undefined;
var users = undefined;

//log file
var fs = require('fs');
var log_file = fs.createWriteStream(__dirname + '/public/log/debug.log', {flags : 'a'});

//sonstige variablen
var time;

//wenn sich jemand einloggt wird die Website  geliefert
app.get('/', function (req, res) {
    app.use(express.static('public'));
    res.sendFile(__dirname + '/public/index.html');    
    log(os.userInfo().username + " connected.");
    //console.log(os.userInfo());
});


//wenn sich ein user einloggt
io.on('connection', function (socket) {
    //whitelist users aus textdatei einlesen in array speichern und an client schicken
    users = [{Id: 0, Name: "Christian"}, {Id: 1, Name: "Valentin"}];
    socket.emit('whitelist', users);
    
    
    //wenn ein befehl übermittelt wird
    socket.on('go', function (e) {
    console.log(e);
        //wenn debug an ist wird alles per telegram gesendet
        if(e.Debug == true){   
            switch(e.DebugId){
                case 0:
                    debugUser = chrisId;
                    break;
                case 1:
                    debugUser = valiId;
                    break;
            }
            log("debug mode von " + debugUser + " gestartet");
            bot.sendMessage(debugUser, actual_time() + "ESP: " + e.Id + "\n Color: " + e.Color + "\n Mode: "  + e.Mode);        
        }
        
    //!TODO! geloggt und an esp übermittelt wird immer hier
        log("ESP: " + e.Id + "\n Color: " + e.Color + "\n Mode: "  + e.Mode);               
        
    });

});

//node listend auf den port
http.listen(62345, function () {
    log('start listening on *:62345');
}); 


//passiert wenn man per telegram was schreibt
bot.on('message', function (msg) {

});


//console.log methode überschreiben, dass er alles in einer datei speichert
var log = function(d) {
    log_file.open();
    log_file.write(actual_time() + "" + d + "\r\n");       
    log_file.close();
};


//gibt die aktuelle Zeit zurück
function actual_time(){
    time = new Date();
    return (time.getDate() + "." + (time.getMonth() + 1) + "." + time.getFullYear() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + " --- ");
}