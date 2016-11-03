//variablen zur kommunikation
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var os = require('os');
var net = require('net');

//Telegram bot init
var TelegramBot = require('node-telegram-bot-api');
var token = '265274462:AAFtbuN6p80ywv0MJ1UJbS51SsZjM4fF854';
var bot = new TelegramBot(token, {polling: true});

//Users
var debugUser = undefined;
var users = [];

//log file
var fs = require('fs');
//fs whitelist
var fs_wl = require('fs');
var log_file;

//sonstige variablen
var time;

//wenn sich jemand einloggt wird die Website  geliefert
app.get('/', function (req, res) {
    app.use(express.static('public'));
    res.sendFile(__dirname + '/public/index.html');
});


//wenn sich ein user einloggt
io.on('connection', function (socket) {
    log(os.userInfo().username + " connected.");
    //whitelist users aus textdatei einlesen in array speichern und an client schicken
        log("No Users defined, read in whitelist...");
        
        fs_wl.readFile('whitelist.csv', {encoding: "utf8", flag: "r"}, function(err,data){
            if(err)
                log(err);

            var lines = data.split(/\r\n|\n/);
            //Erste Zeile enthält lediglich Spezifikation der Daten -> Loop bei 1 Starten!
            for(i=1;i<lines.length;i++){
                var userdata = lines[i].split(",");
                var userId = parseInt(userdata[0]);
                var userName = userdata[1];
                var telegramId = userdata[2];
                var tmpUser = new User(userId,userName,telegramId);
                users.push(tmpUser);
            }
            log("Reading Whitelist file completed");
            log(""+users.length+" on the whitelist");

        });

    if(users != undefined){
        log("Sending Users to client");
        socket.emit("whitelist",users);
    }
    //wenn ein befehl übermittelt wird
    socket.on('go', function(e) {
        log("Client command recieved");
        //wenn debug an ist wird alles per telegram gesendet
        if(e.DebugEnabled)
        {
            debugUser = users[e.DebugId].TelegramId;
            log("Debug Mode enabled by "+debugUser);
            bot.sendMessage(debugUser, actual_time() + "\nESP: " + e.Id + "\nColor: " + " R: " + e.Color.R+ " G: " + e.Color.G+ " B: " + e.Color.B + "\nMode: "  + e.Mode);
        }

        //!TODO! geloggt und an esp übermittelt wird immer hier

        log("\tESP: " + e.Id + "\tColor: " + " R: " + e.Color.R+ " G: " + e.Color.G+ " B: " + e.Color.B + "\tMode: "  + e.Mode);
        var client = new net.Socket();
        client.connect(8080, '192.168.0.66', function() {
	         console.log('Connected');
	          client.write('Hello, server! Love, Client.');
        });
    });

    socket.on("disconnect", function(data){
        log(os.userInfo().username + " disconnected.");
    });

    socket.on("error", function(err){
        log("[ERROR]: "+err);
    });
});

//node listend auf den port
http.listen(62345, function () {
    log('start listening on *:62345');
});

//passiert wenn man per telegram was schreibt
bot.on('message', function (msg) {
    log("Telegram Message from " + msg.from.id + ": " + msg.text);
});

//console.log methode überschreiben, dass er alles in einer datei speichert
var log = function(d) {
    log_file = fs.createWriteStream(__dirname + '/public/log/debug_' + (new Date().getDate()) + "_" + (new Date().getMonth() + 1) + '.log', {flags : 'a'});
    log_file.open();
    log_file.write(actual_time() + "" + d + "\r\n");
    log_file.close();
};

//gibt die aktuelle Zeit zurück
function actual_time(){
    time = new Date();
    return (time.getDate() + "." + (time.getMonth() + 1) + "." + time.getFullYear() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + " --- ");
}

function User(id,name,telegramId){
    this.Id = id;
    this.Name = name;
    this.TelegramId = telegramId;

    this.ToString = function(){
        return "User "+this.Name+" has the ID "+this.Id+" and the TelegramID "+this.TelegramId;
    }
}
