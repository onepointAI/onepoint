import { api } from '../electron/client/bridge'

declare global {
  // eslint-disable-next-line
  interface Window {
    Main: typeof api
  }
}
