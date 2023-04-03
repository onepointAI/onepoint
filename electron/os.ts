import os from 'os'
const applescript = require('applescript')

function runAppleScript(script: string) {
  return new Promise((resolve, reject) => {
    applescript.execString(script, (err: any, rtn: any) => {
      if (err) {
        reject(err)
        return
      }
      resolve(rtn)
    })
  })
}

export function getSelection(appName: string) {
  const script = `
    tell application "${appName}" to get selection of document <doc index>
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