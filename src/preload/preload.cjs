const { contextBridge, ipcRenderer } = require('electron')

// Everything the renderer is allowed to touch on the OS side lives here.
// Kept intentionally small — the frontend today runs on mock data;
// these calls become real once the monitoring agent (backend) is wired in.
const api = {
  lockDevice: () => ipcRenderer.invoke('spion:lock-device'),
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  }
}

contextBridge.exposeInMainWorld('spion', api)
