import { contextBridge, ipcRenderer } from 'electron'

export const api = {  
  /**
   * Emit events
   */
  setWinMouseIgnore: (ignore: boolean) => {
    ipcRenderer.send('win_ignore_mouse', ignore)
  },
  sendMessage: (message: string) => {
    ipcRenderer.send('message', message)
  },
  /**
   * Provide an easier way to listen to events
   */
  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (_, data) => callback(data))
  }
}

contextBridge.exposeInMainWorld('Main', api)
