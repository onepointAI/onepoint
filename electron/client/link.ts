import { IpcMainInvokeEvent, ipcMain, shell } from 'electron'
import { jumpLink } from '../constants/event'

export function setupLinkHandlers() {
  ipcMain.on(jumpLink, async (event: IpcMainInvokeEvent, link: string) => {
    shell.openExternal(link)
  })
}
