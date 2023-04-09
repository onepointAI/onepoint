import { Tray, Menu, shell, dialog } from 'electron'
import { config } from './shortcuts'

export default () => {
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
    { label: 'Display Window', accelerator: config.shortCut.showAndHidden },
    { label: 'Settings' },
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
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
}
