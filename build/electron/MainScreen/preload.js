const { contextBridge, ipcRenderer } = require('electron')

// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  "api", {
    send: (channel, data) => {
      // whitelist channels
      let validChannels = [
        "update-start-download",
        "restart-app",
      ];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      let validChannels = [
        "show-message",
        "download-progress",
        "update-available", 
        "update-downloaded",
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on(channel, (event, ...args) => {
          return func(...args)
        })
      }
    }
  }
);
