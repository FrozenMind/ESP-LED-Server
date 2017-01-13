var socket = undefined;
var users = undefined;
var currentEsp = undefined;
var currentColor = undefined;
var currentMode = undefined;

$(document).ready(function() {
    socket = io();
    //Events registrieren
    $("#esps").change(espChanged);
    $("#colorInput").change(colorChanged);
    $("#modes").change(modeChanged);
    $("#go").click(submitData);
});

function submitData(event) {
    //check if values arent undefined this cant be possible but save is save
    if ((currentEsp !== undefined) && (currentColor !== undefined) || (currentMode !== undefined)) {
        return;
    }
    var esp = new ESP(currentEsp, currentColor, currentMode);
    collectData();
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
    var r = parseInt(hex.substring(1, 3), 16);
    var g = parseInt(hex.substring(3, 5), 16);
    var b = parseInt(hex.substring(5, 7), 16);
    return {
        R: r,
        G: g,
        B: b
    };
}
