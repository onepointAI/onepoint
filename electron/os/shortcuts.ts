import { BrowserWindow, globalShortcut } from 'electron'
import { clipboard } from 'electron'
import { getRecentApp, getSelection, getBrowserUrl } from './applescript'
import { Logger } from '../utils/util'
import { setWindowVisile } from '../utils/window'
import { Singleton } from '../utils/global'
import { BuiltInPlugins } from '../../src/app/constants'

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
        const preset = Singleton.getInstance().getCurPreset()
        const plugin = BuiltInPlugins.filter(plugin => plugin.title === preset)
        const app = await setApp()
        if (plugin.length > 0) {
          const usePlugin = plugin[0]
          if (usePlugin.monitorClipboard) {
            const clipboardContent = clipboard.readText()
            // 每次获取完后需要清空一下剪切板，否则判断会有问题
            const selection = await getSelection()
            // const app = await setApp()
            Logger.log('selectionTxt =>', selection)
            win?.webContents.send('selection_change', {
              txt: selection,
              app,
            })
            clipboard.writeText(clipboardContent)
          } else if (usePlugin.monitorBrowser) {
            // const app = await setApp()
            const url = await getBrowserUrl(app)
            Logger.log('current url =>', url)
            win?.webContents.send('url_change', {
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
