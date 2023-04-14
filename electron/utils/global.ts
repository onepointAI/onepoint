import { PresetType } from '../../src/@types'
export class Singleton {
  private static instance: Singleton

  private static copyFromElectron = false

  private static recentApp: string

  private static preset: PresetType

  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton()
    }
    return Singleton.instance
  }

  public setRecentApp(app: string) {
    Singleton.recentApp = app
  }

  public setCopyStateSource(fromElectron: boolean) {
    Singleton.copyFromElectron = fromElectron
  }

  public setCurPreset(preset: PresetType) {
    Singleton.preset = preset
  }

  public getCopyFromElectron() {
    return Singleton.copyFromElectron
  }

  public getRecentApp() {
    return Singleton.recentApp
  }

  public getCurPreset() {
    return Singleton.preset
  }
}
