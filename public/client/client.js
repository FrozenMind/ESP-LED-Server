var socket = undefined;
var users = undefined;
var currentEsp = undefined;
var currentColor = undefined;
var currentMode = undefined;

$(document).ready(function() {
    socket = io();
    //click event for submit button
    $("#go").click(submitData);
});

function submitData(event) {
    //check if values arent undefined this cant be possible but save is save
    collectData();
    if ((currentEsp == undefined) && (currentColor == undefined) || (currentMode == undefined))
        return;
    var esp = new ESP(currentEsp, currentColor, currentMode);
    socket.emit("go", esp);
}

//collect data to send to esp
function collectData() {
    currentEsp = parseInt($("#esps").val());
    currentColor = hexToRGBColor($("#colorInput").val());
    currentMode = parseInt($("#modes").val());
}

//convert hex value into RGB Color
function hexToRGBColor(hex) {
    return {
        R: parseInt(hex.substring(1, 3), 16),
        G: parseInt(hex.substring(3, 5), 16),
        B: parseInt(hex.substring(5, 7), 16)
    };
}
