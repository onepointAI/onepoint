export class Singleton {
  private static instance: Singleton

  private static copyFromElectron = false

  private static recentApp: string

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

  public getCopyFromElectron() {
    return Singleton.copyFromElectron
  }

  public getRecentApp() {
    return Singleton.recentApp
  }
}
