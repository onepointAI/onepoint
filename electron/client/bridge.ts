import { contextBridge, ipcRenderer } from 'electron'

export const api = {
  /**
   * Emit events
   */
  setWinMouseIgnore: (ignore: boolean) => {
    ipcRenderer.send('winIgnoreMouse', ignore)
  },
  sendMessage: (message: string) => {
    ipcRenderer.send('message', message)
  },
  setStore: (key: string, blob: any) => {
    ipcRenderer.invoke('setStore', { key, blob })
  },
  attemptChange: (changes: string) => {
    ipcRenderer.invoke('attemptChange', changes)
  },
  getSettings: (key: string) => ipcRenderer.invoke('getStore', { key }),

  /**
   * Provide an easier way to listen to events
   */
  on: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data))
  },
}

contextBridge.exposeInMainWorld('Main', api)
