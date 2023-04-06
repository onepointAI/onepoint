import { IpcMainInvokeEvent, ipcMain } from 'electron'
import Store from 'electron-store'

const store = new Store()

export function setupStoreHandlers() {
  ipcMain.handle(
    'setStore',
    async (
      event: IpcMainInvokeEvent,
      { key, blob }: { key: string; blob: any }
    ) => {
      store.set(key, blob)
    }
  )
}
