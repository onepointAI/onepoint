import { BrowserWindow, ipcMain } from 'electron'
import { winIgnoreMouse, winMouseMove } from '../constants/event'

export function setupWindowHandlers(win: BrowserWindow | null) {
  ipcMain.on(winIgnoreMouse, (_, ignore) => {
    win?.setIgnoreMouseEvents(ignore, { forward: true })
  })

  ipcMain.on(winMouseMove, (_, pos) => {
    win?.setPosition(pos.posX, pos.posY)
  })
}
