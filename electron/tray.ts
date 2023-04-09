import { Tray, Menu, shell, dialog, BrowserWindow } from 'electron'
import { setWindowVisile } from './window'
import { config } from './shortcuts'

export default (win: BrowserWindow) => {
  const tray = new Tray('assets/icon/icon24.png')
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
