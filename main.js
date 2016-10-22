//variablen zur kommunikation
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var os = require('os');

//Telegram bot init
var TelegramBot = require('node-telegram-bot-api');
var token = '265274462:AAFtbuN6p80ywv0MJ1UJbS51SsZjM4fF854';
var bot = new TelegramBot(token, {polling: true});
var valiID = 240395214;
var chrisID = 196173672;

//log file
var fs = require('fs');
var log_file = fs.createWriteStream(__dirname + '/public/log/debug.log', {flags : 'a'});

//sonstige variablen
var time;

//wenn sich jemand einloggt wird die Website  geliefert
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');    
    log(os.userInfo().username + " connected.");
    console.log(os.userInfo());
});


//wenn sich ein user einloggt
io.on('connection', function (socket) {
    
    //wenn eine nachricht übermittelt wird
    socket.on('go', function (e) {
   //wenn debug an ist wird alles per telegram gesendet
        if(e.debug == true){   
            log("debug mode von " + e.debugID + " gestartet");
            bot.sendMessage(e.debugID, actual_time() + "\nESP: " + e.id + "\n" + "Color: R: " + e.color.r + ", G: " + e.color.g + ", B: " + e.color.b + "\n" + "Mode: "  + e.mode);        
        }
        
    //!TODO! geloggt und an esp übermittelt wird immer hier
        log(e.debugID, actual_time() + "\nESP: " + e.id + "\n" + "Color: R: " + e.color.r + ", G: " + e.color.g + ", B: " + e.color.b + "\n" + "Mode: "  + e.mode);               
        
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