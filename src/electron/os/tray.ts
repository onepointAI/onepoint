import { Tray, Menu, shell, dialog, BrowserWindow, ipcMain } from 'electron'
import i18n, { t } from 'i18next'
import path from 'path'
import { setWindowVisile } from '../utils/window'
import { config } from './shortcuts'
import { setting_show, changeLanguage } from '../constants/event'
import { Languages, localeOptions } from '../../i18n'
const isProd = process.env.production

function getTrayImagePath() {
  if (isProd) {
    return path.join(process.resourcesPath, 'assets/icon/icon24.png')
  }
  return 'assets/icon/icon24.png'
}

export default (win: BrowserWindow, app: Electron.App) => {
  const getMenuTemplate = () => {
    return Menu.buildFromTemplate([
      {
        label: t('Feedback & Help'),
        click: () => {
          process.nextTick(() => {
            shell.openExternal('https://github.com/onepointAI/onepoint/issues')
          })
        },
      },
      { type: 'separator' },
      {
        label: t('Display Window'),
        accelerator: config.shortCut.showAndHidden,
        click: () => {
          setWindowVisile({
            win,
            visible: true,
          })
        },
      },
      {
        label: t('Settings'),
        click: () => {
          win?.webContents.send(setting_show)
          setWindowVisile({
            win,
            visible: true,
          })
        },
      },
      { type: 'separator' },
      {
        label: t('About'),
        click() {
          dialog.showMessageBox({
            title: t('onepoint'),
            message: t(
              'More than just chat. Write, read, and code with powerful AI anywhere.'
            ),
            detail: t(`Version:`) + 'beta 0.1.0',
          })
        },
      },
      { type: 'separator' },
      {
        label: t('exit'),
        click() {
          app.quit()
        },
      },
    ])
  }

  const tray = new Tray(getTrayImagePath())
  // TODO: did not show Tray after package
  const buildMenu = () => {
    const contextMenu = getMenuTemplate()
    tray.setToolTip(t('onepoint | more than just chat'))
    tray.setContextMenu(contextMenu)
  }

  buildMenu()

  ipcMain.on(changeLanguage, (_, lng: Languages) => {
    i18n.changeLanguage(localeOptions[lng])
    buildMenu()
  })
}
