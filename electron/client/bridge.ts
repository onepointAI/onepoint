import { contextBridge, ipcRenderer } from 'electron'
import { PresetType } from '../../src/@types'

export const api = {
  /**
   * Emit events
   */
  setWinMouseIgnore: (ignore: boolean) =>
    ipcRenderer.send('winIgnoreMouse', ignore),
  setUsePreset: (preset: PresetType) => ipcRenderer.send('usePreset', preset),
  sendMessage: (message: string) => ipcRenderer.send('message', message),
  setStore: (key: string, blob: any) =>
    ipcRenderer.invoke('setStore', { key, blob }),
  attemptChange: (changes: string) =>
    ipcRenderer.invoke('attemptChange', changes),
  copyText: (changes: string) => ipcRenderer.invoke('copyText', changes),
  getSettings: (key: string) => ipcRenderer.invoke('getStore', key),
  getChatList: (preset: PresetType) =>
    ipcRenderer.invoke('getChatList', preset),
  removeChat: (preset: PresetType, index: number) =>
    ipcRenderer.invoke('removeChat', { preset, index }),

  /**
   * Provide an easier way to listen to events
   */
  on: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data))
  },
}

contextBridge.exposeInMainWorld('Main', api)
