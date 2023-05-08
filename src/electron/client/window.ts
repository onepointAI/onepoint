import { BrowserWindow, ipcMain } from 'electron'
import { winIgnoreMouse, winMouseMove, setWinSize } from '../constants/event'

export function setupWindowHandlers(win: BrowserWindow | null) {
  ipcMain.on(winIgnoreMouse, (_, ignore) => {
    win?.setIgnoreMouseEvents(ignore, { forward: true })
  })

  ipcMain.on(winMouseMove, (_, pos) => {
    win?.setPosition(pos.posX, pos.posY)
  })

  ipcMain.on(setWinSize, (_, size) => {
    console.log('???win', size)
    win?.setSize(size.w, size.h)
  })
}
