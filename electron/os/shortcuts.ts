import os from 'os'
import { BrowserWindow, globalShortcut, clipboard } from 'electron'
import { getRecentApp, getSelection, getBrowserUrl } from './applescript'
import { BuiltInPlugins } from '../../src/app/constants'
import { Logger } from '../utils/util'
import { setWindowVisile } from '../utils/window'
import { Singleton } from '../utils/global'
import { selection_change, url_change } from '../constants/event'

export const config = {
  shortCut: {
    showAndHidden: 'CommandOrControl+k',
  },
}

function setApp() {
  /* eslint-disable no-async-promise-executor */
  return new Promise<string>(async (resolve, reject) => {
    try {
      const app = (await getRecentApp()) as string
      Logger.log('appName', app)
      Singleton.getInstance().setRecentApp(app)
      resolve(app)
    } catch (e) {
      reject(e)
    }
  })
}

export function listen(win: BrowserWindow | null) {
  globalShortcut.register(config.shortCut.showAndHidden, async () => {
    const visible = win?.isVisible() && win.isFocused()
    if (!visible) {
      try {
        if (os.platform() !== 'darwin') {
          throw new Error('Only support macOS')
        }
        const preset = Singleton.getInstance().getCurPreset()
        const plugin = BuiltInPlugins.filter(plugin => plugin.title === preset)
        const app = await setApp()
        if (plugin.length > 0) {
          const usePlugin = plugin[0]
          if (usePlugin.monitorClipboard) {
            const clipboardContent = clipboard.readText()
            const selection = await getSelection()
            Logger.log('selectionTxt =>', selection)
            win?.webContents.send(selection_change, {
              txt: selection,
              app,
            })
            clipboard.writeText(clipboardContent)
          } else if (usePlugin.monitorBrowser) {
            const url = await getBrowserUrl(app)
            win?.webContents.send(url_change, {
              url,
            })
          }
        }

        setWindowVisile({
          win,
          visible: true,
        })
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
