import { contextBridge, ipcRenderer } from 'electron';

export const api = {
  /**
   * Emit events
   */
  setWinMouseIgnore: (ignore: boolean) => {
    ipcRenderer.send('win_ignore_mouse', ignore);
  },
  sendMessage: (message: string) => {
    ipcRenderer.send('message', message);
  },
  setStore: (key: string, blob: any) => {
    ipcRenderer.invoke('setStore', { key, blob });
  },
  attemptChange: (changes: string) => {
    ipcRenderer.invoke('attemptChange', changes);
  },
  /**
   * Provide an easier way to listen to events
   */
  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  },
};

contextBridge.exposeInMainWorld('Main', api);
