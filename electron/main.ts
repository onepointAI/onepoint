import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron'
const clipboardWatcher = require('electron-clipboard-watcher')
// const nodeAbi = require('node-abi')
// const mouseEvents = require("global-mouse-events");
// const robot = require('@jitsi/robotjs');
// const mouse = require("osx-mouse")()
// import mouseEvents from 'osx-mouse';
// import mouseHooks from "mouse-hooks"

// var robot = require("robotjs");;
// const {
//   mouse
// } = require("@nut-tree/nut-js");
// const {
//   preloadLanguages,
//   Language,
//   LanguageModelType,
//   configure,
// } = require("@nut-tree/plugin-ocr");

let mainWindow: BrowserWindow | null

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

console.info(process.versions);

// console.info(nodeAbi.getApi());
// const assetsPath =
//   process.env.NODE_ENV === 'production'
//     ? process.resourcesPath
//     : app.getAppPath()


function createWindow () {
  mainWindow = new BrowserWindow({
    // icon: path.join(assetsPath, 'assets', 'icon.png'),
    width: 1100,
    height: 700,
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    },
    frame: false
  })

  mainWindow.webContents.openDevTools({
    mode:'bottom'
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

async function registerListeners () {
  /**
   * This comes from bridge integration, check bridge.ts
   */
  ipcMain.on('message', (_, message) => {
    console.log(message)
  })  

  // const position = await mouse.getPosition();
  // console.log('== position ==>', position);
  // clipboard.writeText('Example string', 'selection')
  // console.log(clipboard.readText())


  // mouseEvents.on("mousedown", (event: any) => {
  //   console.log(event); // { x: 2962, y: 483, button: 1 }
  // });

  // globalShortcut.register('CommandOrControl+c', () => {
  //   console.log('Electron loves global shortcuts!')
  //   // const text = clipboard.readText()
  //   // console.log('剪切板内容:', clipboard.readText())
    
  // })

  clipboardWatcher({
    // (optional) delay in ms between polls
    watchDelay: 1000,
  
    // handler for when image data is copied into the clipboard
    onImageChange () {  },
  
    // handler for when text data is copied into the clipboard
    onTextChange (text: string) {
      console.log('text changed:', text);
    }
  })

  // robot.mouseClick((mouseEvt: any) => {
  //   console.log('mouse click ===>', mouseEvt);
  // })

  // robot.mouseToggle("up", "left");

  // robot.keyTap("c", "control");
  // move, left-down, left-up, left-drag, right-up, right-down and right-drag
  // const mouseTrack = mouseEvents();
  // // 按下去的 time
  // let down_time = 0;

  // // 是否弹起
  // let isPress = false;
  // let i = 0;
  // mouse.on('move', () => {
  //   console.log('move===>', i++)
  // })

  // mouse.on('right-drag', () => {
  //   console.log('right-drag===>', i++)
  // })

  // // 监听右击
  // mouseTrack.on('right-down', () => {
  //     isPress = true;
  //     down_time = Date.now();
  //     // 长按 500ms 后触发
  //     // setTimeout(async () => {
  //     //   if (isPress) {
  //     //     // 获取选中内容
  //     //     // const copyResult = await getSelectedText();
  //     //     console.log('右键选中了')
  //     // }, 500 )

  //     console.log('right-down....');
  //     setTimeout(() => {
  //       if (isPress) {
  //         console.log('右键选中了')
  //       }
  //     }, 500)
  // })
  // mouseTrack.on('right-up', () => {
  //   console.log('right up....');
  //     isPress = false;
  // });
  // mouseHooks.on("mouse-up", data => {
  //   console.log("mouse-up!!!")
  //   console.log(data.x, data.y, data.button);
  // });

  // mouseHooks.on("mouse-down", data => {
  //   console.log("mouse-down!!!")
  //   console.log(data.x, data.y, data.button);
  // });
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
