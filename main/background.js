import { app } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
const electron = require('electron')
const globalShortcut = electron.globalShortcut
const os = require('os')
const path = require('path')
import { initDb } from '../app/model'

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();
  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });
  mainWindow.webContents.openDevTools();
  console.log("hellooo")
  const port = process.argv[2];
  initDb(app.getPath('userData'), mainWindow.loadURL(`http://localhost:${port}/home`))

})();

app.on('window-all-closed', () => {
  app.quit();
});
