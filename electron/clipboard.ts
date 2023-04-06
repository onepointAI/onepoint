import {
  IpcMainInvokeEvent, ipcMain, BrowserWindow, clipboard,
} from 'electron';
import { Singleton } from './global';
import { activeApp, applySelection } from './os';
import { Logger } from './util';

const clipboardWatcher = require('electron-clipboard-watcher');

export function listen(win: BrowserWindow | null) {
  clipboardWatcher({
    // (optional) delay in ms between polls
    watchDelay: 200,
    // handler for when image data is copied into the clipboard
    onImageChange() {},
    // handler for when text data is copied into the clipboard
    onTextChange(text: string) {
      if (Singleton.getInstance().getCopyFromElectron()) {
        Logger.log('来自chat内容拷贝');
        Singleton.getInstance().setCopyStateSource(false);
      }
      // TODO: 粘贴板内容变化弹窗，感觉没必要保留，会对用户体验造成非常大的影响
      // setWindowVisile(true)
      //   win?.webContents.send('clipboard_change', text)
    },
  });

  ipcMain.handle(
    'attemptChange',
    async (
      event: IpcMainInvokeEvent,
      changes: string,
    ) => {
      try {
        clipboard.writeText(changes);
        await activeApp(Singleton.getInstance().getRecentApp());
        const result = await applySelection();
        Logger.log('应用改变:', result);
      } catch (e) {
        Logger.error(e);
      }
    },
  );
}
