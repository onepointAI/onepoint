import { BrowserWindow } from 'electron'

export const setWindowVisile = (opt: {
  win: BrowserWindow | null
  visible?: boolean
}) => {
  const { win, visible } = opt
  if (!visible) {
    win?.hide()
    win?.blur()
    return
  }
  win?.setAlwaysOnTop(true)
  win?.setVisibleOnAllWorkspaces(false)
  win?.focus()
  win?.show()
}
