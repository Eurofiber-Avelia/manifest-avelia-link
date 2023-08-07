const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");

class MainScreen {
  window;

  url = {
    dev: process.env.ELECTRON_START_URL,
    prod: (new URL('file://' + path.join(__dirname, '../../index.html'))).href,
  }

  position = {
    minWidth: 416,
    minHeight: 800,
    maximized: false,
  };

  constructor() {
    this.window = new BrowserWindow({
      minWidth: this.position.minWidth,
      minHeight: this.position.minHeight,
      removeMenu: true,
      acceptFirstMouse: true,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true, // is default value after Electron v5
        contextIsolation: true, // protect against prototype pollution
        enableRemoteModule: false, // turn off remote
        preload: path.join(__dirname, "./preload.js"),
      },
    });
    
    this.showMessage(this.url.prod)

    this.window.once("ready-to-show", () => {
      this.window.show();

      if (this.position.maximized) {
        this.window.maximize();
      }
    });

    //Ipc functions go here.
    this.handleMessages();

    // to open devtools at start
    // this.window.webContents.openDevTools();
    
    this.window.loadURL(this.getStartUrl());
  }

  showMessage(message) {
    this.window.webContents.send("show-message", message);
  }

  updateAvailable() {
    this.window.webContents.send("update-available");
  }

  updateStartDownload() {
    this.window.webContents.send("update-start-download");
  }

  updateNotAvailable() {
    this.window.webContents.send("update-not-available");
  }

  updateDownloaded() {
    this.window.webContents.send("update-downloaded");
  }

  updateDownloadProgress(progress) {
    this.window.webContents.send("download-progress", progress);
  }

  updateError() {
    this.window.webContents.send("update-error");
  }

  close() {
    this.window.close();
    ipcMain.removeAllListeners();
  }

  hide() {
    this.window.hide();
  }

  getStartUrl() {
    return this.url.dev || this.url.prod;
  }

  handleMessages() {

  }
}

module.exports = MainScreen;