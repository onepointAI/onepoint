import { 
  app, 
  BrowserWindow, 
  ipcMain, 
  clipboard, 
  globalShortcut 
} from 'electron'
// import { chat } from './chat'

require('./server')

const clipboardWatcher = require('electron-clipboard-watcher')

let win: BrowserWindow | null
let copyFromElectron: boolean = false
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

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

function createWindow () {
  win = new BrowserWindow({    
    // useContentSize: true,
    resizable: false,
    width: 800,
    height: 600,
    frame: false,
    show: true,
    transparent: true,
    backgroundColor: '#00000000',
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
  if(process.env.NODE_ENV !== 'production') {
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
  // win.setIgnoreMouseEvents(true, { forward: true })
}

async function registerListeners () {
  ipcMain.on('message', (_, message) => {
    console.log(message)    
  })
  ipcMain.on('win_ignore_mouse', (_, ignore) => {
    win?.setIgnoreMouseEvents(ignore, { forward: true })
  })
  
  clipboardWatcher({
    // (optional) delay in ms between polls
    watchDelay: 200,
    // handler for when image data is copied into the clipboard
    onImageChange () {  },
    // handler for when text data is copied into the clipboard
    onTextChange (text: string) {
      // if(!copyFromElectron) {
      //   console.log('text changed:', text)
      //   setWindowVisile(true)
      // }
      win?.webContents.send('clipboard_change', text);
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
