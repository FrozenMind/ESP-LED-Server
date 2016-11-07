 //variablen zur kommunikation
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var os = require('os');
var net = require('net');
var server = undefined;
var clients = [];

//Telegram bot init
var TelegramBot = require('node-telegram-bot-api');
var token = '265274462:AAFtbuN6p80ywv0MJ1UJbS51SsZjM4fF854';
var bot = new TelegramBot(token, {polling: true});

//Users
var debugUser = undefined;
var users = [];

//Logger speichern und starten
var logger = new Logger();
logger.StartLogging();

//fs whitelist
var fs_wl = require('fs');

//sonstige variablen
var time;

createTCPServer()

function createTCPServer(){
    server = net.createServer(function(c) 
    {
        clients.push(c);
        logger.LogString("Client connected to TCP Server");
        c.on("end", function()
        {
            logger.LogString("Client disconnected from TCP Server");
            clients.slice(clients.indexOf(c),1);
        });
    });
}

server.on("error", function(err){
    logger.LogError(err);
    logger.StopLogging();
});

server.listen(8124, function(){
    logger.LogString("TCP Server listening on Port 8124");
});

//wenn sich jemand einloggt wird die Website  geliefert
app.get('/', function (req, res) {
    app.use(express.static('public'));
    res.sendFile(__dirname + '/public/index.html');

    //whitelist einlesen
    if(users.length == 0){
    logger.LogString("No Users defined, read in whitelist...");
        fs_wl.readFile('whitelist.csv', {encoding: "utf8", flag: "r"}, function(err,data){
            if(err)
                logger.LogError(err);

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
            logger.LogString("Reading Whitelist file completed");
            logger.LogString(""+users.length+" on the whitelist");
        });
    }
});


//wenn sich ein user einloggt
io.on('connection', function (socket) {
    logger.LogString(socket.handshake.address + " connected.");

    //bei connection whitelist an client senden
    logger.LogString("Sending Users to client");
    socket.emit("whitelist", users);


    //wenn ein befehl übermittelt wird
    socket.on('go', function(e) {
        logger.LogString("Client command recieved");
        //wenn debug an ist wird alles per telegram gesendet
        if(e.DebugEnabled)
        {
            debugUser = users[e.DebugId].TelegramId;
            logger.LogString("Debug Mode enabled by "+debugUser);
            bot.sendMessage(debugUser, actual_date() + "\nESP: " + e.Id + "\nColor: " + " R: " + e.Color.R+ " G: " + e.Color.G+ " B: " + e.Color.B + "\nMode: "  + e.Mode);
        }

        //Log Befehl
        logger.LogString("ESP: " + e.Id + "\tColor: " + " R: " + e.Color.R+ " G: " + e.Color.G+ " B: " + e.Color.B + "\tMode: "  + e.Mode);
        
        //Send to ESP
        clients[e.Id].write(""+e.Color.R+","+e.Color.G+","+e.Color.B+";"+e.Mode);
        
    });

    socket.on("disconnect", function(data){
        logger.LogString("User disconnected from HTTP Server.");
    });

    socket.on("error", function(err){
        logger.LogError(err);
        logger.StopLogging();
    });
});

//node listend auf den port
http.listen(62345, function () {
    logger.LogString('HTTP Server listening on Port 62345');
});

//passiert wenn man per telegram was schreibt
bot.on('message', function (msg) {
    logger.LogString("Telegram Message from " + msg.from.id + ": " + msg.text);
});


//gibt die aktuelle Zeit zurück
function actual_date(){
    time = new Date();
    var dateString = time.getDate() + "." + (time.getMonth() + 1) + "." + time.getFullYear() + 
        " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()+ "---";
    
    return dateString;
}

function User(id,name,telegramId)
{
    this.Id = id;
    this.Name = name;
    this.TelegramId = telegramId;

    this.ToString = function(){
        return "User "+this.Name+" has the ID "+this.Id+" and the TelegramID "+this.TelegramId;
    }
}

function Logger()
{
    this.Writer = undefined;
    this.Path = __dirname + "/log/";
    this.FileSystem = require('fs');
    this.FileName = undefined;
    this.StartLogging = function()
    {
        var today = actual_date(true);
        this.Writer = this.FileSystem.createWriteStream(this.Path +this.GetLogFileName(), {flags: 'a'});
        this.Writer.open();
        this.Writer.write("--- START ---\r\n");
    }
    this.LogString = function(info){
        //this.Writer.access(this.Path, this.FileSystem.constants.R_OK | this.FileSystem.constants.F_OK, function(err){
          //  console.log(err ? 'no access!' : 'can read/write');
            //return;
        //});
        this.Writer.write("[DEBUG]:\t"+info+"\r\n");
    }
    this.LogError = function(err){
        //this.Writer.access(this.Path, this.FileSystem.constants.R_OK | this.FileSystem.constants.F_OK, function(err){
            //console.log(err ? 'no access!' : 'can read/write');
          //  return;
        //});
        this.Writer.write("\r\n[ERROR]:\t"+err+ "\r\n");
    }
    this.StopLogging = function(){
        this.Writer.write("--- END ---\r\n");
        this.Writer.close();
    }
    this.GetLogFileName = function(){
        if(this.FileName)
            return this.FileName;
        
        var date = new Date();
        this.FileName = date.getDate()+"_"+date.getMonth()+"_"+date.getYear()+".log";
        return this.FileName;
    }
}
