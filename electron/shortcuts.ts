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
        // 每次获取完后需要清空一下剪切板，否则判断会有问题
        const selection = await getSelection()
        Logger.log('selectionTxt', selection)        
        win?.webContents.send('selection_change', {
          txt: selection,
          app
        })
        setWindowVisile({
          win,
          visible: true,
        })
        clipboard.writeText('')
      } catch (e) {
        Logger.error(e)
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
