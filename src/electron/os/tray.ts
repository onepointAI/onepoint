import { Tray, Menu, shell, dialog, BrowserWindow, ipcMain } from 'electron'
import i18n, { t } from 'i18next'
import path from 'path'
import { config } from './shortcuts'
import { setWindowVisile } from '../utils/window'
import common from '../constants/common'
import { setting_show, changeLanguage } from '../constants/event'
import { Languages, localeOptions } from '../../i18n'
import pkg from '../../../package.json'

function getTrayImagePath() {
  if (common.production()) {
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
        role: 'quit',
        label: t('exit'),
      },
      {
        label: t('reload'),
        click() {
          app.relaunch()
          app.quit()
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
            detail: t('Version:') + pkg.version,
          })
        },
      },
    ])
  }

  const tray = new Tray(getTrayImagePath())
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
