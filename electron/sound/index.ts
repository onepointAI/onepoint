import { IpcMainInvokeEvent, ipcMain } from 'electron'
import { speakTxt } from '../os/applescript'
import { Logger } from '../utils/util'

export function setupSoundHandlers() {
  ipcMain.handle(
    'speakText',
    async (event: IpcMainInvokeEvent, resp: string) => {
      try {
        speakTxt(resp, 'Ting-Ting', 200)
        return true
      } catch (e) {
        Logger.error(e)
        return false
      }
    }
  )
}
