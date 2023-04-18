import { app, BrowserWindow, ipcMain } from 'electron'
import { PresetType } from '../src/@types'

import { Logger } from './utils/util'
import initLog from './utils/log'
import { Singleton } from './utils/global'
import { setWindowVisile } from './utils/window'

import { listen as setupClipboardHandlers } from './client/clipboard'
import { setupStoreHandlers, init as initStore } from './client/store'
import { setupLinkHandlers } from './client/link'
import { setupSoundHandlers } from './sound'

import initTray from './os/tray'
import { listen as setupShortcutHandlers } from './os/shortcuts'

require('./server')

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string
const userLog = initLog()
let win: BrowserWindow | null

function initWindow() {
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
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      // enableRemoteModule: true,
      // preload: path.join(__static, "preload.js")
    },
  })

  // win.setPosition(3000, 2000)
  if (!app.isPackaged) {
    win?.webContents.openDevTools({
      mode: 'bottom',
    })
  }
  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  win.on('closed', () => {
    win = null
  })
  win.on('blur', () => {
    setWindowVisile({
      win,
      visible: false,
    })
  })
  app.dock.hide()
  initStore()
  registerListeners()
}

async function registerListeners() {
  ipcMain.on('message', (_, message) => {
    Logger.log(message)
  })
  ipcMain.on('winIgnoreMouse', (_, ignore) => {
    win?.setIgnoreMouseEvents(ignore, { forward: true })
  })
  ipcMain.on('usePreset', (_, preset: PresetType) => {
    Singleton.getInstance().setCurPreset(preset)
  })
  setupClipboardHandlers(win)
  setupShortcutHandlers(win)
  setupSoundHandlers()
  setupStoreHandlers()
  setupLinkHandlers()
}

app
  .on('ready', initWindow)
  .whenReady()
  .then(() => win && initTray(win))
  .catch(e => {
    console.error(e)
    userLog.error(e)
  })

app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  app.quit()
  // }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    initWindow()
  }
})
