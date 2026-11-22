const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('mapNative', {
  platform: 'windows',
  onOpenFiles: cb => ipcRenderer.on('open-files', (_e, list) => cb(list))
});
