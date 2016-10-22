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

//sonstige variablen
var time;

//wenn sich jemand einloggt Datei zurück senden
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
    console.log(actual_time() + "User connected.");
});

bot.on('message', function (msg) {

});

io.on('connection', function (socket) {
    console.log("user connected");
    socket.on('go', function (e) {
        console.log("ESP: " + e.esp);
        console.log("Color: R: " + e.color.r + ", G: " + e.color.g + ", B: " + e.color.b);
        console.log("Mode: "  + e.mode);
        
        if(e.debug == true){
        bot.sendMessage(valiID, "ESP: " + e.esp + "\n" + "Color: R: " + e.color.r + ", G: " + e.color.g + ", B: " + e.color.b + "\n" + "Mode: "  + e.mode);
        bot.sendMessage(chrisID, "ESP: " + e.esp + "\n" + "Color: R: " + e.color.r + ", G: " + e.color.g + ", B: " + e.color.b + "\n" + "Mode: "  + e.mode);
        }
        
      
    });

});

http.listen(62345, function () {
    console.log('listening on *:62345');
}); 


//gibt die aktuelle Zeit zurück
function actual_time(){
    time = new Date();
    return (time.getDay() + "." + time.getMonth() + "." + time.getFullYear() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + " --- ");
}