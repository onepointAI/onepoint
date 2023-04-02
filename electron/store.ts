import { IpcMainInvokeEvent, ipcMain } from 'electron'
import Store from 'electron-store'

const store = new Store()

export function setupStoreHandlers() {
  console.log('=== setUpSotreHandleer ===>')
  ipcMain.handle(
    'setStore',
    async function (
      event: IpcMainInvokeEvent,
      { key, blob }: { key: string; blob: any }
    ) {
      console.log('==== set ===>', key, blob)
      store.set(key, blob)
    }
  )
}
