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
      // TODO: 粘贴板内容变化弹窗，感觉没必要保留，会对用户体验造成非常大的影响
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
        const result = await applySelection()
        Logger.log('应用改变:', result)
      } catch (e) {
        Logger.error(e)
      }
    }
  )
}
