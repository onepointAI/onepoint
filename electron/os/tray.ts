import { Tray, Menu, shell, dialog, BrowserWindow } from 'electron'
import { setWindowVisile } from '../utils/window'
import { config } from './shortcuts'
import path from 'node:path'

const isProd = process.env.production

function getTrayImagePath() {
  if (isProd) {
    return path.join(process.resourcesPath, 'assets/icon/icon24.png')
  }
  return 'assets/icon/icon24.png'
}

export default (win: BrowserWindow) => {
  const tray = new Tray(getTrayImagePath())
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Feedback',
      click: () => {
        process.nextTick(() => {
          shell.openExternal('https://github.com/onepointAI/onepoint/issues')
        })
      },
    },
    { type: 'separator' },
    {
      label: 'Display Window',
      accelerator: config.shortCut.showAndHidden,
      click: () => {
        setWindowVisile({
          win,
          visible: true,
        })
      },
    },
    {
      label: 'Settings',
      click: () => {
        win?.webContents.send('setting_show')
        setWindowVisile({
          win,
          visible: true,
        })
      },
    },
    { type: 'separator' },
    {
      label: 'About',
      click() {
        dialog.showMessageBox({
          title: 'onepoint',
          message:
            'More than just chat. Write, read, and code with powerful AI anywhere.',
          detail: `Version: beta 0.1.0`,
        })
      },
    },
  ])
  tray.setToolTip('onepoint | more than just chat')
  tray.setContextMenu(contextMenu)
}
