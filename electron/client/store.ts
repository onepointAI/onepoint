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

  ipcMain.handle(
    'getStore',
    async (event: IpcMainInvokeEvent, { key }: { key: string }) => {
      return store.get(key)
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
  type,
}: {
  prompt: string
  response: string
  type: string
}) {
  const mapStr = store.get(StorageChatKey) as string | undefined
  if (typeof mapStr !== 'undefined') {
    const chatMap = JSON.parse(mapStr)
    const list = chatMap[type]
    if (Array.isArray(list)) {
      list.push({
        prompt,
        response,
      })
    }
    store.set(StorageChatKey, JSON.stringify(chatMap))
  } else {
    const map = {
      [type]: [
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
    const list = chatMap[type]
    return list
  } else {
    return []
  }
}
