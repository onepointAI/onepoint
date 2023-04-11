import { Logger } from './util'
const applescript = require('applescript')

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

// TODO: 这种方法在vscode上哪怕没有选中也会复制一行
export function getSelection() {
  const script = `
    tell application "System Events" to keystroke "c" using {command down}
    delay 0.1
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
        execute javascript "document.body.textContent"
      end tell
    end tell
    
  end tell
  `
  return runAppleScript(script)
}
