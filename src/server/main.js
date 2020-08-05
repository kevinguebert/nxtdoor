// eslint-disable-next-line import/no-extraneous-dependencies
const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const { is } = require('electron-util');

const path = require('path');
const Store = require('electron-store');
const cron = require('node-cron');

const TrayGenerator = require('./TrayGenerator');
const Nxtdoor = require('./Nxtdoor');

let mainWindow = null;

const schema = {
  launchAtStart: true,
  counterValue: 0
};

const store = new Store(schema);

cron.schedule('* * * * *', () => {
  const notification = new Notification({
    title: "hello from nextdoor",
    subtitle: "subtitle",
    body: "The bodddy",
    hasReply: true
  });
  notification.onclick = () => {
    console.log('Notification clicked')
  }
  notification.show();
  const nxtdoor = new Nxtdoor();
  nxtdoor.search();
});


const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    backgroundColor: '#FFF',
    width: 300,
    height: 150,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    webPreferences: {
      devTools: is.development,
      nodeIntegration: true,
      backgroundThrottling: false
    }
  });

  if (is.development) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadURL(`file://${path.join(__dirname, '../../build/index.html')}`);
  }
  console.log('#### Broswing Nextdoor ####');
  const notification = new Notification({
    title: "hello from nextdoor",
    subtitle: "subtitle",
    body: "The bodddy",
    hasReply: true
  });
  notification.onclick = () => {
    console.log('Notification clicked')
  }
  notification.show();
  // init();
};

app.on('ready', () => {
  createMainWindow();
  const Tray = new TrayGenerator(mainWindow, store);
  Tray.createTray();



  ipcMain.on('COUNTER_UPDATED', (event, data) => {
    store.set('counterValue', data);
  })

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('INITIALIZE_COUNTER', store.get('counterValue'));
  })
});

app.setLoginItemSettings({
  openAtLogin: store.get('launchAtStart'),
});

app.dock.hide();
