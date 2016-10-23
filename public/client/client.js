var socket = undefined;
var users = undefined;

var currentEsp = undefined;
var currentColor = undefined;
var currentMode = undefined;
var debugEnabled = undefined;
var currentDebugUser = undefined;

$(document).ready(function(){
   
    socket = io();
    
    socket.on("whitelist", function(list){
        users = list;
    });
    
    init();
    
    //Events registrieren
    $("#esps").change(espChanged);
    $("#colorInput").change(colorChanged);
    $("#modes").change(modeChanged);
    $("#debugMode").click(debugChanged);
    $("#debugUser").change(debugUserChanged);
    $("#go").click(submitData);
    
});

//init the website and variables
function init(){
    users = [{Id: 0, Name: "Christian"}, {Id: 1, Name: "Vali"}];
    users.forEach(function(user, index, array){
        $("#debugUser").append("<option value='"+index+"'>"+user.Name+"</option>");    
    });
    
    currentEsp = parseInt($("#esps").val());
    currentColor = $("#colorInput").val();
    currentMode = parseInt($("#modes").val());
    debugMode = false;
    currentDebugUser = users[0];
}

//Event funktionen
function espChanged(event){
    currentEsp = parseInt($("#esps").val());
}

function colorChanged(event){
    currentColor = $("#colorInput").val();
}

function modeChanged(event){
    currentMode = parseInt($("#modes").val());
}

function debugChanged(event){
    debugEnabled = !debugEnabled;
    if(debugEnabled)
        $("#debugUser").show();
    else
        $("#debugUser").hide();
}

function debugUserChanged(event){
    var name = $("#debugUser").val();
    var tmpUser = users[name];
    if(tmpUser !== undefined)
        currentDebugUser = tmpUser;
}

function submitData(event){
    var isValid = (currentEsp !== undefined) && ((currentColor !== undefined) || (currentMode !== undefined));
    
    if(!isValid)
        return;
    
    var esp = new ESP(currentEsp,currentColor,currentMode,debugEnabled);
    socket.emit("go", esp);
    
}
