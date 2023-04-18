import { IpcMainInvokeEvent, ipcMain, shell } from 'electron'

export function setupLinkHandlers() {
  ipcMain.on('jumpLink', async (event: IpcMainInvokeEvent, link: string) => {
    shell.openExternal(link)
  })
}
