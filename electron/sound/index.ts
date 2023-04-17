import { IpcMainInvokeEvent, ipcMain } from 'electron'
import { speakTxt } from '../os/applescript'
import { Logger } from '../utils/util'

export function setupSoundHandlers() {
  ipcMain.handle(
    'speakText',
    async (event: IpcMainInvokeEvent, resp: string) => {
      try {
        // https://gist.github.com/mculp/4b95752e25c456d425c6
        speakTxt(resp, 200)
        return true
      } catch (e) {
        Logger.error(e)
        return false
      }
    }
  )
}
