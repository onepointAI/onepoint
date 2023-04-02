import { 
  app, 
  BrowserWindow, 
  ipcMain, 
  clipboard, 
  globalShortcut 
} from 'electron'
// import { chat } from './chat'

require('./server')

const applescript = require('applescript');


declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

const clipboardWatcher = require('electron-clipboard-watcher')
let win: BrowserWindow | null
let copyFromElectron: boolean = false
let lastApp: string

export const setCopyStateSource = (fromElectron: boolean) => {
  copyFromElectron = fromElectron
}

export const getLastApp = () => {
  return lastApp
}

const setWindowVisile = (visible ?: boolean) => {
  if(!visible) {
    win?.hide()
    win?.blur()
    return 
  } 
  // win?.setAlwaysOnTop(true)
  win?.setVisibleOnAllWorkspaces(true, { 
    visibleOnFullScreen: true 
  })
  win?.focus()
  win?.show()
}

function createWindow () {
  win = new BrowserWindow({    
    // useContentSize: true,
    resizable: false,
    width: 800,
    height: 600,
    frame: false,
    show: true,
    transparent: true,
    backgroundColor: '#00000000',
    skipTaskbar: true,
    webPreferences: {
      webSecurity: false,      
      backgroundThrottling: false,
      contextIsolation: true,
      webviewTag: true,
      nodeIntegration: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
      // enableRemoteModule: true,
      // preload: path.join(__static, "preload.js")
    }
  })
  if(process.env.NODE_ENV !== 'production') {
    // win?.webContents.openDevTools({
    //   mode:'bottom'
    // })
  } 
  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  win.on('closed', () => {
    win = null
  })
  win.on("blur", () => {
    setWindowVisile(false)
  });
  // win.setIgnoreMouseEvents(true, { forward: true })
}

async function registerListeners () {


  // Very basic AppleScript command. Returns the song name of each
  // currently selected track in iTunes as an 'Array' of 'String's.
  // const script = `tell application "System Events" 
  //   set activeApp to name of second application process whose frontmost is true 
  // end tell
  // `;

  // TODO: 系统级复制粘贴  // exec err Error: 31:67: execution error: “System Events”遇到一个错误：“osascript”不允许发送按键。 (1002)
  // const script = `tell application "System Events"
  //   key code 9 using {command down}
  // end tell
  // `

  // const script = `tell application "System Events" to get the name of every process whose background only is false`
  // const script = 'tell application "iTunes" to get name of selection';

  // const script = `
  // set frontmostAppName to name of 1st process whose frontmost is true
  // `
  // const script = `
  // tell application "Visual Studio Code"
  //   activate
  // end tell  
  // `

  // applescript.execString(script, (err: any, rtn: any) => {
  //   if (err) {
  //     // Something went wrong!
  //     console.log('exec err',err)
  //   }
  //   console.log('exec success', rtn)
  // });
  
  
  ipcMain.on('message', (_, message) => {
    console.log(message)    
  })
  ipcMain.on('win_ignore_mouse', (_, ignore) => {
    win?.setIgnoreMouseEvents(ignore, { forward: true })
  })
  
  clipboardWatcher({
    // (optional) delay in ms between polls
    watchDelay: 200,
    // handler for when image data is copied into the clipboard
    onImageChange () {  },
    // handler for when text data is copied into the clipboard
    onTextChange (text: string) {
      console.log('text changed:', text)
      if(copyFromElectron) {
        console.log('来自chat内容拷贝')
        setCopyStateSource(false)   
        return 
      }
      // TODO: 粘贴板内容变化弹窗，感觉没必要保留，会对用户体验造成非常大的影响
      // setWindowVisile(true)
      win?.webContents.send('clipboard_change', text);
    }
  })

  globalShortcut.register('CommandOrControl+k', () => {    
    const visible = win?.isVisible() && win.isFocused();
    console.log('window visible ==>', visible);

    // 保存当前执行的程序名
    if(!visible) {
      // set frontApp to name of first application process whose frontmost is true
      const script = `
      tell application "System Events"
        set frontmostAppName to displayed name of first application process whose frontmost is true        
      end tell`
      
      applescript.execString(script, (err: any, rtn: any) => {
        if (err) {
          // Something went wrong!
          console.log('exec err',err)
          setWindowVisile(true)
          return
        }
        console.log('last app ==>', lastApp)
        lastApp = rtn

        setWindowVisile(true)        
      });

      

      
      return 
    }
    setWindowVisile(false)
  })
}

app.on('ready', createWindow)
  .whenReady()
  .then(registerListeners)
  .catch(e => console.error(e))

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
