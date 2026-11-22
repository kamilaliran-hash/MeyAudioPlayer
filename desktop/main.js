// MeyAudioPlayer desktop shell - developer: Kamil
const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const AUDIO = /\.(mp3|m4a|mp4|aac|wav|ogg|oga|opus|flac|webm|wma)$/i;
let win = null;
let pending = [];

function filesFromArgs(argv) {
  return argv.slice(1).filter(a => !a.startsWith('-') && AUDIO.test(a) && fs.existsSync(a));
}
function sendFiles(paths) {
  if (!paths.length) return;
  if (!win || win.webContents.isLoading()) { pending.push(...paths); return; }
  const list = [];
  for (const p of paths) {
    try { list.push({ name: path.basename(p), data: fs.readFileSync(p), mtime: fs.statSync(p).mtimeMs }); }
    catch (e) { /* unreadable file: skip */ }
  }
  win.webContents.send('open-files', list);
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', (_e, argv) => {
    if (win) { if (win.isMinimized()) win.restore(); win.focus(); }
    sendFiles(filesFromArgs(argv));
  });

  app.whenReady().then(() => {
    Menu.setApplicationMenu(null); // the player draws its own menu bar
    win = new BrowserWindow({
      width: 1080, height: 900, minWidth: 640, minHeight: 420,
      title: 'MeyAudioPlayer',
      icon: path.join(__dirname, 'build', 'icon.png'),
      backgroundColor: '#f3f3f3',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        autoplayPolicy: 'no-user-gesture-required'
      }
    });
    win.loadFile(path.join(__dirname, 'app', 'index.html'));
    win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
    win.webContents.on('did-finish-load', () => {
      const first = pending.concat(filesFromArgs(process.argv));
      pending = [];
      sendFiles(first);
    });
    win.on('closed', () => { win = null; });
  });

  app.on('window-all-closed', () => app.quit());
}
