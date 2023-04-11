import { IpcMainInvokeEvent, ipcMain } from 'electron'
import Store from 'electron-store'
import { StorageChatKey } from '../constants'

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

  ipcMain.handle('getStore', async (event: IpcMainInvokeEvent, key: string) => {
    return store.get(key)
  })

  ipcMain.handle(
    'getChatList',
    async (event: IpcMainInvokeEvent, preset: string) => {
      return getChatList(preset)
    }
  )
}

export interface ChatContent {
  prompt: string
  response: string
}

export function setChat({
  prompt,
  response,
  preset,
}: {
  prompt: string
  response: string
  preset: string
}) {
  const mapStr = store.get(StorageChatKey) as string | undefined
  if (typeof mapStr !== 'undefined') {
    const chatMap = JSON.parse(mapStr)
    const list = chatMap[preset]
    if (Array.isArray(list)) {
      list.push({
        prompt,
        response,
      })
    }
    store.set(StorageChatKey, JSON.stringify(chatMap))
  } else {
    const map = {
      [preset]: [
        {
          prompt,
          response,
        },
      ],
    }
    store.set(StorageChatKey, JSON.stringify(map))
  }
}

export function getChatList(type: string): ChatContent[] {
  const mapStr = store.get(StorageChatKey) as string | undefined
  if (typeof mapStr !== 'undefined') {
    const chatMap = JSON.parse(mapStr)
    const list = chatMap[type] || []
    return list
  } else {
    return []
  }
}
