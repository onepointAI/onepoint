import { contextBridge, ipcRenderer } from 'electron'
import { PresetType } from '../../src/@types'

export const api = {
  /**
   * Emit events
   */
  setWinMouseIgnore: (ignore: boolean) => {
    return ipcRenderer.send('winIgnoreMouse', ignore)
  },
  setUsePreset: (preset: PresetType) => ipcRenderer.send('usePreset', preset),
  sendMessage: (message: string) => ipcRenderer.send('message', message),
  jumpLink: (link: string) => ipcRenderer.send('jumpLink', link),
  setStore: (key: string, blob: any) =>
    ipcRenderer.invoke('setStore', { key, blob }),
  attemptChange: (changes: string) =>
    ipcRenderer.invoke('attemptChange', changes),
  copyText: (changes: string) => ipcRenderer.invoke('copyText', changes),
  speakText: (changes: string) => ipcRenderer.invoke('speakText', changes),
  getSettings: (key: string) => ipcRenderer.invoke('getStore', key),
  getChatList: (preset: PresetType) =>
    ipcRenderer.invoke('getChatList', preset),
  removeChat: (preset: PresetType, index: number) =>
    ipcRenderer.invoke('removeChat', { preset, index }),
  addPrompt: (character: string, prompt: string) =>
    ipcRenderer.invoke('addPrompt', { character, prompt }),
  removePrompt: (character: string) =>
    ipcRenderer.invoke('removePrompt', { character }),
  getPromptList: () => ipcRenderer.invoke('getPromptList'),
  editPrompt: (former: string, character: string, prompt: string) =>
    ipcRenderer.invoke('editPrompt', { former, character, prompt }),

  /**
   * Provide an easier way to listen to events
   */
  on: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data))
  },
}

contextBridge.exposeInMainWorld('Main', api)
