const {
    app,
    BrowserWindow
} = require('electron');

console.log(__dirname);
app.on('ready', function() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600
    });

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/public/index.html');

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});
