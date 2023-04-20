import { app, BrowserWindow, ipcMain } from 'electron'
import Store from 'electron-store'
import { PresetType } from '../@types'

import initLog from './utils/log'
import { Singleton } from './utils/global'
import { setWindowVisile } from './utils/window'

import { listen as setupClipboardHandlers } from './client/clipboard'
import { setupStoreHandlers, init as initStore } from './client/store'
import { setupLinkHandlers } from './client/link'
import { setupWindowHandlers } from './client/window'
import { setupSoundHandlers } from './sound'
import initTray from './os/tray'
import { listen as setupShortcutHandlers } from './os/shortcuts'

import { StoreKey } from '../app/constants'
import { init as initI18n, Languages } from '../i18n'
require('./server')

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string
const userLog = initLog()
const store = new Store()
let win: BrowserWindow | null

function initWindow() {
  win = new BrowserWindow({
    resizable: false,
    width: 800,
    // TODO: autosize height
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
    },
  })

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
  app.dock?.hide()
  initI18n(store.get(StoreKey.Set_Lng) as Languages)
  initStore()
  registerListeners()
}

async function registerListeners() {
  ipcMain.on('usePreset', (_, preset: PresetType) => {
    Singleton.getInstance().setCurPreset(preset)
  })
  setupWindowHandlers(win)
  setupClipboardHandlers(win)
  setupShortcutHandlers(win)
  setupSoundHandlers()
  setupStoreHandlers()
  setupLinkHandlers()
}

app
  .on('ready', initWindow)
  .whenReady()
  .then(() => win && initTray(win, app))
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
