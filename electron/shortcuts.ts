import {
  app,
  BrowserWindow,
  ipcMain,
  clipboard,
  globalShortcut,
} from 'electron'

import { getSelection, getRecentApp } from './os'
import { Logger } from './util'
import { setWindowVisile } from './window'
import { Singleton } from "./global"

export function listen(win: BrowserWindow | null) {
  globalShortcut.register('CommandOrControl+k', async () => {
    const visible = win?.isVisible() && win.isFocused()
    if (!visible) {
      try {
        const app = (await getRecentApp()) as string
        Logger.log('appName', app)
        Singleton.getInstance().setRecentApp(app)
        const selection = await getSelection(app)
        Logger.log('selectionTxt', selection)
        setWindowVisile({
          win,
          visible: true,
        })
      } catch (e) {
        setWindowVisile({
          win,
          visible: true,
        })
      }
      return
    }
    setWindowVisile({
      win,
      visible: false,
    })
  })
}
