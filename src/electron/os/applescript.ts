import { IpcMainInvokeEvent, ipcMain } from 'electron'
import { Logger } from '../utils/util'
import { runScript } from '../constants/event'
const applescript = require('applescript')

export function setupScriptHandlers() {
  ipcMain.handle(
    runScript,
    async (event: IpcMainInvokeEvent, script: string) => {
      runAppleScript(script)
    }
  )
}

function runAppleScript(script: string) {
  const date = Date.now()
  return new Promise((resolve, reject) => {
    applescript.execString(script, (err: any, rtn: any) => {
      Logger.log(`runscript: ${script}`, Date.now() - date)
      if (err) {
        reject(err)
        return
      }
      resolve(rtn)
    })
  })
}

export function printer(words: string) {
  return `
  set textBuffer to "${words}"
  repeat with i from 1 to count characters of textBuffer
		set the clipboard to (character i of textBuffer)
		delay 0.05
		keystroke "v" using command down
	end repeat
  `
}
export function getSelection() {
  const script = `
    tell application "System Events" to keystroke "c" using {command down}
    delay 0.5
    set selectedText to the clipboard
  `
  return runAppleScript(script)
}

export function applySelection() {
  const script = `
    tell application "System Events" to keystroke "v" using {command down}
    delay 1
    set selectedText to the clipboard
  `
  return runAppleScript(script)
}

export function getRecentApp() {
  const script = `
  tell application "System Events"
    set frontmostAppName to displayed name of first application process whose frontmost is true        
  end tell`
  return runAppleScript(script)
}

export function activeApp(app: string) {
  const script = `
    tell application "${app}"
      activate
    end tell  
    `
  return runAppleScript(script)
}

export function getBrowserContnet() {
  const script = `
  tell application "Google Chrome"
    tell window 1
      tell active tab
        execute javascript "document.documentElement.innerText"
      end tell
    end tell    
  end tell
  `
  return runAppleScript(script)
}

export function getBrowserUrl(browser: string) {
  const safariScript = `tell application "Safari" to get the URL of the current tab of window 1
  `
  const chromeScript = `
  tell application "Google Chrome" to get the URL of the active tab of window 1  
  `
  if (browser.includes('Chrome')) return runAppleScript(chromeScript)
  if (browser.includes('Safari')) return runAppleScript(safariScript)
  return ''
}

export function speakTxt(txt: string, rate: number) {
  // using "${voice}"
  const script = `
  tell application "Finder" to say "${txt}" speaking rate ${rate}
  `
  return runAppleScript(script)
}
