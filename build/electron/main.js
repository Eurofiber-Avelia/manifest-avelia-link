const { app, BrowserWindow, ipcMain } = require('electron')
const { autoUpdater } = require("electron-updater");
const MainScreen = require("./MainScreen");

//Basic flags
autoUpdater.autoDownload = false;

// Prevent garbage collection
let win;

function createWindow() {
  win = new MainScreen();
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.on("update-start-download", () => {
    win.showMessage("update-start-download");
    let pth = autoUpdater.downloadUpdate();
    win.showMessage(pth);
  })

  ipcMain.on("restart-app", () => {
    autoUpdater.quitAndInstall()
  })
  
  autoUpdater.checkForUpdates();

  return win
})

// Update
autoUpdater.setFeedURL({
  provider: 'github',
  repo: 'avelia-connect',
  owner: 'Eurofiber-Avelia',
  private: true,
  token: "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",
})

autoUpdater.on("update-available", (info) => {
  win.showMessage(`Update available. Current version ${app.getVersion()}`);
  win.updateAvailable();
});

autoUpdater.on("update-not-available", (info) => {
  win.showMessage(`No update available. Current version ${app.getVersion()}`);
});

autoUpdater.on("update-downloaded", (info) => {
   win.showMessage(`Update downloaded. Current version ${app.getVersion()}`);
   win.updateDownloaded();
});

autoUpdater.on("download-progress", (progress) => {
  win.updateDownloadProgress(progress)
})

autoUpdater.on("error", (info) => {
   win.showMessage(info);
});


// Global exception handler
process.on("uncaughtException", function (err) {
  win.showMessage(err)
});

// Gestion pour macOs
app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});