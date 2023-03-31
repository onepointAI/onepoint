import { app, BrowserWindow, ipcMain, clipboard, globalShortcut } from 'electron'
const clipboardWatcher = require('electron-clipboard-watcher')
// const {
//   mouse
// } = require("@nut-tree/nut-js");

let win: BrowserWindow | null
let copyFromElectron: boolean = false
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// console.info(process.versions)
// console.info(nodeAbi.getApi());
// const assetsPath =
//   process.env.NODE_ENV === 'production'
//     ? process.resourcesPath
//     : app.getAppPath()

function createWindow () {
  win = new BrowserWindow({
    height: 600,
    useContentSize: true,
    resizable: true,
    width: 800,
    frame: false,
    show: true,
    transparent: true,
    skipTaskbar: true,
    webPreferences: {
      webSecurity: false,      
      backgroundThrottling: false,
      contextIsolation: true,
      webviewTag: true,
      nodeIntegration: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
      // enableRemoteModule: true,
      // preload: path.join(__static, "preload.js")
    }
  })
  if(process.env.NODE_ENV !== 'production' && false) {
    win?.webContents.openDevTools({
      mode:'bottom'
    })
  }  
  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  win.on('closed', () => {
    win = null
  })
  win.on("blur", () => {
    setWindowVisile(false)
  });
}

const setWindowVisile = (visible ?: boolean) => {
  if(!visible) {
    win?.hide()
    win?.blur()
    return 
  } 
  // win?.setAlwaysOnTop(true)
  win?.setVisibleOnAllWorkspaces(true, { 
    visibleOnFullScreen: true 
  })
  win?.focus()
  win?.show()
}


async function registerListeners () {
  /**
   * This comes from bridge integration, check bridge.ts
   */
  ipcMain.on('message', (_, message) => {
    console.log(message)    
  })
  
  clipboardWatcher({
    // (optional) delay in ms between polls
    watchDelay: 200,
  
    // handler for when image data is copied into the clipboard
    onImageChange () {  },

    // handler for when text data is copied into the clipboard
    onTextChange (text: string) {
      if(!copyFromElectron) {
        console.log('text changed:', text)
        setWindowVisile(true)
      }
      win?.webContents.send('copyText', text);
    }
  })

  globalShortcut.register('CommandOrControl+k', () => {    
    const visible = win?.isVisible() && win.isFocused();
    console.log('window visible ==>', visible);
    setWindowVisile(!visible)
  })
}

app.on('ready', createWindow)
  .whenReady()
  .then(registerListeners)
  .catch(e => console.error(e))

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
