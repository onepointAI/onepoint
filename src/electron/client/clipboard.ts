import { IpcMainInvokeEvent, ipcMain, BrowserWindow, clipboard } from 'electron'
import { Logger } from '../utils/util'
import { Singleton } from '../utils/global'
import { activeApp, applySelection } from '../os/applescript'
import { copyText, attemptChange } from '../constants/event'

const clipboardWatcher = require('electron-clipboard-watcher')

export function listen(_win: BrowserWindow | null) {
  clipboardWatcher({
    watchDelay: 200,
    onImageChange() {},
    onTextChange(_text: string) {
      if (Singleton.getInstance().getCopyFromElectron()) {
        Singleton.getInstance().setCopyStateSource(false)
      }
      // TODO: Pop-up notifications for clipboard content changes are unnecessary and can have a significant impact on user experience.
      // setWindowVisile(true)
      // win?.webContents.send(clipboard_change, text)
    },
  })

  ipcMain.handle(
    copyText,
    async (event: IpcMainInvokeEvent, changes: string) => {
      try {
        clipboard.writeText(changes)
        return true
      } catch (e) {
        Logger.error(e)
        return false
      }
    }
  )

  ipcMain.handle(
    attemptChange,
    async (event: IpcMainInvokeEvent, changes: string) => {
      try {
        clipboard.writeText(changes)
        await activeApp(Singleton.getInstance().getRecentApp())
        await applySelection()
      } catch (e) {
        Logger.error(e)
      }
    }
  )
}
