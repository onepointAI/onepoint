export const timeoutPromise = (timeout: number, timeoutTips: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(timeoutTips))
    }, timeout)
  })
}
