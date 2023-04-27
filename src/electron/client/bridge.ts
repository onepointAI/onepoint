import { contextBridge, ipcRenderer } from 'electron'
import { PresetType, PosType } from '../../@types'
import { Languages } from '../../i18n'
import {
  winIgnoreMouse,
  winMouseMove,
  attemptChange,
  usePreset,
  jumpLink,
  copyText,
  speakText,
  setStore,
  getStore,
  removeChat,
  getChatList,
  addPrompt,
  removePrompt,
  getPromptList,
  editPrompt,
  setPluginPrompt,
  getPluginPrompt,
  changeLanguage,
  runScript,
} from '../constants/event'

export const api = {
  /**
   * Emit events
   */
  ignoreWinMouse: (ignore: boolean) => ipcRenderer.send(winIgnoreMouse, ignore),
  moveWindowPos: (pos: PosType) => ipcRenderer.send(winMouseMove, pos),
  setUsePreset: (preset: PresetType) => ipcRenderer.send(usePreset, preset),
  jumpLink: (link: string) => ipcRenderer.send(jumpLink, link),
  changeLanguage: (lng: Languages) => ipcRenderer.send(changeLanguage, lng),
  setStore: (key: string, blob: any) =>
    ipcRenderer.invoke(setStore, { key, blob }),
  getSettings: (key: string) => ipcRenderer.invoke(getStore, key),
  attemptChange: (changes: string) =>
    ipcRenderer.invoke(attemptChange, changes),
  copyText: (changes: string) => ipcRenderer.invoke(copyText, changes),
  speakText: (changes: string) => ipcRenderer.invoke(speakText, changes),
  getChatList: (preset: PresetType) => ipcRenderer.invoke(getChatList, preset),
  removeChat: (preset: PresetType, index: number) =>
    ipcRenderer.invoke(removeChat, { preset, index }),
  addPrompt: (character: string, prompt: string) =>
    ipcRenderer.invoke(addPrompt, { character, prompt }),
  editPrompt: (former: string, character: string, prompt: string) =>
    ipcRenderer.invoke(editPrompt, { former, character, prompt }),
  removePrompt: (character: string) =>
    ipcRenderer.invoke(removePrompt, { character }),
  getPromptList: () => ipcRenderer.invoke(getPromptList),
  setPluginPrompt: (plugin: string, character: string) =>
    ipcRenderer.invoke(setPluginPrompt, { plugin, character }),
  getPluginPrompt: (plugin: string) =>
    ipcRenderer.invoke(getPluginPrompt, { plugin }),
  runScript: (script: string) => ipcRenderer.invoke(runScript, script),

  /**
   * Provide an easier way to listen to events
   */
  on: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data))
  },
}

contextBridge.exposeInMainWorld('Main', api)
