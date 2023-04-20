import { t } from 'i18next'
import { Tray, Menu, shell, dialog, BrowserWindow } from 'electron'
import path from 'path'
import { setWindowVisile } from '../utils/window'
import { config } from './shortcuts'
import { setting_show } from '../constants/event'

const isProd = process.env.production

function getTrayImagePath() {
  if (isProd) {
    return path.join(process.resourcesPath, 'assets/icon/icon24.png')
  }
  return 'assets/icon/icon24.png'
}

export default (win: BrowserWindow, app: Electron.App) => {
  const tray = new Tray(getTrayImagePath())
  const contextMenu = Menu.buildFromTemplate([
    {
      label: t('Feedback'),
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
  // TODO: did not show Tray after package
  tray.setToolTip(t('onepoint | more than just chat'))
  tray.setContextMenu(contextMenu)
}
