import { IpcMainInvokeEvent, ipcMain } from 'electron'
import { speakText as speakTextEvt } from '../constants/event'
import { speakTxt } from '../os/applescript'
import { Logger } from '../utils/util'

export function setupSoundHandlers() {
  ipcMain.handle(
    speakTextEvt,
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
