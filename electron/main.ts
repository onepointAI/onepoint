import { 
  app, 
  BrowserWindow, 
  ipcMain,
} from 'electron'
import { setupStoreHandlers } from './store'
import { Logger } from './util'
import { setWindowVisile } from './window'
import { listen as setupShortcutHandlers } from './shortcuts'
import { listen as setupClipboardHandlers } from './clipboard'
require('./server')

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string
let win: BrowserWindow | null

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
    // win?.webContents.openDevTools({
    //   mode:'bottom'
    // })
  } 
  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  win.on('closed', () => {
    win = null
  })
  win.on("blur", () => {
    setWindowVisile({
      win, 
      visible: false
    })
  });
  registerListeners()  
}

async function registerListeners () {  
  ipcMain.on('message', (_, message) => {
    Logger.log(message)    
  })
  ipcMain.on('win_ignore_mouse', (_, ignore) => {
    win?.setIgnoreMouseEvents(ignore, { forward: true })
  })  
  setupClipboardHandlers(win)
  setupShortcutHandlers(win)
  setupStoreHandlers()
}

app.on('ready', createWindow)
  .whenReady()
  .then()
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
