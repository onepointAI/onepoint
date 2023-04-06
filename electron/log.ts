import log from 'electron-log'

export default (): typeof log => {
  log.transports.file.level = 'debug'
  log.transports.file.fileName = 'user.log'
  log.transports.file.format =
    '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
  log.transports.file.maxSize = 1048576
  return log
}
